import { checkIsOwner, cn, getMoodColor, getMoodIcon, getMoodLabel } from '@/lib/utils'
import type { Diary } from '@/types'
import { format } from 'date-fns'
import { Globe, Lock, MoreHorizontal, Edit, MessageCircle, FileText, Calendar, Pin, Paperclip } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/useProfile'
import { LikeButton } from '@/components/common/LikeButton'
import { diaryService } from '@/services/api/diaryService'
import { motion } from 'motion/react'

interface DiaryCardItemProps {
  diary: Diary
  showActions?: boolean
  onLikeUpdate?: (diaryId: string, likesCount: number, isLiked: boolean) => void
  className?: string
  /** Visual rotation for the paper card effect */
  rotation?: number
  /** Paper color variant */
  color?: string
  /** Paper texture: plain, lined, or dotted */
  texture?: 'plain' | 'lined' | 'dotted'
  /** Decoration on top of the card */
  decoration?: 'tape' | 'pin' | 'clip' | 'none'
  /** Stagger animation delay index */
  delay?: number
}

const textureStyles = {
  plain: {},
  lined: {
    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
    backgroundSize: '100% 24px',
  },
  dotted: {
    backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
}

const DiaryCardItem = ({
  diary,
  showActions,
  onLikeUpdate,
  className,
  rotation = 0,
  color = 'bg-[#fdfbf7]',
  texture = 'plain',
  decoration = 'none',
  delay = 0,
}: DiaryCardItemProps) => {
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
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        zIndex: 10,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={cn('relative group mb-8 mx-2', className)}
    >
      {/* Decorations */}
      {decoration === 'tape' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm z-20 border-l border-r border-white/60" />
      )}
      {decoration === 'pin' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 drop-shadow-md">
          <Pin className="fill-red-500 text-red-600 size-6 rotate-12" />
        </div>
      )}
      {decoration === 'clip' && (
        <div className="absolute -top-4 right-4 z-20 drop-shadow-md">
          <Paperclip className="text-zinc-600 size-8 -rotate-45" />
        </div>
      )}

      <Link to={`/diary/${diary._id}`} className="block">
        <div className={cn('relative overflow-hidden rounded-sm border-0 shadow-lg', color)}>
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50 z-0"
            style={textureStyles[texture]}
          />

          {/* Cover photo (optional) */}
          {diary.coverPhoto && (
            <div className="relative w-full h-40 overflow-hidden">
              <img
                src={diary.coverPhoto}
                alt={diary.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>
          )}

          <div className="p-6 relative z-10">
            {/* Header: author info + actions */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                <time className="font-mono">{format(new Date(diary.createdAt), 'MMM dd, yyyy')}</time>
              </div>

              <div className="flex items-center gap-2">
                {/* Privacy / Draft badge */}
                {diary.isDraft ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <FileText className="size-3" />
                    Draft
                  </span>
                ) : diary.isPublic ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
                    <Globe className="size-3" />
                    Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                    <Lock className="size-3" />
                    Private
                  </span>
                )}

                {/* Actions menu */}
                {shouldShowActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={handleEdit}
                        className="cursor-pointer text-sm"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 font-serif leading-snug text-foreground/90 line-clamp-2">
              {diary.title}
            </h3>

            {/* Content preview */}
            <p className="text-muted-foreground leading-relaxed text-sm mb-5 font-serif line-clamp-4">
              {diary.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
            </p>

            {/* Tags */}
            {diary.tags && diary.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {diary.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-0.5 bg-black/5 hover:bg-black/10 text-foreground/60 border-0 font-normal font-mono text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer: mood + interactions */}
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              {/* Mood */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${getMoodColor(diary.selectedMood)}18`,
                  borderColor: `${getMoodColor(diary.selectedMood)}30`,
                  color: getMoodColor(diary.selectedMood),
                }}
              >
                <span className="text-base leading-none">{getMoodIcon(diary.selectedMood)}</span>
                {getMoodLabel(diary.selectedMood)}
              </div>

              {/* Like + Comment (public only) */}
              {diary.isPublic && !diary.isDraft && (
                <div className="flex items-center gap-3">
                  <LikeButton
                    diaryId={diary._id}
                    initialLikesCount={diary.likesCount || 0}
                    initialIsLiked={diary.isLiked || false}
                    onLike={handleLike}
                    variant="compact"
                  />
                  {diary.allowComments && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-blue-500 transition-colors">
                      <MessageCircle className="size-4" />
                    </div>
                  )}
                </div>
              )}

              {/* Read time */}
              <span className="text-xs text-muted-foreground font-mono">
                {Math.ceil(diary.content.replace(/<[^>]*>/g, '').length / 1000)} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default DiaryCardItem