import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addDiary } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'

export const DiaryCreatePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: { title: string; content: string; isPublic: boolean }) => {
    setLoading(true)
    try {
      const response = await diaryService.createDiary(data.title, data.content, data.isPublic)
      dispatch(addDiary(response.diary))
      toast.success('Diary entry created successfully!')
      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <DiaryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
