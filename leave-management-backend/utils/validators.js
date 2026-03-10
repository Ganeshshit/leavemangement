const { body, param } = require('express-validator');

// ─── Auth Validators ──────────────────────────────────────────────────────────

const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['employee', 'employer']).withMessage('Role must be either employee or employer'),
];

const loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required'),
];

// ─── Leave Validators ─────────────────────────────────────────────────────────

const createLeaveValidator = [
    body('leaveType')
        .notEmpty().withMessage('Leave type is required')
        .isIn(['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'])
        .withMessage('Invalid leave type'),

    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)')
        .toDate(),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((endDate, { req }) => {
            const startDate = new Date(req.body.startDate);
            if (endDate < startDate) {
                throw new Error('End date must be on or after start date');
            }
            return true;
        }),

    body('reason')
        .trim()
        .notEmpty().withMessage('Reason is required')
        .isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
        .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
];

const updateLeaveStatusValidator = [
    param('id')
        .isMongoId().withMessage('Invalid leave request ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
];

module.exports = {
    registerValidator,
    loginValidator,
    createLeaveValidator,
    updateLeaveStatusValidator,
};