import axiosClient from './axiosClient.js'

// ── Student ──────────────────────────────────────────────────────────────
export const getMyFines = (studentId, { status, page = 0, size = 20 } = {}) =>
  axiosClient.get(`/api/fines/students/${studentId}`, { params: { status, page, size } })

export const getFinePayments = (fineId) =>
  axiosClient.get(`/api/fines/${fineId}/payments`)

export const createSepayQr = (fineId) =>
  axiosClient.post(`/api/fines/${fineId}/payments/sepay/qr`)

export const getLatestPaymentStatus = (fineId) =>
  axiosClient.get(`/api/fines/${fineId}/payments/latest`)

// ── Librarian ────────────────────────────────────────────────────────────
export const getStudentFinesAsLibrarian = (studentId, { status, page = 0, size = 20 } = {}) =>
  axiosClient.get(`/api/fines/librarian/students/${studentId}`, { params: { status, page, size } })

export const getAllFines = ({ status, page = 0, size = 20, sort = 'dueDate,asc' } = {}) =>
  axiosClient.get('/api/fines/librarian', { params: { status, page, size, sort } })

export const getFinePaymentsAsLibrarian = (fineId) =>
  axiosClient.get(`/api/fines/librarian/${fineId}/payments`)

export const waiveFine = (fineId, waiverReason) =>
  axiosClient.post(`/api/fines/librarian/${fineId}/waive`, { waiverReason })

export const markFinePaid = (fineId) =>
  axiosClient.post(`/api/fines/librarian/${fineId}/mark-paid`)
