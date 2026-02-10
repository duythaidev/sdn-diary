import { cn, getMoodColor, getMoodIcon, getMoodLabel } from '@/lib/utils'
import type { Diary } from '@/types'
import { format } from 'date-fns'
import { Globe, Image, Lock, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const DiaryCardItem = ({ diary }: { diary: Diary }) => {
  const navigate = useNavigate()

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/diary/edit/${diary._id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Link to={`/diary/${diary._id}`} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg transition-all duration-500',
          'border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl',
          'hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10',
          'hover:-translate-y-1',
        )}
      >
        {/* Gradient overlay matching mood */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
          style={{
            background: `linear-gradient(135deg, ${getMoodColor(diary.selectedMood)}20 0%, transparent 100%)`,
          }}
        />

        {/* Actions Menu */}
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-slate-700/50 bg-slate-900/80 text-slate-300 opacity-0 shadow-lg backdrop-blur-md transition-all group-hover:opacity-100 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer text-slate-200 focus:bg-slate-800 focus:text-white"
              >
                <Edit className="mr-2 h-4 w-4 text-cyan-400" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDuplicate}
                className="cursor-pointer text-slate-200 focus:bg-slate-800 focus:text-white"
              >
                <Copy className="mr-2 h-4 w-4 text-blue-400" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Privacy Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all',
              diary.isPublic
                ? 'border-cyan-500/30 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600/50 bg-slate-700/60 text-slate-300',
            )}
          >
            {diary.isPublic ? (
              <>
                <Globe className="h-3.5 w-3.5" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Private
              </>
            )}
          </span>
        </div>

        {/* Draft Badge */}
        {diary.isDraft && (
          <div className="absolute top-4 left-24 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-md">
              Draft
            </span>
          </div>
        )}

        {/* Cover Image Section */}
        <div className="relative flex h-64 items-center justify-center overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />

          {diary.coverPhoto ? (
            <img
              src={diary.coverPhoto}
              alt={diary.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800/30 to-slate-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl" />
                <Image className="relative h-20 w-20 text-slate-600" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative space-y-4 p-6">
          {/* Title */}
          <h3 className="line-clamp-2 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-100">
            {diary.title}
          </h3>

          {/* Content Preview */}
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
            {diary.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>

          {/* Footer with Date and Mood */}
          <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500/60" />
              <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                {format(new Date(diary.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>

            <div
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm transition-all"
              style={{
                backgroundColor: `${getMoodColor(diary.selectedMood)}15`,
                borderColor: `${getMoodColor(diary.selectedMood)}30`,
              }}
            >
              <span className="text-xl leading-none">{getMoodIcon(diary.selectedMood)}</span>
              <span className="text-sm font-semibold" style={{ color: getMoodColor(diary.selectedMood) }}>
                {getMoodLabel(diary.selectedMood)}
              </span>
            </div>
          </div>
        </div>

        {/* Hover shine effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        </div>
      </div>
    </Link>
  )
}

export default DiaryCardItem
