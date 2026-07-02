import axiosClient from './axiosClient'

export const getMyProfile = () =>
  axiosClient.get('/api/v1/members/me')

export const updateMyProfile = (payload) =>
  axiosClient.patch('/api/v1/members/me', payload)

export const getAllMembers = () =>
  axiosClient.get('/api/v1/members')

export const getMemberById = (memberId) =>
  axiosClient.get(`/api/v1/members/${memberId}`)

export const updateMemberStatus = (memberId, status) =>
  axiosClient.put(`/api/v1/members/${memberId}/status`, { status })
