import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addDiary } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create diary entry')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Diary Entry</CardTitle>
            <CardDescription>Share your thoughts and experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <DiaryForm onSubmit={handleSubmit} submitLabel="Create Entry" loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
