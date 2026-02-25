import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import type { DiaryFormData } from '@/types'
import { useTranslation } from 'react-i18next'

export function DiaryEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [initialData, setInitialData] = useState<DiaryFormData | undefined>(undefined)

  useEffect(() => {
    const fetchDiary = async () => {
      if (!id) return
      try {
        const response = await diaryService.getDiaryById(id)
        const d = response.diary
        setInitialData({
          title: d.title,
          content: d.content,
          isPublic: d.isPublic ?? false,
          allowComments: d.allowComments ?? true,
          selectedMood: d.selectedMood || 'happy',
          isDraft: d.isDraft ?? false,
          tags: d.tags || [],
          coverPhoto: d.coverPhoto || null,
          likesCount: d.likesCount ?? 0,
          isLiked: d.isLiked ?? false,
        })
      } catch (error) {
        toast.error(getAxiosErrorMessage(error, t('form.failedToLoad')))
        navigate('/diary')
      } finally {
        setFetchLoading(false)
      }
    }
    fetchDiary()
  }, [id, navigate, t])

  const handleSubmit = async (data: DiaryFormData) => {
    if (!id) return
    setLoading(true)
    try {
      await diaryService.updateDiary(id, data)

      if (data.isDraft) {
        toast.success(t('diaries.draftSuccess'))
      } else {
        toast.success(t('diaries.updateSuccess'))
      }

      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('form.failedToUpdate')))
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DiaryForm mode="edit" initialData={initialData} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
