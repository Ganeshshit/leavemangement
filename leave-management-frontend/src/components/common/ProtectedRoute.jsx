import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * ProtectedRoute
 * - Redirects to /login if not authenticated
 * - Optionally restricts to a specific role
 */
const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, role: userRole } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If route requires a role but it is missing, avoid self-redirect loops.
    if (role && !userRole) {
        return <Navigate to="/login" replace />
    }

    if (role && userRole !== role) {
        const fallback = userRole === 'employer' ? '/employer/dashboard' : '/employee/dashboard'
        return <Navigate to={fallback} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
