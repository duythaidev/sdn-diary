import { useEffect, useState, useCallback, forwardRef } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { diaryService } from '@/services/api/diaryService'
import { Navbar } from '@/components/layout/Navbar'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Globe, Heart, Clock, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { getAxiosErrorMessage } from '@/lib/error'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import useDebounce from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'

// Define grid components outside the component to prevent remounting, and use masonry layout
const gridComponents = {
  List: forwardRef<HTMLDivElement>(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 500px), 1fr))',

        gap: '2rem',
        ...style,
      }}
      className="w-full"
    >
      {children}
    </div>
  )),
  // Item: ({ children, ...props }: any) => (
  //   <div
  //     {...props}
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //     }}
  //   >
  //     {children}
  //   </div>
  // ),
}

export const PublicDiariesPage = () => {
  const [loading, setLoading] = useState(true)
  const [publicDiaries, setPublicDiaries] = useState<Diary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isMostLiked, setIsMostLiked] = useState(false)
  const [isRecent, setIsRecent] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const fetchPublicDiaries = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true)
        } else {
          setIsLoadingMore(true)
        }

        const response = await diaryService.getPublicDiaries(isRecent, isMostLiked, debouncedSearchQuery, pageNum, 10)

        if (isInitial) {
          setPublicDiaries([
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
            ...response.diaries,
          ])
          setPage(1)
        } else {
          setPublicDiaries((prev) => [...prev, ...response.diaries])
        }

        setHasMore(response.pagination.hasMore)
      } catch (error) {
        toast.error(getAxiosErrorMessage(error, 'Failed to load public diaries'))
      } finally {
        setLoading(false)
        setIsLoadingMore(false)
      }
    },
    [isRecent, isMostLiked, debouncedSearchQuery],
  )

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1)
    setPublicDiaries([])
    fetchPublicDiaries(1, true)
  }, [isRecent, isMostLiked, debouncedSearchQuery, fetchPublicDiaries])

  // Load more handler for infinite scroll
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPublicDiaries(nextPage, false)
    }
  }, [page, isLoadingMore, hasMore, fetchPublicDiaries])

  const handleLikeUpdate = (diaryId: string, likesCount: number, isLiked: boolean) => {
    setPublicDiaries((prev) => prev.map((diary) => (diary._id === diaryId ? { ...diary, likesCount, isLiked } : diary)))
  }

  return (
    <div className="min-h-screen bg-linear-to-br">
      <Navbar />

      <div className="relative container mx-auto max-w-7xl px-6 py-6">
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
          <VirtuosoGrid
            useWindowScroll
            totalCount={publicDiaries.length}
            endReached={loadMore}
            data={publicDiaries}
            itemContent={(_, diary) => <DiaryCardItem key={diary._id} diary={diary} onLikeUpdate={handleLikeUpdate} />}
            overscan={200} // 200px trên và dưới để render thêm 
            components={{
              ...gridComponents,
              Footer: () => {
                if (isLoadingMore) {
                  return (
                    <div className="col-span-full flex justify-center py-8">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Loading more entries...</span>
                      </div>
                    </div>
                  )
                }
                if (!hasMore && publicDiaries.length > 0) {
                  return (
                    <div className="col-span-full flex justify-center py-12">
                      <div className="rounded-full border border-slate-700/50 bg-slate-800/40 px-6 py-3 text-sm text-slate-400 backdrop-blur-md">
                        You've reached the end
                      </div>
                    </div>
                  )
                }
                return null
              },
            }}
          />
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
