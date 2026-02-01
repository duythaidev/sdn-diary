import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { setPublicDiaries } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Globe } from 'lucide-react'
import { toast } from 'sonner'

export const PublicDiariesPage = () => {
  const dispatch = useDispatch()
  const { publicDiaries } = useSelector((state: RootState) => state.diary)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicDiaries()
  }, [])

  const fetchPublicDiaries = async () => {
    try {
      const response = await diaryService.getPublicDiaries()
      dispatch(setPublicDiaries(response.diaries))
    } catch (error) {
      toast.error('Failed to load public diaries')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Public Diaries</h1>
          <p className="text-muted-foreground">Explore diary entries shared by the community</p>
        </div>

        {publicDiaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicDiaries.map((diary) => (
              <DiaryCard key={diary._id} diary={diary} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-2 text-lg font-medium">No public diaries yet</p>
              <p className="text-muted-foreground">Be the first to share your story with the community</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
