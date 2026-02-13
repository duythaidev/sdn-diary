import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MOODS } from '@/constants'
import type { Diary } from '@/types'

interface MoodBarChartProps {
  diaries: Diary[]
}

const MoodBarChart = ({ diaries }: MoodBarChartProps) => {
  // Calculate mood counts
  const moodData = MOODS.map((mood) => {
    const count = diaries.filter((diary) => diary.selectedMood === mood.value).length
    return {
      mood: mood.label + ' ' + mood.icon,
      count: count,
      fill: mood.color,
      icon: mood.icon,
    }
  })

  return (
    <Card className="h-full border-slate-700 bg-slate-800/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Mood Statistics</CardTitle>
        <CardDescription className="text-slate-400">Total diaries by mood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="mood" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{data.icon}</span>
                          <span className="font-semibold text-white">{data.mood}:</span>
                          <span className="text-slate-300">{data.count} entries</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default MoodBarChart
