/**
 * Role-Based Access Control middleware
 * Must be used AFTER the protect middleware (req.user must exist)
 */

/**
 * Allow only employers to access the route
 */
const allowEmployerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'employer') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.',
    });
};

/**
 * Allow only employees to access the route
 */
const allowEmployeeOnly = (req, res, next) => {
    if (req.user && req.user.role === 'employee') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Employees only.',
    });
};

/**
 * Generic role check - allow any of the specified roles
 * Usage: authorizeRoles('employer', 'employee')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Allowed roles: ${roles.join(', ')}`,
            });
        }
        next();
    };
};

module.exports = {
    allowEmployerOnly,
    allowEmployeeOnly,
    authorizeRoles,
};