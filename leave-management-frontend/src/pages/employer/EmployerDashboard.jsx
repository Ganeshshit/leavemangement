import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useLeaveStore from '../../store/leaveStore'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LeaveApprovalTable from '../../components/employer/LeaveApprovalTable'
import './employer.css'

const EmployerDashboard = () => {
    const { user } = useAuth()
    const { fetchAllLeaves } = useLeaveStore()

    useEffect(() => {
        fetchAllLeaves()
    }, [])

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
                        <p className="page-header-greeting">{greeting} 👋</p>
                        <h1 className="page-title">{user?.name}</h1>
                        <p className="page-subtitle">Review and manage employee leave requests.</p>
                    </div>

                    {/* Approval table with stats */}
                    <LeaveApprovalTable />
                </main>
            </div>
        </div>
    )
}

export default EmployerDashboard