import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, Users, Filter, RefreshCw } from 'lucide-react'
import useLeaveStore from '../../store/leaveStore'
import Loader from '../common/Loader'
import { formatDate, calcDays } from '../../utils/formatDate'
// import './employer.css'
import '../employer/employer.css'

const StatusBadge = ({ status }) => {
    if (status === 'Approved') return <span className="badge-approved"><CheckCircle2 size={11} />Approved</span>
    if (status === 'Rejected') return <span className="badge-rejected"><XCircle size={11} />Rejected</span>
    return <span className="badge-pending"><Clock size={11} />Pending</span>
}

const LEAVE_TYPES = ['', 'Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave']
const STATUS_FILTERS = ['', 'Pending', 'Approved', 'Rejected']

const LeaveApprovalTable = () => {
    const { leaves, loading, error, fetchAllLeaves, updateLeaveStatus, successMessage } = useLeaveStore()
    const [filters, setFilters] = useState({ status: '', leaveType: '' })
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        fetchAllLeaves(filters)
    }, [filters])

    const handleAction = async (id, status) => {
        setActionLoading(id + status)
        await updateLeaveStatus(id, status)
        setActionLoading(null)
    }

    const handleFilterChange = (e) => {
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const stats = {
        total: leaves.length,
        pending: leaves.filter((l) => l.status === 'Pending').length,
        approved: leaves.filter((l) => l.status === 'Approved').length,
        rejected: leaves.filter((l) => l.status === 'Rejected').length,
    }

    return (
        <div className="approval-wrapper">
            {/* Stats row */}
            <div className="approval-stats-grid">
                {[
                    { label: 'Total', value: stats.total, mod: 'default' },
                    { label: 'Pending', value: stats.pending, mod: 'pending' },
                    { label: 'Approved', value: stats.approved, mod: 'approved' },
                    { label: 'Rejected', value: stats.rejected, mod: 'rejected' },
                ].map(({ label, value, mod }) => (
                    <div key={label} className="approval-stat-card">
                        <span className={`approval-stat-value approval-stat-value--${mod}`}>{value}</span>
                        <span className="approval-stat-label">{label}</span>
                    </div>
                ))}
            </div>

            {/* Main table card */}
            <div className="card">
                {/* Header + filters */}
                <div className="approval-card-header">
                    <div className="approval-card-header-left">
                        <div className="approval-card-icon">
                            <Users size={18} />
                        </div>
                        <div>
                            <h2 className="approval-card-title">Leave Requests</h2>
                            <p className="approval-card-subtitle">Review and manage all employee requests</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="approval-filters">
                        <Filter size={14} className="filter-icon" />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {STATUS_FILTERS.map((s) => (
                                <option key={s} value={s}>{s || 'All Statuses'}</option>
                            ))}
                        </select>
                        <select
                            name="leaveType"
                            value={filters.leaveType}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {LEAVE_TYPES.map((t) => (
                                <option key={t} value={t}>{t || 'All Types'}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => fetchAllLeaves(filters)}
                            className="filter-refresh-btn"
                            title="Refresh"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                {/* Success banner */}
                {successMessage && (
                    <div className="approval-success-banner">
                        <CheckCircle2 size={14} />
                        {successMessage}
                    </div>
                )}

                {loading && <Loader text="Loading requests…" />}

                {!loading && error && (
                    <div className="approval-error">{error}</div>
                )}

                {!loading && !error && leaves.length === 0 && (
                    <div className="approval-empty">
                        <div className="approval-empty-icon">
                            <Users size={24} />
                        </div>
                        <p className="approval-empty-text">No leave requests found.</p>
                    </div>
                )}

                {!loading && !error && leaves.length > 0 && (
                    <div className="approval-table-scroll">
                        <table className="approval-table">
                            <thead>
                                <tr>
                                    {['Employee', 'Leave Type', 'Dates', 'Days', 'Reason', 'Status', 'Action'].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => {
                                    const employee = leave.employeeId
                                    const initials = employee?.name
                                        ? employee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                                        : '?'
                                    const isPending = leave.status === 'Pending'

                                    return (
                                        <tr key={leave._id}>
                                            {/* Employee */}
                                            <td>
                                                <div className="td-employee">
                                                    <div className="td-avatar">{initials}</div>
                                                    <div className="td-employee-info">
                                                        <p className="td-employee-name">{employee?.name}</p>
                                                        <p className="td-employee-email">{employee?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="td-leave-type">{leave.leaveType}</td>

                                            <td className="td-dates">
                                                {formatDate(leave.startDate)}<br />
                                                <span className="td-dates-arrow">→</span> {formatDate(leave.endDate)}
                                            </td>

                                            <td>
                                                <span className="td-days-badge">
                                                    {calcDays(leave.startDate, leave.endDate)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="td-reason" title={leave.reason}>
                                                    {leave.reason}
                                                </span>
                                            </td>

                                            <td>
                                                <StatusBadge status={leave.status} />
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                {isPending ? (
                                                    <div className="action-btns">
                                                        <button
                                                            onClick={() => handleAction(leave._id, 'Approved')}
                                                            disabled={!!actionLoading}
                                                            className="btn-success"
                                                        >
                                                            {actionLoading === leave._id + 'Approved' ? (
                                                                <span className="spinner-sm" />
                                                            ) : (
                                                                <CheckCircle2 size={13} />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(leave._id, 'Rejected')}
                                                            disabled={!!actionLoading}
                                                            className="btn-danger"
                                                        >
                                                            {actionLoading === leave._id + 'Rejected' ? (
                                                                <span className="spinner-sm" />
                                                            ) : (
                                                                <XCircle size={13} />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="td-reviewed">Reviewed</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeaveApprovalTable