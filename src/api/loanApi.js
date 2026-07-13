import axiosClient from './axiosClient'

export const getLoans = ({ page = 0, size = 20, sort = 'borrowedAt,desc' } = {}) =>
  axiosClient.get('/api/loan', { params: { page, size, sort } })

export const getLoanById = (loanId) =>
  axiosClient.get(`/api/loan/${loanId}`)

export const getLoansByMember = (memberId) =>
  axiosClient.get(`/api/loan/member/${encodeURIComponent(memberId)}`)

export const borrowBook = ({ memberId, bookId, bookType, idempotencyKey }) =>
  axiosClient.post('/api/loan', { memberId, bookId, bookType, idempotencyKey })

export const returnBook = (loanId, idempotencyKey) =>
  axiosClient.post(`/api/loan/${loanId}/return`, { idempotencyKey })

export const renewLoan = (loanId, actorId = 'WEB_USER') =>
  axiosClient.post(`/api/loan/${loanId}/renew`, null, {
    headers: { 'X-Actor-Id': actorId },
  })
