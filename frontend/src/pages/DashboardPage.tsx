import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, BookOpen, MessageCircle, TrendingUp, Smile, Clock, PenSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import CreateDiaryButton from '@/components/common/CreateDiaryButton'
import { motion } from 'motion/react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import type { Diary } from '@/types'

type Range = 'last7' | 'lastmonth' | 'lastyear'

interface DashboardStats {
  totalEntries: number
  totalComments: number
  streak: number
  topMood: string | null
}

interface ActivityPoint {
  name: string
  entries: number
}

export const DashboardPage = () => {
  const { t } = useTranslation()
  const { user } = useProfile()

  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<Range>('last7')
  const [stats, setStats] = useState<DashboardStats>({ totalEntries: 0, totalComments: 0, streak: 0, topMood: null })
  const [activityData, setActivityData] = useState<ActivityPoint[]>([])
  const [recentDrafts, setRecentDrafts] = useState<Diary[]>([])
  const [recentPublic, setRecentPublic] = useState<Diary[]>([])

  const fetchDashboard = async (r: Range) => {
    try {
      setLoading(true)
      const data = await diaryService.getDashboardData(r)
      setStats(data.stats)
      setActivityData(data.activityData)
      setRecentDrafts(data.recentDrafts)
      setRecentPublic(data.recentPublic)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard(range)
  }, [range])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const topMoodLabel = stats.topMood ? stats.topMood.charAt(0).toUpperCase() + stats.topMood.slice(1) : '—'

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground/90 font-serif text-4xl font-bold">
            {t('dashboard.welcome', { name: user?.username ?? 'Friend' })}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/diary/create">
            <Button className="rounded-full font-serif shadow-lg transition-all hover:shadow-xl">
              <PenSquare className="mr-2 size-4" />
              {t('common.newEntry')}
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
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{stats.totalEntries}</h3>
          <p className="mt-1 text-sm font-medium text-yellow-800/60">{t('dashboard.stats.totalEntries')}</p>
        </motion.div>

        {/* Total Comments - Pink Sticky */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="relative -rotate-1 overflow-hidden bg-[#fdf2f8] p-6 shadow-md"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 h-8 w-full bg-[#fce7f3]/30" />
          <div className="absolute right-0 bottom-0 z-10 h-5 w-5 bg-[#fbcfe8] shadow-sm" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div className="rounded-full bg-pink-200/50 p-2">
              <MessageCircle className="size-5 text-pink-700" />
            </div>
            <span className="font-mono text-xs font-bold text-pink-700/50">#COMMENTS</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{stats.totalComments}</h3>
          <p className="mt-1 text-sm font-medium text-pink-800/60">{t('dashboard.stats.totalComments')}</p>
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
            <span className="font-mono text-xs font-bold text-blue-600">#STREAK</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-4xl font-bold">{stats.streak}</h3>
          <p className="text-muted-foreground mt-1 text-sm font-medium">{t('dashboard.stats.writingStreak')}</p>
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
            <span className="text-muted-foreground font-mono text-xs font-bold">#MOOD</span>
          </div>
          <h3 className="text-foreground/80 font-serif text-xl font-bold">{topMoodLabel}</h3>
          <p className="text-muted-foreground mt-1 text-sm font-medium">{t('dashboard.stats.mostFrequentMood')}</p>
        </motion.div>
      </div>

      {/* Chart + Recent Drafts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">{t('dashboard.writingActivity')}</h3>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="h-7 w-36 rounded-full border-black/10 font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">{t('dashboard.last7Days')}</SelectItem>
                <SelectItem value="lastmonth">{t('dashboard.lastMonth')}</SelectItem>
                <SelectItem value="lastyear">{t('dashboard.lastYear')}</SelectItem>
              </SelectContent>
            </Select>
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
                  interval="preserveStartEnd"
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
            <h3 className="font-serif text-xl font-bold">{t('dashboard.recentDrafts')}</h3>
            <Link to="/diary">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {t('common.viewAll')}
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentDrafts.length > 0 ? (
              recentDrafts.map((diary) => (
                <Link to={`/diary/${diary._id}`} key={diary._id}>
                  <div className="group bg-muted/30 cursor-pointer rounded-lg border border-transparent p-4 transition-all hover:border-black/5 hover:bg-white hover:shadow-md">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="group-hover:text-primary text-foreground/90 line-clamp-1 font-serif font-bold transition-colors">
                        {diary.title || t('common.untitled')}
                      </h4>
                      <span className="text-muted-foreground ml-2 shrink-0 rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px]">
                        {new Date(diary.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {diary.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground py-4 text-center font-serif text-sm italic">
                {t('dashboard.noDraftsYet')}
              </p>
            )}
          </div>

          <Link to="/diary/create">
            <Button className="mt-6 w-full bg-black font-serif text-white hover:bg-black/90">
              {t('dashboard.continueWriting')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Public Entries */}
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
          <div>
            <h2 className="text-foreground/90 font-serif text-2xl font-bold">{t('dashboard.recentEntries')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{t('dashboard.latestReflections')}</p>
          </div>
        </div>

        {recentPublic.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPublic.map((diary, index) => (
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
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-black/5 bg-white/50 py-20 text-center">
            <p className="text-muted-foreground font-serif text-xl">{t('dashboard.noEntriesYet')}</p>
            <Link to="/diary/create">
              <Button variant="link" className="text-primary mt-2">
                {t('dashboard.createFirstEntry')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CreateDiaryButton />
    </div>
  )
}
