import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, Briefcase, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import './auth.css'

const Register = () => {
    const navigate = useNavigate()
    const { register, loading, error, isAuthenticated, role, clearError } = useAuth()

    const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

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
        if (!form.name.trim()) errs.name = 'Full name is required.'
        else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
        if (!form.email) errs.email = 'Email is required.'
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.'
        if (!form.password) errs.password = 'Password is required.'
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
        if (!form.role) errs.role = 'Please select your role.'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setFieldErrors(errs); return }

        const result = await register(form)
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
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Join LeaveDesk in seconds</p>
                </div>

                {/* Card */}
                <div className="card">
                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-dot" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Full name */}
                        <div className="form-field">
                            <label className="form-label" htmlFor="name">Full name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Jane Smith"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                                className="form-input"
                            />
                            {fieldErrors.name && <p className="form-error">{fieldErrors.name}</p>}
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
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

                        {/* Role selection */}
                        <div className="form-field">
                            <label className="form-label">I am a…</label>
                            <div className="role-grid">
                                {[
                                    { value: 'employee', label: 'Employee', icon: User, desc: 'Apply for leave' },
                                    { value: 'employer', label: 'Employer', icon: Briefcase, desc: 'Manage requests' },
                                ].map(({ value, label, icon: Icon, desc }) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, role: value }))
                                            setFieldErrors((prev) => ({ ...prev, role: '' }))
                                        }}
                                        className={`role-btn${form.role === value ? ' active' : ''}`}
                                    >
                                        <Icon size={20} />
                                        <div>
                                            <p className="role-btn-label">{label}</p>
                                            <p className="role-btn-desc">{desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {fieldErrors.role && <p className="form-error">{fieldErrors.role}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Login link */}
                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
