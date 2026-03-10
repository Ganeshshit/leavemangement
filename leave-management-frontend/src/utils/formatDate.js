/**
 * Format ISO date string to readable format
 * @param {string|Date} date
 * @returns {string} e.g. "10 Mar 2026"
 */
export const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

/**
 * Calculate number of days between two dates (inclusive)
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number}
 */
export const calcDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
}

/**
 * Format date for HTML input[type="date"] value
 * @param {string|Date} date
 * @returns {string} YYYY-MM-DD
 */
export const toInputDate = (date) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

/**
 * Returns today's date as YYYY-MM-DD (min value for date inputs)
 */
export const todayISO = () => {
    return new Date().toISOString().split('T')[0]
}