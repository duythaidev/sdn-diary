import axiosInstance from './axios'
export const diaryService = {
  getUserDiaries: async () => {
    const response = await axiosInstance.get('/diary')
    return response.data
  },
  getPublicDiaries: async () => {
    const response = await axiosInstance.get('/diary/public')
    return response.data
  },
  getDiaryById: async (id: string) => {
    const response = await axiosInstance.get(`/diary/${id}`)
    return response.data
  },
  createDiary: async (title: string, content: string, isPublic: boolean) => {
    const response = await axiosInstance.post('/diary', {
      title,
      content,
      isPublic,
    })
    return response.data
  },
  updateDiary: async (id: string, title: string, content: string, isPublic: boolean) => {
    const response = await axiosInstance.put(`/diary/${id}`, {
      title,
      content,
      isPublic,
    })
    return response.data
  },
  deleteDiary: async (id: string) => {
    const response = await axiosInstance.delete(`/diary/${id}`)
    return response.data
  },
}
