import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, ChevronDown } from 'lucide-react'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { MOODS } from '@/constants'
import { useGetUserDiaries } from '@/hooks/useGetUserDiaries'

export const DiaryListPage = () => {
  const { diaries, loading, setDateFilter, setMoodFilter, setTagsFilter, searchQuery, setSearchQuery } =
    useGetUserDiaries()

  const allTags = Array.from(new Set(diaries?.flatMap((d) => d.tags || [])))

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-5xl font-bold">My Entries</h1>
          <p className="text-lg text-gray-400">Manage your daily reflections and thoughts.</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 bg-[#1a2332] text-gray-300 hover:bg-[#243447] hover:text-white"
              >
                Date
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-[#1a2332]">
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setDateFilter('all')}>
                All Dates
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setDateFilter('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setDateFilter('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setDateFilter('month')}>
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mood Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 bg-[#1a2332] text-gray-300 hover:bg-[#243447] hover:text-white"
              >
                Mood
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-[#1a2332]">
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setMoodFilter('all')}>
                All Moods
              </DropdownMenuItem>
              {MOODS.map((mood) => (
                <DropdownMenuItem
                  key={mood.value}
                  className="text-gray-300 hover:bg-[#243447]"
                  onClick={() => setMoodFilter(mood.value)}
                >
                  <span className="mr-2">{mood.icon}</span>
                  {mood.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 bg-[#1a2332] text-gray-300 hover:bg-[#243447] hover:text-white"
              >
                Tags
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-[#1a2332]">
              <DropdownMenuItem className="text-gray-300 hover:bg-[#243447]" onClick={() => setTagsFilter('all')}>
                All Tags
              </DropdownMenuItem>
              {allTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  className="text-gray-300 hover:bg-[#243447]"
                  onClick={() => setTagsFilter(tag)}
                >
                  #{tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-700 bg-[#1a2332] pl-10 text-gray-300 placeholder:text-gray-500 focus:border-gray-600"
            />
          </div>
        </div>

        {/* Diary Grid */}
        {diaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diaries.map((diary) => (
              <DiaryCardItem key={diary._id} diary={diary} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="mb-4 text-lg text-gray-400">No entries found</p>
            <Link to="/diary/create">
              <Button className="bg-blue-600 hover:bg-blue-700">Create New Entry</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
