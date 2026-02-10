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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="mb-3 text-5xl font-bold text-white tracking-tight">My Entries</h1>
            <p className="text-lg text-slate-400">Manage your daily reflections and thoughts.</p>
          </div>
          <Link to="/diary/create">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 h-12 shadow-lg shadow-cyan-500/25 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="mb-10 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sort by Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "border backdrop-blur-md transition-all h-11 px-5",
                    "bg-slate-900/50 border-slate-700 text-slate-300",
                    "hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
                  {dateFilter === 'newest' ? 'Newest First' : 'Oldest First'}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl min-w-[180px]">
                <DropdownMenuItem 
                  className={cn(
                    "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                    dateFilter === 'newest' && "bg-slate-800 text-white"
                  )}
                  onClick={() => setDateFilter('newest')}
                >
                  <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                    dateFilter === 'oldest' && "bg-slate-800 text-white"
                  )}
                  onClick={() => setDateFilter('oldest')}
                >
                  <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
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
                    "border backdrop-blur-md transition-all h-11 px-5",
                    moodFilter === 'all'
                      ? "bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white"
                      : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                  )}
                >
                  <Smile className="mr-2 h-4 w-4 text-cyan-400" />
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
              <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl min-w-[200px]">
                <DropdownMenuItem 
                  className={cn(
                    "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                    moodFilter === 'all' && "bg-slate-800 text-white"
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
                      "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                      moodFilter === mood.value && "bg-slate-800 text-white"
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
                      "border backdrop-blur-md transition-all h-11 px-5",
                      tagsFilter === 'all'
                        ? "bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                    )}
                  >
                    <Tag className="mr-2 h-4 w-4 text-cyan-400" />
                    {tagsFilter === 'all' ? 'All Tags' : `#${tagsFilter}`}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl min-w-[200px] max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem 
                    className={cn(
                      "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                      tagsFilter === 'all' && "bg-slate-800 text-white"
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
                        "text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer",
                        tagsFilter === tag && "bg-slate-800 text-white"
                      )}
                      onClick={() => setTagsFilter(tag)}
                    >
                      <span className="mr-2 text-cyan-400">#</span>
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
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-11 pl-11 pr-4 w-64 transition-all"
              />
            </div>

            {/* Active Filters Count */}
            {(moodFilter !== 'all' || tagsFilter !== 'all') && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
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
            <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center max-w-md shadow-2xl">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-slate-700/50 flex items-center justify-center">
                    <Search className="h-10 w-10 text-slate-500" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No entries found</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {searchQuery || moodFilter !== 'all' || tagsFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start your journaling journey by creating your first entry'}
              </p>
              <Link to="/diary/create">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 h-11 shadow-lg shadow-cyan-500/25 transition-all">
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