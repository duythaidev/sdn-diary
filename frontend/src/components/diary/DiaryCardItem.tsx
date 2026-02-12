import { checkIsOwner, cn, getMoodColor, getMoodIcon, getMoodLabel } from '@/lib/utils'
import type { Diary } from '@/types'
import { format } from 'date-fns'
import { Globe, Image, Lock, MoreHorizontal, Edit, Trash2, Copy, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import { LikeButton } from '@/components/common/LikeButton'
import { diaryService } from '@/services/api/diaryService'

interface DiaryCardItemProps {
  diary: Diary
  showActions?: boolean
  onLikeUpdate?: (diaryId: string, likesCount: number, isLiked: boolean) => void
}

const DiaryCardItem = ({ diary, showActions, onLikeUpdate }: DiaryCardItemProps) => {
  const navigate = useNavigate()
  const { user } = useProfile()

  const isOwner = checkIsOwner(user, diary)

  const shouldShowActions = showActions !== undefined ? showActions : isOwner

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/diary/${diary._id}/edit`)
  }

  const handleLike = async (diaryId: string) => {
    const result = await diaryService.toggleLike(diaryId)
    if (onLikeUpdate) {
      onLikeUpdate(diaryId, result.likesCount, result.isLiked)
    }
    return result
  }

  return (
    <Link to={`/diary/${diary._id}`} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl transition-all duration-500',
          'border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl',
          'hover:border-primary/50 hover:shadow-primary/10 hover:shadow-2xl',
          'hover:-translate-y-1',
        )}
      >
        {/* Actions Menu - Only show if user is owner */}
        {shouldShowActions && (
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
                {/* 
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

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
          <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-slate-900/80" />

          {diary.coverPhoto ? (
            <img
              src={diary.coverPhoto}
              alt={diary.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800/30 to-slate-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl" />
                <Image className="relative h-20 w-20 text-slate-600" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative space-y-4 p-6">
          <h3 className="line-clamp-2 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-100">
            {diary.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
            {diary.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>

          {/* Footer with Date, Mood, and Interactions */}
          <div className="space-y-3 border-t border-slate-700/50 pt-4">
            <div className="flex items-center justify-between">
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

            {/* Interaction Stats - Only show for public diaries */}
            {diary.isPublic && !diary.isDraft && (
              <div className="flex items-center gap-4">
                <LikeButton
                  diaryId={diary._id}
                  initialLikesCount={diary.likesCount || 0}
                  initialIsLiked={diary.isLiked || false}
                  onLike={handleLike}
                  variant="compact"
                />

                {diary.allowComments && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {/* You can add comment count here if available */}
                      Comments
                    </span>
                  </div>
                )}
              </div>
            )}
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
