import type { DiaryFormData } from '@/types'
import axiosInstance from './axios'

const URL = '/diary'

export const diaryService = {
  getUserDiaries: async (
    dateFilter?: string,
    moodFilter?: string,
    tagsFilter?: string,
    searchQuery?: string,
    page?: number,
    limit?: number,
    specificDate?: Date,
  ) => {
    const response = await axiosInstance.get(URL, {
      params: {
        dateFilter,
        moodFilter,
        tagsFilter,
        queryFilter: searchQuery,
        page,
        limit,
        date: specificDate ? specificDate.toISOString() : undefined,
      },
    })
    return response.data
  },

  getUserRecentDiaries: async () => {
    const response = await axiosInstance.get(`${URL}/recent`)
    return response.data
  },

  getPublicDiaries: async (
    isRecent?: boolean,
    isMostLiked?: boolean,
    searchQuery?: string,
    page?: number,
    limit?: number,
  ) => {
    const response = await axiosInstance.get(`${URL}/public`, {
      params: {
        isRecent,
        isMostLiked,
        queryFilter: searchQuery,
        page,
        limit,
      },
    })
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

  toggleLike: async (id: string) => {
    const response = await axiosInstance.post(`${URL}/${id}/like`)
    return response.data
  },

  likeDiary: async (id: string) => {
    const response = await axiosInstance.post(`${URL}/${id}/like/add`)
    return response.data
  },

  unlikeDiary: async (id: string) => {
    const response = await axiosInstance.delete(`${URL}/${id}/like`)
    return response.data
  },
}
