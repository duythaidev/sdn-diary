import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { setDiaries } from '@/redux/slices/diarySlice'
import { diaryService } from '@/services/api/diaryService'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, BookOpen, Globe, Lock } from 'lucide-react'
import { toast } from 'sonner'
export const DashboardPage = () => {
  const dispatch = useDispatch()
  const { diaries } = useSelector((state: RootState) => state.diary)
  const { user } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchDiaries()
  }, [])

  const publicCount = diaries.filter((d) => d.isPublic).length
  const privateCount = diaries.filter((d) => !d.isPublic).length
  const recentDiaries = diaries.slice(0, 3)

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground">Here's an overview of your diary</p>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diaries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Entries</CardTitle>
              <Globe className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publicCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Private Entries</CardTitle>
              <Lock className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{privateCount}</div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Entries</h2>
          <Link to="/diary/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>
        {recentDiaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentDiaries.map((diary) => (
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
