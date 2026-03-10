const Leave = require('../models/Leave');

/**
 * Create a new leave request
 * @param {Object} leaveData - leave request fields
 * @returns {Object} created leave document
 */
const createLeave = async (leaveData) => {
    const leave = await Leave.create(leaveData);
    return leave;
};

/**
 * Fetch all leave requests for a specific employee
 * @param {string} employeeId - MongoDB user _id
 * @returns {Array} list of leave documents
 */
const fetchEmployeeLeaves = async (employeeId) => {
    const leaves = await Leave.find({ employeeId })
        .sort({ createdAt: -1 })
        .lean();
    return leaves;
};

/**
 * Fetch all leave requests (for employer view)
 * @param {Object} filters - optional filters (status, leaveType, etc.)
 * @returns {Array} list of populated leave documents
 */
const fetchAllLeaves = async (filters = {}) => {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.leaveType) query.leaveType = filters.leaveType;

    const leaves = await Leave.find(query)
        .populate('employeeId', 'name email')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    return leaves;
};

/**
 * Get a single leave request by ID
 * @param {string} leaveId - MongoDB Leave _id
 * @returns {Object|null} leave document or null
 */
const fetchLeaveById = async (leaveId) => {
    const leave = await Leave.findById(leaveId)
        .populate('employeeId', 'name email')
        .populate('reviewedBy', 'name email');
    return leave;
};

/**
 * Approve or Reject a leave request
 * @param {string} leaveId - MongoDB Leave _id
 * @param {string} status - 'Approved' or 'Rejected'
 * @param {string} reviewedBy - employer's user _id
 * @returns {Object} updated leave document
 */
const updateLeaveStatus = async (leaveId, status, reviewedBy) => {
    const leave = await Leave.findByIdAndUpdate(
        leaveId,
        {
            status,
            reviewedBy,
            reviewedAt: new Date(),
        },
        { new: true, runValidators: true }
    )
        .populate('employeeId', 'name email')
        .populate('reviewedBy', 'name email');

    return leave;
};

module.exports = {
    createLeave,
    fetchEmployeeLeaves,
    fetchAllLeaves,
    fetchLeaveById,
    updateLeaveStatus,
};