import axiosClient from './axiosClient'

export const login = (username, password) =>
  axiosClient.post('/api/v1/auth/login', { username, password })

export const register = ({ email, password, firstName, lastName }) =>
  axiosClient.post('/api/v1/auth/register', { email, password, firstName, lastName })

export const logout = (refreshToken) =>
  axiosClient.post('/api/v1/auth/logout', { refreshToken })

export const forgotPassword = (email) =>
  axiosClient.post('/api/v1/auth/forgot-password', { email })
