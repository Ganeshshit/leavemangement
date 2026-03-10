import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarPlus, ClipboardList, Users } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import './sidebar.css'

const Sidebar = () => {
    const { isEmployee, isEmployer } = useAuth()

    const employeeLinks = [
        { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employee/apply', label: 'Apply for Leave', icon: CalendarPlus },
        { to: '/employee/my-leaves', label: 'My Requests', icon: ClipboardList },
    ]

    const employerLinks = [
        { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employer/all-leaves', label: 'Leave Requests', icon: Users },
    ]

    const links = isEmployee ? employeeLinks : employerLinks

    return (
        <aside className="sidebar">
            {/* Section title */}
            <div className="sidebar-section-label">
                <p>{isEmployee ? 'Employee' : 'Employer'}</p>
            </div>

            {/* Navigation links */}
            <nav className="sidebar-nav">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? ' active' : ''}`
                        }
                    >
                        <Icon size={16} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom help box */}
            <div className="sidebar-help">
                <p className="sidebar-help-title">Need help?</p>
                <p className="sidebar-help-body">
                    Contact HR for any leave policy questions.
                </p>
            </div>
        </aside>
    )
}

export default Sidebar