import { useEffect, useState } from 'react'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Globe, Heart, Clock, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { getAxiosErrorMessage } from '@/lib/error'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import useDebounce from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'

export const PublicDiariesPage = () => {
  const [loading, setLoading] = useState(true)
  const [publicDiaries, setPublicDiaries] = useState<Diary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isMostLiked, setIsMostLiked] = useState(false)
  const [isRecent, setIsRecent] = useState(true)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchPublicDiaries()
  }, [isRecent, isMostLiked, debouncedSearchQuery])

  const fetchPublicDiaries = async () => {
    try {
      const response = await diaryService.getPublicDiaries(isRecent, isMostLiked, debouncedSearchQuery)
      setPublicDiaries(response.diaries)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to load public diaries'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br">
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
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isRecent ? 'default' : 'outline'}
              onClick={() => {
                setIsRecent(true)
                setIsMostLiked(false)
              }}
              className={cn('rounded-full')}
            >
              <Clock className="h-4 w-4" />
              Recent
            </Button>

            <Button
              onClick={() => {
                setIsMostLiked(true)
                setIsRecent(false)
              }}
              variant={isMostLiked ? 'default' : 'outline'}
              className={cn('rounded-full')}
            >
              <Heart className="h-4 w-4" />
              Most Liked
            </Button>
          </div>

          <div className="relative ml-auto">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 border-slate-700 bg-slate-900/50 pr-4 pl-11 text-white transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Diary Cards Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : publicDiaries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2">
              {publicDiaries.map((diary) => (
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
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-linear-to-br from-cyan-500/20 to-blue-500/20">
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
