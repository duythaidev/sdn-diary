import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { diaryService } from '@/services/api/diaryService'
import DiaryCardItem from '@/components/diary/DiaryCardItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { toast } from 'sonner'
import type { Diary } from '@/types'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'

const DashboardCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDateDiaries, setSelectedDateDiaries] = useState<Diary[]>([])

  const handleSelectDate = async (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      setIsOpen(true)
      fetchDiariesForDate(newDate)
    }
  }

  const fetchDiariesForDate = async (selectedDate: Date) => {
    setLoading(true)
    try {
      // Pass the specific date to the service
      const response = await diaryService.getUserDiaries(
        undefined, // dateFilter
        undefined, // moodFilter
        undefined, // tagsFilter
        undefined, // searchQuery
        1, // page
        50, // limit (fetch enough for a day)
        selectedDate,
      )
      setSelectedDateDiaries(response.diaries)
    } catch {
      toast.error('Failed to load diaries for this date')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="h-full border-slate-700 bg-slate-800/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CalendarIcon className="h-5 w-5 text-cyan-500" />
            Calendar
          </CardTitle>
          <CardDescription className="text-slate-400">View your journey by date</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            className="rounded-md border border-slate-700/50 bg-slate-900/50 p-3 text-slate-200 shadow-sm"
            classNames={{
              head_cell: 'text-slate-400 rounded-md w-9 font-normal text-[0.8rem]',
              cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-800/50 [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-700 hover:text-white rounded-md transition-colors text-slate-300',
              day_selected:
                'bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white focus:bg-cyan-600 focus:text-white',
              day_today: 'bg-slate-700/50 text-white font-bold',
              day_outside:
                'text-slate-600 opacity-50 aria-selected:bg-slate-800/50 aria-selected:text-slate-600 aria-selected:opacity-30',
              day_disabled: 'text-slate-600 opacity-50',
              nav_button: 'border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-400',
              caption: 'text-slate-200 font-medium relative items-center flex justify-center pt-1 pb-4',
            }}
          />
        </CardContent>
      </Card>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="border-t border-slate-700 bg-slate-900">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader className="relative mb-4 border-b border-slate-800 pb-4">
              <DrawerTitle className="text-center text-2xl font-bold text-white">
                {date ? format(date, 'MMMM do, yyyy') : 'Selected Date'}
              </DrawerTitle>
              <DrawerDescription className="mt-1 text-center text-slate-400">
                {selectedDateDiaries.length} entries found
              </DrawerDescription>
              <DrawerClose asChild className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <div className="no-scrollbar h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : selectedDateDiaries.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {selectedDateDiaries.map((diary) => (
                    <div key={diary._id} onClick={() => setIsOpen(false)}>
                      <DiaryCardItem diary={diary} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <p className="mb-2 text-lg">No entries for this day</p>
                  <p className="text-sm">Take a moment to reflect on your day.</p>
                </div>
              )}
            </div>

            <DrawerFooter className="border-t border-slate-800 pt-4">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DashboardCalendar
