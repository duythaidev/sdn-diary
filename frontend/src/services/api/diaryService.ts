import type { DiaryFormData } from '@/types'
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
  
  createDiary: async (data: DiaryFormData) => {
    const response = await axiosInstance.post(URL, data)
    return response.data
  },
  
  updateDiary: async (id: string, data: DiaryFormData) => {
    const response = await axiosInstance.put(`${URL}/${id}`, data)
    return response.data
  },

  deleteDiary: async (id: string) => {
    const response = await axiosInstance.delete(`${URL}/${id}`)
    return response.data
  },
}