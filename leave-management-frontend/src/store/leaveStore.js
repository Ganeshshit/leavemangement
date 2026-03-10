import { create } from 'zustand'
import {
    createLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
} from '../api/leaveApi'

const useLeaveStore = create((set) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    leaves: [],       // All leaves (employer view)
    myLeaves: [],     // Employee's own leaves
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,

    // ── Employee Actions ───────────────────────────────────────────────────────

    /**
     * Submit a new leave request
     */
    createLeave: async (leaveData) => {
        set({ submitting: true, error: null, successMessage: null })
        try {
            const data = await createLeave(leaveData)
            // Prepend to myLeaves immediately
            set((state) => ({
                myLeaves: [data.data, ...state.myLeaves],
                submitting: false,
                successMessage: 'Leave request submitted successfully!',
            }))
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit leave request.'
            set({ submitting: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Fetch all leaves for logged-in employee
     */
    fetchMyLeaves: async () => {
        set({ loading: true, error: null })
        try {
            const data = await getMyLeaves()
            set({ myLeaves: data.data, loading: false })
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch leave requests.'
            set({ loading: false, error: message })
        }
    },

    // ── Employer Actions ───────────────────────────────────────────────────────

    /**
     * Fetch all leave requests (employer view)
     */
    fetchAllLeaves: async (filters = {}) => {
        set({ loading: true, error: null })
        try {
            const data = await getAllLeaves(filters)
            set({ leaves: data.data, loading: false })
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch leave requests.'
            set({ loading: false, error: message })
        }
    },

    /**
     * Approve or Reject a leave request
     */
    updateLeaveStatus: async (id, status) => {
        set({ error: null })
        try {
            const data = await updateLeaveStatus(id, status)
            // Update the specific leave in state
            set((state) => ({
                leaves: state.leaves.map((leave) =>
                    leave._id === id ? data.data : leave
                ),
                successMessage: `Leave request ${status.toLowerCase()} successfully.`,
            }))
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update leave status.'
            set({ error: message })
            return { success: false, error: message }
        }
    },

    // ── Utilities ──────────────────────────────────────────────────────────────
    clearError: () => set({ error: null }),
    clearSuccess: () => set({ successMessage: null }),
}))

export default useLeaveStore