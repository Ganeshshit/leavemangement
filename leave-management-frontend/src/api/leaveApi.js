import API from './axios'

/**
 * Submit a new leave request (employee)
 * @param {{ leaveType, startDate, endDate, reason }} data
 */
export const createLeave = async (data) => {
    const response = await API.post('/leaves', data)
    return response.data
}


export const getMyLeaves = async () => {
    const response = await API.get('/leaves/my')
    return response.data
}


export const getAllLeaves = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.leaveType) params.append('leaveType', filters.leaveType)

    const response = await API.get(`/leaves?${params.toString()}`)
    return response.data
}


export const updateLeaveStatus = async (id, status) => {
    const response = await API.put(`/leaves/${id}`, { status })
    return response.data
}