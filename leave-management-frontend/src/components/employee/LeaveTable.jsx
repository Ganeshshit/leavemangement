import { useEffect } from 'react'
import { ClipboardList, Clock, CheckCircle2, XCircle } from 'lucide-react'
import useLeaveStore from '../../store/leaveStore'
import Loader from '../common/Loader'
import { formatDate, calcDays } from '../../utils/formatDate'
import './leaveTable.css'

const StatusBadge = ({ status }) => {
    if (status === 'Approved') {
        return (
            <span className="badge-approved">
                <CheckCircle2 size={11} />
                Approved
            </span>
        )
    }
    if (status === 'Rejected') {
        return (
            <span className="badge-rejected">
                <XCircle size={11} />
                Rejected
            </span>
        )
    }
    return (
        <span className="badge-pending">
            <Clock size={11} />
            Pending
        </span>
    )
}

const LeaveTable = () => {
    const { myLeaves, loading, error, fetchMyLeaves } = useLeaveStore()

    useEffect(() => {
        fetchMyLeaves()
    }, [])

    if (loading) return <Loader text="Loading your leave requests…" />

    if (error) {
        return (
            <div className="card table-error">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="card animate-slide-up">
            {/* Header */}
            <div className="table-card-header">
                <div className="table-card-header-left">
                    <div className="table-icon-wrap">
                        <ClipboardList size={18} />
                    </div>
                    <div>
                        <h2 className="table-card-title">My Leave Requests</h2>
                        <p className="table-card-count">
                            {myLeaves.length} request{myLeaves.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {myLeaves.length === 0 ? (
                <div className="table-empty">
                    <div className="table-empty-icon">
                        <ClipboardList size={24} />
                    </div>
                    <p className="table-empty-primary">No leave requests yet.</p>
                    <p className="table-empty-secondary">Submit your first leave request to get started.</p>
                </div>
            ) : (
                <div className="table-scroll">
                    <table className="leave-table">
                        <thead>
                            <tr>
                                {['Leave Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status'].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {myLeaves.map((leave, i) => (
                                <tr key={leave._id} style={{ animationDelay: `${i * 50}ms` }}>
                                    <td className="td-type">{leave.leaveType}</td>
                                    <td className="td-date">{formatDate(leave.startDate)}</td>
                                    <td className="td-date">{formatDate(leave.endDate)}</td>
                                    <td>
                                        <span className="td-days-badge">
                                            {calcDays(leave.startDate, leave.endDate)}
                                        </span>
                                    </td>
                                    <td className="td-reason">
                                        <span className="td-reason-text" title={leave.reason}>
                                            {leave.reason}
                                        </span>
                                    </td>
                                    <td>
                                        <StatusBadge status={leave.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default LeaveTable