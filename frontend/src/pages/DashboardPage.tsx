import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, BookOpen, PenLine, TrendingUp, Smile, Clock, PenSquare, Star, StickyNote } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import CreateDiaryButton from '@/components/common/CreateDiaryButton'
import MoodBarChart from '@/components/dashboard/MoodBarChart'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar'
import { motion } from 'motion/react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, isSameDay } from 'date-fns'

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

  // Compute stats from real diaries
  const totalEntries = diaries.length
  const totalWords = diaries.reduce((acc, d) => acc + d.content.replace(/<[^>]*>/g, '').split(/\s+/).length, 0)
  const wordDisplay = totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : `${totalWords}`

  // Streak: count consecutive days with at least one entry
  let streak = 0
  let checkDate = new Date()
  while (true) {
    const hasEntry = diaries.some((d) => isSameDay(new Date(d.createdAt), checkDate))
    if (!hasEntry) break
    streak++
    checkDate = subDays(checkDate, 1)
  }

  // Most frequent mood
  const moodCounts: Record<string, number> = {}
  diaries.forEach((d) => {
    if (d.selectedMood) moodCounts[d.selectedMood] = (moodCounts[d.selectedMood] || 0) + 1
  })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const topMoodLabel = topMood.charAt(0).toUpperCase() + topMood.slice(1)

  // Activity chart: last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))
  const activityData = last7Days.map((day) => ({
    name: format(day, 'EEE'),
    entries: diaries.filter((d) => isSameDay(new Date(d.createdAt), day)).length,
  }))

  // Recent drafts
  const recentDrafts = diaries.filter((d) => d.isDraft).slice(0, 3)
  const recentEntries = diaries.slice(0, 6)
  const todayStr = format(new Date(), 'MMM d')

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground/90 font-serif text-4xl font-bold">
            Welcome back,{' '}
            <span className="text-primary decoration-primary/30 underline decoration-wavy">
              {user?.username ?? 'Friend'}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Here's what's happening on your desk today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/diary">
            <Button
              variant="outline"
              className="rounded-full border-2 border-dashed border-black/10 bg-white hover:border-black/30"
            >
              <Clock className="mr-2 size-4" />
              History
            </Button>
          </Link>
          <Link to="/diary/create">
            <Button className="rounded-full font-serif shadow-lg transition-all hover:shadow-xl">
              <PenSquare className="mr-2 size-4" />
              New Entry
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Entries - Yellow Sticky */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="relative rotate-1 overflow-hidden bg-[#fefce8] p-6 shadow-md"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 h-8 w-full bg-[#fef08a]/30" />
          <div className="absolute right-0 bottom-0 z-10 h-5 w-5 bg-[#fde047] shadow-sm" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div className="rounded-full bg-yellow-200/50 p-2">
              <BookOpen className="size-5 text-yellow-700" />
            </div>
            <span className="font-mono text-xs font-bold text-yellow-700/50">#TOTAL</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{totalEntries}</h3>
          <p className="mt-1 text-sm font-medium text-yellow-800/60">Journal Entries</p>
        </motion.div>

        {/* Words Written - Pink Sticky */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="relative -rotate-1 overflow-hidden bg-[#fdf2f8] p-6 shadow-md"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 h-8 w-full bg-[#fce7f3]/30" />
          <div className="absolute right-0 bottom-0 z-10 h-5 w-5 bg-[#fbcfe8] shadow-sm" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div className="rounded-full bg-pink-200/50 p-2">
              <PenLine className="size-5 text-pink-700" />
            </div>
            <span className="font-mono text-xs font-bold text-pink-700/50">#WORDS</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{wordDisplay}</h3>
          <p className="mt-1 text-sm font-medium text-pink-800/60">Words Written</p>
        </motion.div>

        {/* Streak - White card with tape */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-sm border border-black/5 bg-white p-6 shadow-md"
        >
          <div className="absolute -top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rotate-1 border-r border-l border-white/60 bg-blue-100/50 backdrop-blur-sm" />
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-full bg-blue-50 p-2">
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {streak > 5 ? 'Top 10%' : 'Keep going!'}
            </Badge>
          </div>
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{streak}</h3>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Day Streak 🔥</p>
        </motion.div>

        {/* Mood - White card with pin */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-sm border border-black/5 bg-white p-6 shadow-md"
        >
          <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 drop-shadow-sm">
            <div className="h-3 w-3 rounded-full border border-red-600 bg-red-500 shadow-sm" />
          </div>
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-full bg-green-50 p-2">
              <Smile className="size-5 text-green-600" />
            </div>
            <span className="text-muted-foreground font-mono text-xs font-bold">MOOD</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-xl font-bold">{topMoodLabel}</h3>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Most frequent mood</p>
        </motion.div>
      </div>

      {/* Chart + Recent Drafts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')" }}
          />
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Writing Activity</h3>
            <span className="text-muted-foreground font-mono text-xs">Last 7 days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="entries"
                  stroke="#000"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEntries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="relative rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Recent Drafts</h3>
            <Link to="/diary">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentDrafts.length > 0
              ? recentDrafts.map((diary) => (
                  <Link to={`/diary/${diary._id}`} key={diary._id}>
                    <div className="group bg-muted/30 cursor-pointer rounded-lg border border-transparent p-4 transition-all hover:border-black/5 hover:bg-white hover:shadow-md">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="group-hover:text-primary text-foreground/90 line-clamp-1 font-serif font-bold transition-colors">
                          {diary.title || 'Untitled Entry'}
                        </h4>
                        <span className="text-muted-foreground ml-2 shrink-0 rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px]">
                          {format(new Date(diary.createdAt), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {diary.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    </div>
                  </Link>
                ))
              : // Fallback: show recent non-draft entries
                recentEntries.slice(0, 3).map((diary) => (
                  <Link to={`/diary/${diary._id}`} key={diary._id}>
                    <div className="group bg-muted/30 cursor-pointer rounded-lg border border-transparent p-4 transition-all hover:border-black/5 hover:bg-white hover:shadow-md">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="group-hover:text-primary text-foreground/90 line-clamp-1 font-serif font-bold transition-colors">
                          {diary.title || 'Untitled Entry'}
                        </h4>
                        <span className="text-muted-foreground ml-2 shrink-0 rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px]">
                          {format(new Date(diary.createdAt), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {diary.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    </div>
                  </Link>
                ))}

            {recentDrafts.length === 0 && recentEntries.length === 0 && (
              <p className="text-muted-foreground py-4 text-center font-serif text-sm italic">No entries yet.</p>
            )}
          </div>

          <Link to="/diary/create">
            <Button className="mt-6 w-full bg-black font-serif text-white hover:bg-black/90">Continue Writing</Button>
          </Link>
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
          <div>
            <h2 className="text-foreground/90 font-serif text-2xl font-bold">Recent Entries</h2>
            <p className="text-muted-foreground mt-1 text-sm">Your latest reflections and thoughts</p>
          </div>
          <Link to="/diary/create">
            <Button className="rounded-full font-serif shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {recentEntries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentEntries.map((diary, index) => (
                <DiaryCardItem
                  key={diary._id}
                  diary={diary}
                  rotation={index % 2 === 0 ? -1 : 1}
                  color={index % 3 === 0 ? 'bg-[#fdfbf7]' : index % 3 === 1 ? 'bg-[#fffef0]' : 'bg-white'}
                  texture={index % 3 === 0 ? 'lined' : 'plain'}
                  decoration={index % 4 === 0 ? 'clip' : index % 4 === 1 ? 'pin' : 'none'}
                  delay={index % 6}
                />
              ))}
            </div>

            {diaries.length > 6 && (
              <div className="mt-10 flex justify-center">
                <Link to="/diary">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-black/10 px-8 transition-all hover:bg-white hover:shadow-md"
                  >
                    View All Entries
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-black/5 bg-white/50 py-20 text-center">
            <p className="text-muted-foreground font-serif text-xl">No diary entries yet.</p>
            <Link to="/diary/create">
              <Button variant="link" className="text-primary mt-2">
                Create your first entry
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CreateDiaryButton />
    </div>
  )
}
