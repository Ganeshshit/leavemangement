import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Employee pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'

// Employer pages
import EmployerDashboard from '../pages/employer/EmployerDashboard'

// Lazy sub-pages (reuse components directly for simplicity)
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import LeaveForm from '../components/employee/LeaveForm'
import LeaveTable from '../components/employee/LeaveTable'
import LeaveApprovalTable from '../components/employer/LeaveApprovalTable'
import useAuth from '../hooks/useAuth'

// ── Layout wrapper for inner pages ───────────────────────────────────────────
// ── Layout wrapper for inner pages ───────────────────────────────────────────
const PageLayout = ({ title, subtitle, children }) => (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Navbar />
            <main style={{ flex: 1, padding: '1.5rem' }}>
                {(title || subtitle) && (
                    <div style={{ marginBottom: '2rem' }}>
                        {title && (
                            <h1 style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#020617',
                                lineHeight: 1.2,
                            }}>
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginTop: '0.25rem',
                            }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </main>
        </div>
    </div>
)
// ── Root redirect based on role ───────────────────────────────────────────────
const RootRedirect = () => {
    const { isAuthenticated, role } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!role) return <Navigate to="/login" replace />
    return <Navigate to={role === 'employer' ? '/employer/dashboard' : '/employee/dashboard'} replace />
}

const AppRoutes = () => (
    <Routes>
        {/* ── Public ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Employee routes ── */}
        <Route element={<ProtectedRoute role="employee" />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route
                path="/employee/apply"
                element={
                    <PageLayout title="Apply for Leave" subtitle="Submit a new leave request">
                        <LeaveForm />
                    </PageLayout>
                }
            />
            <Route
                path="/employee/my-leaves"
                element={
                    <PageLayout title="My Leave Requests" subtitle="Track the status of all your requests">
                        <LeaveTable />
                    </PageLayout>
                }
            />
        </Route>

        {/* ── Employer routes ── */}
        <Route element={<ProtectedRoute role="employer" />}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route
                path="/employer/all-leaves"
                element={
                    <PageLayout title="Leave Requests" subtitle="Approve or reject employee requests">
                        <LeaveApprovalTable />
                    </PageLayout>
                }
            />
        </Route>

        {/* ── Root & fallback ── */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
)

export default AppRoutes
