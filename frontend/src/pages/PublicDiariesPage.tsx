import { useEffect, useState, useCallback } from 'react'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heart, Clock, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { getAxiosErrorMessage } from '@/lib/error'
import { cn } from '@/lib/utils'
import { diaryService } from '@/services/api/diaryService'
import useDebounce from '@/hooks/useDebounce'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'

export const PublicDiariesPage = () => {
  const { t } = useTranslation()
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
          setPublicDiaries(response.diaries)
          setPage(2)
        } else {
          setPublicDiaries((prev) => [...prev, ...response.diaries])
          setPage((prev) => prev + 1)
        }

        setHasMore(response.pagination.hasMore)
      } catch (error) {
        toast.error(getAxiosErrorMessage(error, t('common.tryAgain')))
      } finally {
        setLoading(false)
        setIsLoadingMore(false)
      }
    },
    [isRecent, isMostLiked, debouncedSearchQuery, t],
  )

  useEffect(() => {
    fetchPublicDiaries(1, true)
  }, [isRecent, isMostLiked, debouncedSearchQuery, fetchPublicDiaries])

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) return
    fetchPublicDiaries(page, false)
  }

  const handleLikeUpdate = (diaryId: string, likesCount: number, isLiked: boolean) => {
    setPublicDiaries((prev) => prev.map((diary) => (diary._id === diaryId ? { ...diary, likesCount, isLiked } : diary)))
  }

  return (
    <div className="min-h-screen">
      <div className="animate-in fade-in container mx-auto max-w-7xl space-y-8 px-6 py-6 duration-500">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl pt-8 text-center">
          <h2 className="text-foreground/80 mb-4 font-serif text-5xl font-bold">
            {t('feed.title').split(',')[0]}, <br />
            <span className="relative inline-block">
              <span className="relative z-10">{t('feed.title').split(',')[1]}</span>
              <span className="absolute right-0 bottom-1 left-0 z-0 h-3 -rotate-1 bg-yellow-200/60"></span>
            </span>
          </h2>

          <div className="group relative mx-auto mt-8 max-w-lg">
            <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
            <div className="relative">
              <Search className="text-muted-foreground group-focus-within:text-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2 transition-colors" />
              <Input
                type="search"
                placeholder={t('feed.searchPlaceholder')}
                className="h-14 rounded-xl border-2 border-black/5 bg-white pl-12 font-serif text-base shadow-sm focus:border-black/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                <TooltipProvider>
                  {/* Most Liked */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={'icon'}
                        variant={isMostLiked ? 'default' : 'outline'}
                        onClick={() => {
                          setIsMostLiked(true)
                          setIsRecent(false)
                        }}
                        className={cn(
                          'rounded-full',
                          !isMostLiked && 'border-black/10 bg-transparent hover:bg-black/5',
                        )}
                      >
                        <Heart className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{t('feed.mostLiked')}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Recent */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isRecent ? 'default' : 'outline'}
                        size={'icon'}
                        onClick={() => {
                          setIsRecent(true)
                          setIsMostLiked(false)
                        }}
                        className={cn('rounded-full', !isRecent && 'border-black/10 bg-transparent hover:bg-black/5')}
                      >
                        <Clock className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{t('feed.recent')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : publicDiaries.length > 0 ? (
            <>
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}>
                <Masonry gutter="24px">
                  {publicDiaries.map((diary, index) => (
                    <DiaryCardItem
                      key={diary._id + index}
                      diary={diary}
                      onLikeUpdate={handleLikeUpdate}
                      className="w-full"
                      showActions={false}
                      rotation={index % 2 === 0 ? -1 : 1}
                      color={index % 3 === 0 ? 'bg-[#fefce8]' : index % 3 === 1 ? 'bg-[#fdf2f8]' : 'bg-white'}
                      texture={index % 2 === 0 ? 'plain' : 'dotted'}
                      decoration={
                        Math.floor(Math.random() * 4) + 1 === 1
                          ? 'clip'
                          : Math.floor(Math.random() * 4) + 1 === 2
                            ? 'pin'
                            : Math.floor(Math.random() * 4) + 1 === 3
                              ? 'tape'
                              : 'none'
                      }
                      delay={index % 10}
                    />
                  ))}
                </Masonry>
              </ResponsiveMasonry>

              {isLoadingMore && (
                <div className="flex justify-center py-8">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">{t('feed.loadingMore')}</span>
                  </div>
                </div>
              )}

              {!isLoadingMore && hasMore && (
                <div className="flex justify-center py-12">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="h-12 rounded-full border-black/10 px-8 transition-all hover:bg-white hover:shadow-md"
                  >
                    {t('feed.loadMoreStories')}
                  </Button>
                </div>
              )}

              {!hasMore && publicDiaries.length > 0 && !isLoadingMore && (
                <div className="flex justify-center py-12">
                  <p className="text-muted-foreground font-serif text-sm">{t('common.endOfList')}</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-black/5 bg-white/50 py-20 text-center">
              <p className="text-muted-foreground font-serif text-xl">{t('feed.noStoriesFound')}</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery('')} className="text-primary mt-2">
                  {t('common.clearSearch')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
