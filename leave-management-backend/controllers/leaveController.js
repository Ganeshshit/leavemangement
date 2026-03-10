const leaveService = require('../services/leaveService');
const { handleValidationErrors } = require('../middleware/errorMiddleware');

/**
 * @desc    Create a new leave request
 * @route   POST /api/leaves
 * @access  Private - Employee only
 */
const createLeaveRequest = async (req, res, next) => {
    try {
        handleValidationErrors(req, res, async () => {
            const { leaveType, startDate, endDate, reason } = req.body;

            const leave = await leaveService.createLeave({
                employeeId: req.user._id,
                leaveType,
                startDate,
                endDate,
                reason,
                status: 'Pending',
            });

            return res.status(201).json({
                success: true,
                message: 'Leave request submitted successfully',
                data: leave,
            });
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all leave requests for the logged-in employee
 * @route   GET /api/leaves/my
 * @access  Private - Employee only
 */
const getEmployeeLeaves = async (req, res, next) => {
    try {
        const leaves = await leaveService.fetchEmployeeLeaves(req.user._id);

        return res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all leave requests (employer view)
 * @route   GET /api/leaves
 * @access  Private - Employer only
 */
const getAllLeaves = async (req, res, next) => {
    try {
        // Optional query filters: ?status=Pending&leaveType=Sick Leave
        const filters = {
            status: req.query.status || null,
            leaveType: req.query.leaveType || null,
        };

        // Remove null filters
        Object.keys(filters).forEach((k) => filters[k] === null && delete filters[k]);

        const leaves = await leaveService.fetchAllLeaves(filters);

        return res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve or Reject a leave request
 * @route   PUT /api/leaves/:id
 * @access  Private - Employer only
 */
const updateLeaveStatus = async (req, res, next) => {
    try {
        handleValidationErrors(req, res, async () => {
            const { id } = req.params;
            const { status } = req.body;

            // Check leave exists
            const existingLeave = await leaveService.fetchLeaveById(id);
            if (!existingLeave) {
                return res.status(404).json({
                    success: false,
                    message: 'Leave request not found',
                });
            }

            // Prevent re-reviewing an already reviewed leave
            if (existingLeave.status !== 'Pending') {
                return res.status(400).json({
                    success: false,
                    message: `Leave request has already been ${existingLeave.status.toLowerCase()}`,
                });
            }

            const updatedLeave = await leaveService.updateLeaveStatus(
                id,
                status,
                req.user._id
            );

            return res.status(200).json({
                success: true,
                message: `Leave request ${status.toLowerCase()} successfully`,
                data: updatedLeave,
            });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLeaveRequest,
    getEmployeeLeaves,
    getAllLeaves,
    updateLeaveStatus,
};