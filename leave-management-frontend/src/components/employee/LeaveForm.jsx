import { useState, useEffect } from 'react'
import { Send, CalendarDays, Clock } from 'lucide-react'
import useLeaveStore from '../../store/leaveStore'
import { todayISO, calcDays } from '../../utils/formatDate'
import './leaveForm.css'

const LEAVE_TYPES = [
    'Sick Leave',
    'Casual Leave',
    'Annual Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Unpaid Leave',
]

const LeaveForm = ({ onSuccess }) => {
    const { createLeave, submitting, error, successMessage, clearError, clearSuccess } = useLeaveStore()

    const [form, setForm] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    })
    const [validationErrors, setValidationErrors] = useState({})

    // Clear messages after 5s
    useEffect(() => {
        if (successMessage) {
            const t = setTimeout(() => clearSuccess(), 5000)
            return () => clearTimeout(t)
        }
    }, [successMessage, clearSuccess])

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(t)
        }
    }, [error, clearError])

    const validate = () => {
        const errs = {}
        if (!form.leaveType) errs.leaveType = 'Please select a leave type.'
        if (!form.startDate) errs.startDate = 'Start date is required.'
        if (!form.endDate) errs.endDate = 'End date is required.'
        if (form.startDate && form.endDate && form.endDate < form.startDate) {
            errs.endDate = 'End date must be on or after start date.'
        }
        if (!form.reason.trim()) errs.reason = 'Please provide a reason.'
        else if (form.reason.trim().length < 10) errs.reason = 'Reason must be at least 10 characters.'
        return errs
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setValidationErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) {
            setValidationErrors(errs)
            return
        }

        const result = await createLeave(form)
        if (result.success) {
            setForm({ leaveType: '', startDate: '', endDate: '', reason: '' })
            if (onSuccess) onSuccess()
        }
    }

    const days = form.startDate && form.endDate ? calcDays(form.startDate, form.endDate) : null

    return (
        <div className="card card-form">
            {/* Header */}
            <div className="form-card-header">
                <div className="form-card-icon">
                    <CalendarDays size={18} />
                </div>
                <div>
                    <h2 className="form-card-title">Apply for Leave</h2>
                    <p className="form-card-subtitle">Fill in the details and submit your request</p>
                </div>
            </div>

            {/* Success banner */}
            {successMessage && (
                <div className="form-alert form-alert--success">
                    <span className="form-alert-dot" />
                    {successMessage}
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="form-alert form-alert--error">
                    <span className="form-alert-dot" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="leave-form">
                {/* Leave Type */}
                <div className="form-field">
                    <label className="form-label" htmlFor="leaveType">Leave Type</label>
                    <select
                        id="leaveType"
                        name="leaveType"
                        value={form.leaveType}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">Select leave type…</option>
                        {LEAVE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {validationErrors.leaveType && (
                        <p className="form-error">{validationErrors.leaveType}</p>
                    )}
                </div>

                {/* Date range */}
                <div className="date-grid">
                    <div className="form-field">
                        <label className="form-label" htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            min={todayISO()}
                            value={form.startDate}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validationErrors.startDate && (
                            <p className="form-error">{validationErrors.startDate}</p>
                        )}
                    </div>
                    <div className="form-field">
                        <label className="form-label" htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            min={form.startDate || todayISO()}
                            value={form.endDate}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validationErrors.endDate && (
                            <p className="form-error">{validationErrors.endDate}</p>
                        )}
                    </div>
                </div>

                {/* Days preview */}
                {days > 0 && (
                    <div className="days-preview">
                        <Clock size={14} />
                        <span className="days-preview-text">
                            {days} day{days !== 1 ? 's' : ''} of leave
                        </span>
                    </div>
                )}

                {/* Reason */}
                <div className="form-field">
                    <label className="form-label" htmlFor="reason">
                        Reason
                        <span className="form-label-count">
                            ({form.reason.trim().length}/500)
                        </span>
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows={4}
                        placeholder="Describe the reason for your leave request…"
                        value={form.reason}
                        onChange={handleChange}
                        maxLength={500}
                        className="form-input"
                    />
                    {validationErrors.reason && (
                        <p className="form-error">{validationErrors.reason}</p>
                    )}
                </div>

                {/* Submit */}
                <div className="form-submit-row">
                    <button type="submit" disabled={submitting} className="btn-primary">
                        {submitting ? (
                            <>
                                <span className="spinner" />
                                Submitting…
                            </>
                        ) : (
                            <>
                                <Send size={15} />
                                Submit Request
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LeaveForm