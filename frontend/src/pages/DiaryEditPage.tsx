import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { updateDiary as updateDiaryAction } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export const DiaryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [diary, setDiary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDiary()
  }, [id])

  const fetchDiary = async () => {
    try {
      const response = await diaryService.getDiaryById(id!)
      const diaryData = response.diary

      // Check if user owns this diary
      const ownerId = typeof diaryData.userId === 'object' ? diaryData.userId.id : diaryData.userId

      if (ownerId !== user?.id) {
        toast.error('You are not authorized to edit this diary')
        navigate('/diary')
        return
      }

      setDiary(diaryData)
    } catch (error) {
      toast.error('Failed to load diary')
      navigate('/diary')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: { title: string; content: string; isPublic: boolean }) => {
    setSubmitting(true)
    try {
      const response = await diaryService.updateDiary(id!, data.title, data.content, data.isPublic)
      dispatch(updateDiaryAction(response.diary))
      toast.success('Diary entry updated successfully!')
      navigate(`/diary/${id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update diary entry')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Diary Entry</CardTitle>
            <CardDescription>Update your thoughts and experiences</CardDescription>
          </CardHeader>
          <CardContent>
            {diary && (
              <DiaryForm
                initialData={{
                  title: diary.title,
                  content: diary.content,
                  isPublic: diary.isPublic,
                }}
                onSubmit={handleSubmit}
                submitLabel="Update Entry"
                loading={submitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
