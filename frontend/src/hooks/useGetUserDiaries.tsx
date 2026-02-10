import { useEffect, useState } from 'react'
import { getAxiosErrorMessage } from '@/lib/error'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { diaryService } from '@/services/api/diaryService'
import useDebounce from './useDebounce'

export const useGetUserDiaries = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [moodFilter, setMoodFilter] = useState<string>('all')
  const [tagsFilter, setTagsFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchDiaries()
  }, [dateFilter, moodFilter, tagsFilter, debouncedSearchQuery])

  const fetchDiaries = async () => {
    try {
      setLoading(true)
      const response = await diaryService.getUserDiaries(dateFilter, moodFilter, tagsFilter, debouncedSearchQuery)
      setDiaries(response.diaries)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return {
    diaries,
    loading,
    dateFilter,
    moodFilter,
    tagsFilter,
    setDateFilter,
    setMoodFilter,
    setTagsFilter,
    searchQuery,
    setSearchQuery,
  }
}
