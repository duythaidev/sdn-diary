import axiosInstance from './axios'
export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await axiosInstance.post('/auth/register', {
      username,
      email,
      password,
    })
    return response.data
  },
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout')
    return response.data
  },
  refresh: async () => {
    const response = await axiosInstance.post('/auth/refresh')
    return response.data
  },
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },
}
