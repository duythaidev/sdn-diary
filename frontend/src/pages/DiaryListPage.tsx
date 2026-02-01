import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { setDiaries } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
export const DiaryListPage = () => {
  const dispatch = useDispatch()
  const { diaries } = useSelector((state: RootState) => state.diary)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchDiaries()
  }, [])
  const fetchDiaries = async () => {
    try {
      const response = await diaryService.getUserDiaries()
      dispatch(setDiaries(response.diaries))
    } catch (_error) {
      toast.error('Failed to load diaries')
    } finally {
      setLoading(false)
    }
  }
  if (loading) return <LoadingSpinner />
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">My Diaries</h1>
            <p className="text-muted-foreground">Manage all your diary entries</p>
          </div>
          <Link to="/diary/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>
        {diaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diaries.map((diary) => (
              <DiaryCard key={diary._id} diary={diary} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-2 text-lg font-medium">No diary entries yet</p>
              <p className="text-muted-foreground mb-4">Start your journey by creating your first entry</p>
              <Link to="/diary/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
