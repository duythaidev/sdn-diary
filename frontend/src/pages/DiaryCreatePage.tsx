import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import type { DiaryFormData } from '@/types'
import { useTranslation } from 'react-i18next'
import { useAutosave } from '@/hooks/useAutosave'

export const DiaryCreatePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  // Track the draft ID created by autosave so manual publish can update it
  const [autosaveDraftId, setAutosaveDraftId] = useState<string | null>(null)

  const handleDraftCreated = useCallback((id: string) => {
    setAutosaveDraftId(id)
  }, [])

  const { status: autosaveStatus, schedule } = useAutosave({
    enabled: true,
    draftId: autosaveDraftId,
    onDraftCreated: handleDraftCreated,
  })

  // Called by DiaryForm whenever any field changes
  const handleFieldChange = useCallback(
    (data: DiaryFormData) => {
      schedule(data)
    },
    [schedule],
  )
  const handleSubmit = async (data: DiaryFormData) => {
    setLoading(true)
    try {
      if (autosaveDraftId) {
        // Autosave already created a draft — update it (publish or keep as draft)
        await diaryService.updateDiary(autosaveDraftId, data)
      } else {
        await diaryService.createDiary(data)
      }

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
      <DiaryForm
        mode="create"
        onSubmit={handleSubmit}
        loading={loading}
        autosaveStatus={autosaveStatus}
        onFieldChange={handleFieldChange}
      />
    </div>
  )
}
