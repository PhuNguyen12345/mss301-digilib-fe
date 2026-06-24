import axiosClient from './axiosClient'

export const getBooks = ({ page = 0, size = 12, sort = 'createdAt,desc' } = {}) =>
  axiosClient.get('/api/catalog/books', {
    params: { page, size, sort },
  })

export const getBookById = (bookId) => axiosClient.get(`/api/catalog/books/${bookId}`)

export const searchBooks = ({ keyword, page = 0, size = 12, sort = 'createdAt,desc' }) =>
  axiosClient.get('/api/catalog/books/search', {
    params: { keyword, page, size, sort },
  })
