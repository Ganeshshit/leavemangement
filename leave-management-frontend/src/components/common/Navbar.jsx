import { LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import './navbar.css'

const Navbar = ({ onMenuToggle }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    const roleLabel = user?.role === 'employer' ? 'Employer' : 'Employee'
    const roleBadgeClass = user?.role === 'employer'
        ? 'role-badge role-badge--employer'
        : 'role-badge role-badge--employee'

    return (
        <header className="navbar">
            {/* Left: Logo */}
            <div className="navbar-logo">
                <div className="navbar-logo-inner">
                    <div className="navbar-logo-icon">
                        <span>LD</span>
                    </div>
                    <span className="navbar-logo-name">LeaveDesk</span>
                </div>
            </div>

            {/* Right: User menu */}
            <div className="navbar-right">
                {/* Role badge */}
                <span className={roleBadgeClass}>{roleLabel}</span>

                {/* User dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="navbar-user-btn"
                    >
                        <div className="navbar-avatar">{initials}</div>
                        <span className="navbar-user-name">{user?.name}</span>
                        <ChevronDown size={14} className="navbar-chevron" />
                    </button>

                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <div className="navbar-dropdown-info">
                                <p className="navbar-dropdown-name">{user?.name}</p>
                                <p className="navbar-dropdown-email">{user?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="navbar-logout-btn">
                                <LogOut size={15} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Close dropdown on outside click */}
            {dropdownOpen && (
                <div className="navbar-backdrop" onClick={() => setDropdownOpen(false)} />
            )}
        </header>
    )
}

export default Navbar