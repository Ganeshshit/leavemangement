import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import './auth.css'

const Login = () => {
    const navigate = useNavigate()
    const { login, loading, error, isAuthenticated, role, clearError } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && role) {
            navigate(role === 'employer' ? '/employer/dashboard' : '/employee/dashboard', { replace: true })
        }
    }, [isAuthenticated, role, navigate])

    useEffect(() => {
        return () => clearError()
    }, [clearError])

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }

    const validate = () => {
        const errs = {}
        if (!form.email) errs.email = 'Email is required.'
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.'
        if (!form.password) errs.password = 'Password is required.'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setFieldErrors(errs); return }

        const result = await login(form)
        if (result?.success) {
            navigate(result.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard', { replace: true })
        }
    }

    return (
        <div className="auth-bg">
            <div className="auth-wrapper">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <span>LD</span>
                    </div>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your LeaveDesk account</p>
                </div>

                {/* Card */}
                <div className="card">
                    {/* API error */}
                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-dot" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Email */}
                        <div className="form-field">
                            <label className="form-label" htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="form-input"
                            />
                            {fieldErrors.email && <p className="form-error">{fieldErrors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="form-field">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="form-error">{fieldErrors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Register link */}
                <p className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
