import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import type { DiaryFormData } from '@/types'

export const DiaryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<DiaryFormData | undefined>(undefined)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchDiary = async () => {
      if (!id) return

      try {
        const response = await diaryService.getDiaryById(id)
        setInitialData({
          title: response.diary.title,
          content: response.diary.content,
          isPublic: response.diary.isPublic,
          allowComments: response.diary.allowComments || true,
          selectedMood: response.diary.selectedMood || 'happy',
          tags: response.diary.tags || ['reflection', 'gratitude'],
          coverPhoto: response.diary.coverPhoto || null,
          isDraft: response.diary.isDraft || false,
        })
      } catch (error) {
        toast.error(getAxiosErrorMessage(error))
        navigate('/diary')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchDiary()
  }, [id, navigate])

  const handleSubmit = async (data: DiaryFormData) => {
    if (!id) return

    setLoading(true)
    try {
      await diaryService.updateDiary(id, data)

      if (data.isDraft) {
        toast.success('Draft saved successfully!')
      } else {
        toast.success('Diary entry updated successfully!')
      }

      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading diary entry...</p>
      </div>
    )
  }

  if (!initialData) {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <DiaryForm mode="edit" initialData={initialData} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
