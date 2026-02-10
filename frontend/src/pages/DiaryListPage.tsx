import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, ChevronDown, Calendar, Smile, Tag, Plus, SlidersHorizontal } from 'lucide-react'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { MOODS } from '@/constants'
import { useGetUserDiaries } from '@/hooks/useGetUserDiaries'
import { cn } from '@/lib/utils'

export const DiaryListPage = () => {
  const {
    diaries,
    loading,
    setDateFilter,
    setMoodFilter,
    setTagsFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    moodFilter,
    tagsFilter,
  } = useGetUserDiaries()

  const allTags = Array.from(new Set(diaries?.flatMap((d) => d.tags || [])))
  const activeMood = MOODS.find((option) => option.value === moodFilter)

  return (
    <div className="min-h-screen">
      <div className="relative container mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="mb-3 text-5xl font-bold tracking-tight text-white">My Entries</h1>
            <p className="text-lg text-slate-400">Manage your daily reflections and thoughts.</p>
          </div>
          <Link to="/diary/create">
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="mb-10 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <SlidersHorizontal className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sort by Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-11 border px-5 backdrop-blur-md transition-all',
                    'border-slate-700 bg-slate-900/50 text-slate-300',
                    'hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  <Calendar className="text-primary mr-2 h-4 w-4" />
                  {dateFilter === 'newest' ? 'Newest First' : 'Oldest First'}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[180px] border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
                <DropdownMenuItem
                  className={cn(
                    'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                    dateFilter === 'newest' && 'bg-slate-800 text-white',
                  )}
                  onClick={() => setDateFilter('newest')}
                >
                  <Calendar className="text-primary mr-2 h-4 w-4" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                    dateFilter === 'oldest' && 'bg-slate-800 text-white',
                  )}
                  onClick={() => setDateFilter('oldest')}
                >
                  <Calendar className="text-primary mr-2 h-4 w-4" />
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mood Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-11 border px-5 backdrop-blur-md transition-all',
                    'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  <Smile className="text-primary mr-2 h-4 w-4" />
                  {activeMood ? (
                    <>
                      <span className="mr-1">{activeMood.icon}</span>
                      {activeMood.label}
                    </>
                  ) : (
                    'All Moods'
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[200px] border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
                <DropdownMenuItem
                  className={cn(
                    'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                    moodFilter === 'all' && 'bg-slate-800 text-white',
                  )}
                  onClick={() => setMoodFilter('all')}
                >
                  All Moods
                </DropdownMenuItem>
                <div className="my-1 h-px bg-slate-700/50" />
                {MOODS.map((mood) => (
                  <DropdownMenuItem
                    key={mood.value}
                    className={cn(
                      'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                      moodFilter === mood.value && 'bg-slate-800 text-white',
                    )}
                    onClick={() => setMoodFilter(mood.value)}
                  >
                    <span className="mr-2 text-lg">{mood.icon}</span>
                    {mood.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-11 border px-5 backdrop-blur-md transition-all',
                      'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    <Tag className="text-primary mr-2 h-4 w-4" />
                    {tagsFilter === 'all' ? 'All Tags' : `#${tagsFilter}`}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[300px] min-w-[200px] overflow-y-auto border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                      tagsFilter === 'all' && 'bg-slate-800 text-white',
                    )}
                    onClick={() => setTagsFilter('all')}
                  >
                    All Tags
                  </DropdownMenuItem>
                  <div className="my-1 h-px bg-slate-700/50" />
                  {allTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag}
                      className={cn(
                        'cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white',
                        tagsFilter === tag && 'bg-slate-800 text-white',
                      )}
                      onClick={() => setTagsFilter(tag)}
                    >
                      <span className="text-primary mr-2">#</span>
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-64 border-slate-700 bg-slate-900/50 pr-4 pl-11 text-white transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            {/* Active Filters Count */}
            {(moodFilter !== 'all' || tagsFilter !== 'all') && (
              <div className="text-primary flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                {[moodFilter !== 'all' && 'mood', tagsFilter !== 'all' && 'tag'].filter(Boolean).length} active
              </div>
            )}
          </div>
        </div>

        {/* Diary Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : diaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {diaries.map((diary) => (
              <DiaryCardItem key={diary._id} diary={diary} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/40 p-12 text-center shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <Search className="h-10 w-10 text-slate-500" />
                  </div>
                </div>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">No entries found</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                {searchQuery || moodFilter !== 'all' || tagsFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start your journaling journey by creating your first entry'}
              </p>
              <Link to="/diary/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Entry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
