import { useEffect, useState } from 'react'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Globe, TrendingUp, Heart, Clock } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { getAxiosErrorMessage } from '@/lib/error'
import { cn } from '@/lib/utils'

type FilterType = 'recent' | 'trending' | 'most-liked'

export const PublicDiariesPage = () => {
  const [loading, setLoading] = useState(true)
  const [publicDiaries, setPublicDiaries] = useState<Diary[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('recent')

  useEffect(() => {
    fetchPublicDiaries()
  }, [])

  const fetchPublicDiaries = async () => {
    try {
      const response = await diaryService.getPublicDiaries()
      setPublicDiaries(response.diaries)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to load public diaries'))
    } finally {
      setLoading(false)
    }
  }

  const filteredDiaries = () => {
    switch (activeFilter) {
      case 'trending':
        // Sort by views (if available) or recent activity
        return [...publicDiaries].sort(
          (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
      case 'most-liked':
        // Sort by likes or comments if available
        return [...publicDiaries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return [...publicDiaries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <Navbar />

      <div className="relative container mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-white">Public Feed</h1>
          <p className="max-w-2xl text-lg text-slate-400">
            Explore reflections from the community. Find inspiration, empathy, and connection in shared stories.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('recent')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all duration-300',
              'border backdrop-blur-md',
              activeFilter === 'recent'
                ? 'border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-700/60 hover:text-white',
            )}
          >
            <Clock className="h-4 w-4" />
            Recent
          </button>

          <button
            onClick={() => setActiveFilter('trending')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all duration-300',
              'border backdrop-blur-md',
              activeFilter === 'trending'
                ? 'border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-700/60 hover:text-white',
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </button>

          <button
            onClick={() => setActiveFilter('most-liked')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all duration-300',
              'border backdrop-blur-md',
              activeFilter === 'most-liked'
                ? 'border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-700/60 hover:text-white',
            )}
          >
            <Heart className="h-4 w-4" />
            Most Liked
          </button>
        </div>

        {/* Diary Cards Grid */}
        {filteredDiaries().length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2">
              {filteredDiaries().map((diary) => (
                <DiaryCardItem key={diary._id} diary={diary} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-12 flex justify-center">
              <button className="group inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/40 px-8 py-3.5 font-medium text-slate-300 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-700/60 hover:text-white">
                Load More Entries
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/40 p-12 text-center shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <Globe className="h-10 w-10 text-slate-500" />
                  </div>
                </div>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">No public diaries yet</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Be the first to share your story with the community
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
