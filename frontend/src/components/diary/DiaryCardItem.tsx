import { cn, getCardGradient, getMoodColor, getMoodIcon, getMoodLabel } from '@/lib/utils'
import type { Diary } from '@/types'
import { format } from 'date-fns'
import { Globe, Image, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const DiaryCardItem = ({ diary }: { diary: Diary }) => {
  return (
    <Link to={`/diary/${diary._id}`}>
      <div
        className={cn(
          'group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02]',
          'bg-linear-to-br',
          getCardGradient(diary.selectedMood),
          'border border-gray-700/50 hover:border-gray-600',
        )}
      >
        {/* Privacy Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium')}>
            {diary.isPublic ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </span>
        </div>

        {/* Draft Badge */}
        {diary.isDraft && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-900/80 px-3 py-1 text-xs font-medium text-yellow-100 backdrop-blur-sm">
              Draft
            </span>
          </div>
        )}

        <div className="flex h-56 items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-black/20">
          {diary.coverPhoto ? (
            <img
              src={diary.coverPhoto}
              alt={diary.title}
              className="h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-50"
            />
          ) : (
            <div className="opacity-30 transition-opacity group-hover:opacity-40">
              <Image className="h-16 w-16 text-gray-600" />
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          <h3 className="line-clamp-2 text-xl font-bold text-white">{diary.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
            {diary.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>

          <div className="flex items-center justify-between pt-4">
            <span className="text-xs tracking-wider text-gray-500 uppercase">
              {format(new Date(diary.createdAt), 'MMM dd, yyyy')}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{getMoodIcon(diary.selectedMood)}</span>
              <span className="text-sm font-medium" style={{ color: getMoodColor(diary.selectedMood) }}>
                {getMoodLabel(diary.selectedMood)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DiaryCardItem
