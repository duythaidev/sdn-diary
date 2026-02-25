import { useCallback, useEffect, useRef, useState } from 'react'
import { diaryService } from '@/services/api/diaryService'
import type { DiaryFormData } from '@/types'

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DELAY = 3000

interface UseAutosaveOptions {
  enabled: boolean
  draftId: string | null
  onDraftCreated: (id: string) => void
}

export const useAutosave = ({ enabled, draftId, onDraftCreated }: UseAutosaveOptions) => {
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const draftIdRef = useRef<string | null>(draftId)
  const isSavingRef = useRef(false)

  // Keep ref in sync so the callback always has latest draftId
  useEffect(() => {
    draftIdRef.current = draftId
  }, [draftId])

  const save = useCallback(
    async (data: DiaryFormData) => {
      if (!enabled || isSavingRef.current) return

      isSavingRef.current = true
      setStatus('saving')

      try {
        const payload: DiaryFormData = { ...data, isDraft: true }

        if (draftIdRef.current) {
          // Update existing draft
          await diaryService.updateDiary(draftIdRef.current, payload)
        } else {
          // Create new draft — only if there's enough content to be worth saving
          if (!data.title && !data.content) {
            setStatus('idle')
            isSavingRef.current = false
            return
          }
          const response = await diaryService.createDiary(payload)
          const newId: string = response.diary?._id ?? response._id
          draftIdRef.current = newId
          onDraftCreated(newId)
        }

        setStatus('saved')
      } catch {
        setStatus('error')
      } finally {
        isSavingRef.current = false
      }
    },
    [enabled, onDraftCreated],
  )

  const schedule = useCallback(
    (data: DiaryFormData) => {
      if (!enabled) return
      if (timerRef.current) clearTimeout(timerRef.current)
      setStatus('idle')
      timerRef.current = setTimeout(() => save(data), AUTOSAVE_DELAY)
    },
    [enabled, save],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { status, schedule, saveNow: save }
}
