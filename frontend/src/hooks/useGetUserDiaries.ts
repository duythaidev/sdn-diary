import { useEffect, useState, useCallback } from 'react'
import { getAxiosErrorMessage } from '@/lib/error'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { diaryService } from '@/services/api/diaryService'
import useDebounce from './useDebounce'

export const useGetUserDiaries = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>('newest')
  const [moodFilter, setMoodFilter] = useState<string>('all')
  const [tagsFilter, setTagsFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const fetchDiaries = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true)
        } else {
          setLoadingMore(true)
        }

        const response = await diaryService.getUserDiaries(
          dateFilter,
          moodFilter,
          tagsFilter,
          debouncedSearchQuery,
          pageNum,
          12,
          undefined,
          statusFilter,
        )

        if (isInitial) {
          setDiaries(response.diaries)
        } else {
          setDiaries((prev) => [...prev, ...response.diaries])
        }

        setHasMore(response.pagination.hasMore)
      } catch (error) {
        toast.error(getAxiosErrorMessage(error))
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [dateFilter, moodFilter, tagsFilter, debouncedSearchQuery, statusFilter],
  )

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1)
    setDiaries([])
    fetchDiaries(1, true)
  }, [dateFilter, moodFilter, tagsFilter, debouncedSearchQuery, statusFilter, fetchDiaries])

  // Load more handler
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchDiaries(nextPage, false)
    }
  }, [page, loadingMore, hasMore, fetchDiaries])

  return {
    diaries,
    loading,
    loadingMore,
    hasMore,
    dateFilter,
    moodFilter,
    tagsFilter,
    statusFilter,
    setDateFilter,
    setMoodFilter,
    setTagsFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    loadMore,
  }
}