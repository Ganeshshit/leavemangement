import { CalendarPlus, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useLeaveStore from '../../store/leaveStore'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import LeaveTable from '../../components/employee/LeaveTable'
import './employeeDashboard.css'

const StatCard = ({ label, value, icon: Icon, iconVariant, delay }) => (
    <div className="stat-card" style={{ animationDelay: delay }}>
        <div className={`stat-icon stat-icon--${iconVariant}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
        </div>
    </div>
)

const EmployeeDashboard = () => {
    const { user } = useAuth()
    const { myLeaves, loading } = useLeaveStore()

    const stats = {
        total: myLeaves.length,
        pending: myLeaves.filter((l) => l.status === 'Pending').length,
        approved: myLeaves.filter((l) => l.status === 'Approved').length,
        rejected: myLeaves.filter((l) => l.status === 'Rejected').length,
    }

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-column">
                <Navbar />
                <main className="page-content">
                    {/* Page header */}
                    <div className="page-header">
                        <div>
                            <p className="page-header-greeting">{greeting}</p>
                            <h1 className="page-title">{user?.name}</h1>
                            <p className="page-subtitle">Here's a summary of your leave requests.</p>
                        </div>
                        <Link to="/employee/apply" className="btn-primary">
                            <CalendarPlus size={16} />
                            Apply for Leave
                        </Link>
                    </div>

                    {/* Stats */}
                    {loading ? <Loader /> : (
                        <div className="stats-grid">
                            <StatCard label="Total Requests" value={stats.total} icon={TrendingUp} iconVariant="default" delay="0ms" />
                            <StatCard label="Pending" value={stats.pending} icon={Clock} iconVariant="amber" delay="60ms" />
                            <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} iconVariant="emerald" delay="120ms" />
                            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} iconVariant="red" delay="180ms" />
                        </div>
                    )}

                    {/* Leave history table */}
                    <LeaveTable />
                </main>
            </div>
        </div>
    )
}

export default EmployeeDashboard