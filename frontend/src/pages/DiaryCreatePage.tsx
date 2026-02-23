import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import type { DiaryFormData } from '@/types'
import { useTranslation } from 'react-i18next'

export const DiaryCreatePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: DiaryFormData) => {
    setLoading(true)
    try {
      await diaryService.createDiary(data)

      if (data.isDraft) {
        toast.success(t('diaries.draftSuccess'))
      } else {
        toast.success(t('diaries.createSuccess'))
      }

      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DiaryForm mode="create" onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
