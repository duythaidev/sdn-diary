import axiosInstance from './axios'
const URL = '/diary'

export const diaryService = {
  getUserDiaries: async () => {
    const response = await axiosInstance.get(URL)
    return response.data
  },
  getPublicDiaries: async () => {
    const response = await axiosInstance.get(`${URL}/public`)
    return response.data
  },
  getDiaryById: async (id: string) => {
    const response = await axiosInstance.get(`${URL}/${id}`)
    return response.data
  },
  createDiary: async (title: string, content: string, isPublic: boolean) => {
    const response = await axiosInstance.post(URL, {
      title,
      content,
      isPublic,
    })
    return response.data
  },
  updateDiary: async (id: string, title: string, content: string, isPublic: boolean) => {
    const response = await axiosInstance.put(`${URL}/${id}`, {
      title,
      content,
      isPublic,
    })
    return response.data
  },
  deleteDiary: async (id: string) => {
    const response = await axiosInstance.delete(`${URL}/${id}`)
    return response.data
  },
}
