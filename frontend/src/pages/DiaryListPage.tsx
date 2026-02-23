import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Search,
  ChevronDown,
  Calendar,
  Smile,
  Tag,
  LayoutGrid,
  List as ListIcon,
  PlusCircle,
  Loader2,
} from 'lucide-react'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { MOODS } from '@/constants'
import { useGetUserDiaries } from '@/hooks/useGetUserDiaries'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import CreateDiaryButton from '@/components/common/CreateDiaryButton'
import { format } from 'date-fns'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useTranslation } from 'react-i18next'

export const DiaryListPage = () => {
  const { t } = useTranslation()
  const {
    diaries,
    loading,
    loadingMore,
    hasMore,
    setDateFilter,
    setMoodFilter,
    setTagsFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    moodFilter,
    tagsFilter,
    loadMore,
  } = useGetUserDiaries()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const activeMood = MOODS.find((option) => option.value === moodFilter)

  const sentinelRef = useInfiniteScroll({
    loading: loadingMore,
    hasMore,
    onLoadMore: loadMore,
    rootMargin: '200px',
  })

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-black/5 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground/90 flex items-center gap-3 font-serif text-3xl font-bold">
            {t('diaries.title')}
            <span className="text-muted-foreground rounded-full bg-black/5 px-2 py-1 font-sans text-sm font-normal">
              {t('common.entries', { count: diaries.length })}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">{t('diaries.subtitle')}</p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder={t('diaries.searchPlaceholder')}
              className="bg-white pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/diary/create">
            <Button className="font-serif shadow-md">
              <PlusCircle className="mr-2 size-4" />
              {t('common.newEntry')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and View Options */}
      <div className="sticky top-[72px] z-30 flex items-center justify-between bg-[#f8f5f2]/95 py-2 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed border-black/20 bg-transparent hover:bg-black/5"
              >
                <Calendar className="mr-2 size-3.5" />
                {dateFilter === 'newest' ? t('diaries.newestFirst') : t('diaries.oldestFirst')}
                <ChevronDown className="ml-1 size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[180px]">
              <DropdownMenuItem
                className={cn('cursor-pointer', dateFilter === 'newest' && 'font-semibold')}
                onClick={() => setDateFilter('newest')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('diaries.newestFirst')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn('cursor-pointer', dateFilter === 'oldest' && 'font-semibold')}
                onClick={() => setDateFilter('oldest')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('diaries.oldestFirst')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mood Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed border-black/20 bg-transparent hover:bg-black/5"
              >
                <Smile className="mr-2 size-3.5" />
                {activeMood ? (
                  <>
                    <span className="mr-1">{activeMood.icon}</span>
                    {activeMood.label}
                  </>
                ) : (
                  t('diaries.allMoods')
                )}
                <ChevronDown className="ml-1 size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[200px]">
              <DropdownMenuItem
                className={cn('cursor-pointer', moodFilter === 'all' && 'font-semibold')}
                onClick={() => setMoodFilter('all')}
              >
                {t('diaries.allMoods')}
              </DropdownMenuItem>
              <div className="my-1 h-px bg-black/5" />
              {MOODS.map((mood) => (
                <DropdownMenuItem
                  key={mood.value}
                  className={cn('cursor-pointer', moodFilter === mood.value && 'font-semibold')}
                  onClick={() => setMoodFilter(mood.value)}
                >
                  <span className="mr-2 text-lg">{mood.icon}</span>
                  {mood.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Filter */}
          <div className="relative">
            <Tag className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />

            <Input
              placeholder={t('diaries.filterByTag')}
              className="h-8 border-dashed border-black/20 bg-transparent pl-9 transition-all hover:bg-black/5"
              value={tagsFilter === 'all' ? '' : tagsFilter}
              onChange={(e) => setTagsFilter(e.target.value.trim())}
            />
          </div>

          {/* Active Filters indicator */}
          {(moodFilter !== 'all' || tagsFilter !== 'all') && (
            <span className="text-primary border-primary/20 bg-primary/5 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
              {[moodFilter !== 'all' && 'mood', tagsFilter !== 'all' && 'tag'].filter(Boolean).length}{' '}
              {t('common.active')}
            </span>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg bg-black/5 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-1.5 transition-all ${viewMode === 'grid' ? 'text-foreground bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-1.5 transition-all ${viewMode === 'list' ? 'text-foreground bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ListIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : diaries.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}>
                <Masonry gutter="24px">
                  {diaries.map((diary, index) => (
                    <DiaryCardItem
                      key={diary._id}
                      className="w-full"
                      diary={diary}
                      rotation={index % 2 === 0 ? -1 : 1}
                      color={index % 3 === 0 ? 'bg-[#fdfbf7]' : index % 3 === 1 ? 'bg-[#fffef0]' : 'bg-white'}
                      texture={index % 3 === 0 ? 'lined' : 'plain'}
                      decoration={index % 4 === 0 ? 'clip' : index % 4 === 1 ? 'pin' : 'none'}
                      delay={index % 10}
                    />
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              <div className="mx-auto max-w-3xl space-y-4">
                {diaries.map((diary) => (
                  <Link
                    key={diary._id}
                    to={`/diary/${diary._id}`}
                    className="group relative block flex gap-6 overflow-hidden rounded-lg border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="bg-primary/20 group-hover:bg-primary absolute top-0 bottom-0 left-0 w-1 transition-colors" />

                    <div className="flex min-w-[60px] flex-col items-center justify-center border-r border-dashed border-black/10 py-2 pr-6 text-center">
                      <span className="text-foreground/80 font-serif text-2xl font-bold">
                        {format(new Date(diary.createdAt), 'dd')}
                      </span>
                      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        {format(new Date(diary.createdAt), 'MMM')}
                      </span>
                      <span className="text-muted-foreground mt-1 text-xs">
                        {format(new Date(diary.createdAt), 'yyyy')}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 truncate font-serif text-xl font-bold">{diary.title}</h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                        {diary.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      </p>
                      {diary.tags && diary.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {diary.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-muted-foreground rounded bg-black/5 px-2 py-0.5 font-mono text-[10px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Loading More */}
            {loadingMore && (
              <div className="mt-8 flex justify-center">
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{t('diaries.loadingMore')}</span>
                </div>
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && !loadingMore && <div ref={sentinelRef} className="h-10" />}

            {/* End of results */}
            {!hasMore && diaries.length > 0 && (
              <div className="mt-12 flex justify-center">
                <p className="text-muted-foreground font-serif text-sm">{t('common.endOfList')}</p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-black/5 bg-white/50 py-20 text-center">
            <div className="bg-muted mb-4 inline-flex h-20 w-20 animate-bounce items-center justify-center rounded-full">
              <Search className="text-muted-foreground size-10" />
            </div>
            <p className="text-muted-foreground font-serif text-xl">{t('diaries.noEntriesFound')}</p>
            {searchQuery || moodFilter !== 'all' || tagsFilter !== 'all' ? (
              <Button
                variant="link"
                className="text-primary mt-2"
                onClick={() => {
                  setSearchQuery('')
                  setMoodFilter('all')
                  setTagsFilter('all')
                }}
              >
                {t('common.clearFilters')}
              </Button>
            ) : (
              <Link to="/diary/create">
                <Button variant="link" className="text-primary mt-2">
                  {t('diaries.createFirstEntry')}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <CreateDiaryButton />
    </div>
  )
}
