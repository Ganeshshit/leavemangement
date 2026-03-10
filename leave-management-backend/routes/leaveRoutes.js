const express = require('express');
const router = express.Router();

const {
    createLeaveRequest,
    getEmployeeLeaves,
    getAllLeaves,
    updateLeaveStatus,
} = require('../controllers/leaveController');

const { protect } = require('../middleware/authMiddleware');
const { allowEmployeeOnly, allowEmployerOnly } = require('../middleware/roleMiddleware');
const { createLeaveValidator, updateLeaveStatusValidator } = require('../utils/validators');

// ─── Employee Routes ──────────────────────────────────────────────────────────

// POST /api/leaves       - Submit a new leave request (employee only)
router.post(
    '/',
    protect,
    allowEmployeeOnly,
    createLeaveValidator,
    createLeaveRequest
);

// GET /api/leaves/my     - Get all leaves for logged-in employee (employee only)
router.get(
    '/my',
    protect,
    allowEmployeeOnly,
    getEmployeeLeaves
);

// ─── Employer Routes ──────────────────────────────────────────────────────────

// GET /api/leaves        - Get all leave requests (employer only)
router.get(
    '/',
    protect,
    allowEmployerOnly,
    getAllLeaves
);

// PUT /api/leaves/:id    - Approve or Reject a leave request (employer only)
router.put(
    '/:id',
    protect,
    allowEmployerOnly,
    updateLeaveStatusValidator,
    updateLeaveStatus
);

module.exports = router;