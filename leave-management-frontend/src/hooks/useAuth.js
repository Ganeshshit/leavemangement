import useAuthStore from '../store/authStore'

/**
 * Custom hook for convenient auth state access.
 * Usage: const { user, role, isAuthenticated, login, logout } = useAuth()
 */
const useAuth = () => {
    const user = useAuthStore((s) => s.user)
    const token = useAuthStore((s) => s.token)
    const role = useAuthStore((s) => s.role)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const loading = useAuthStore((s) => s.loading)
    const error = useAuthStore((s) => s.error)
    const login = useAuthStore((s) => s.login)
    const logout = useAuthStore((s) => s.logout)
    const register = useAuthStore((s) => s.register)
    const clearError = useAuthStore((s) => s.clearError)

    const isEmployee = role === 'employee'
    const isEmployer = role === 'employer'

    return {
        user,
        token,
        role,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        register,
        clearError,
        isEmployee,
        isEmployer,
    }
}

export default useAuth