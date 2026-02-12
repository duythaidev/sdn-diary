import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import CreateDiaryButton from '@/components/common/CreateDiaryButton'
import MoodBarChart from '@/components/dashboard/MoodBarChart'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar'

export const DashboardPage = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const { user } = useProfile()
  const [loading, setLoading] = useState(true)

  const fetchDiaries = async () => {
    try {
      const response = await diaryService.getUserRecentDiaries()
      setDiaries(response.diaries)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiaries()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative container mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <Sparkles className="text-primary h-8 w-8" />
            <h1 className="text-5xl font-bold tracking-tight text-white">Welcome back, {user?.username}!</h1>
          </div>
          <p className="text-lg text-slate-400">Here's an overview of your journaling journey</p>
        </div>

        {/* Analytics & Calendar Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MoodBarChart diaries={diaries} />
          <DashboardCalendar />
        </div>

        {/* Recent Entries Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-white">Recent Entries</h2>
            <p className="text-slate-400">Your latest reflections and thoughts</p>
          </div>
          <Link to="/diary/create">
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Diary Cards Grid */}
        {diaries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {diaries.slice(0, 6).map((diary) => (
                <DiaryCardItem key={diary._id} diary={diary} />
              ))}
            </div>

            {diaries.length > 6 && (
              <div className="mt-10 text-center">
                <Link to="/diary">
                  <Button
                    variant="outline"
                    className="h-11 border-slate-700 bg-slate-800/40 px-8 text-slate-300 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:bg-slate-700/60 hover:text-white"
                  >
                    View All Entries
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/40 p-12 text-center shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <BookOpen className="h-10 w-10 text-slate-500" />
                  </div>
                </div>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">No diary entries yet</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Start your journaling journey by creating your first entry
              </p>
              <Link to="/diary/create">
                <Button className="bg-primary h-11 px-6 font-semibold shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Entry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <CreateDiaryButton />
    </div>
  )
}
