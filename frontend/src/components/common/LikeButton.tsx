import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'

interface LikeButtonProps {
  diaryId: string
  initialLikesCount: number
  initialIsLiked: boolean
  onLike: (diaryId: string) => Promise<{ likesCount: number; isLiked: boolean }>
  variant?: 'default' | 'compact' | 'detail'
  className?: string
  disabled?: boolean
}

export const LikeButton = ({
  diaryId,
  initialLikesCount,
  initialIsLiked,
  onLike,
  variant = 'default',
  className,
  disabled = false,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading || disabled) return

    setIsLoading(true)
    setIsAnimating(true)

    // Optimistic update
    const previousIsLiked = isLiked
    const previousLikesCount = likesCount
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      const result = await onLike(diaryId)
      setIsLiked(result.isLiked)
      setLikesCount(result.likesCount)
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked)
      setLikesCount(previousLikesCount)
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleLike}
        disabled={isLoading || disabled}
        className={cn(
          'group flex items-center gap-1.5 transition-all',
          'hover:scale-105',
          isLoading && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-all duration-300',
            isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-400',
            isAnimating && 'scale-125',
          )}
        />
        {likesCount > 0 && (
          <span className={cn('text-xs font-medium', isLiked ? 'text-red-500' : 'text-slate-400')}>{likesCount}</span>
        )}
      </button>
    )
  }

  if (variant === 'detail') {
    return (
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-all',
          'border backdrop-blur-md',
          isLiked
            ? 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-red-500/50 hover:bg-slate-700/60',
          isLoading && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-all duration-300',
            isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-400',
            isAnimating && 'scale-125',
          )}
        />
        <span className="font-medium">
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </span>
      </button>
    )
  }

  // Default variant
  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        'group flex items-center gap-2 rounded-full px-3 py-1.5 transition-all',
        'border backdrop-blur-sm',
        isLiked
          ? 'border-red-500/30 bg-red-500/10 text-red-400'
          : 'border-slate-700/30 bg-slate-800/30 text-slate-400 hover:border-red-500/30',
        isLoading && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-300',
          isLiked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-400',
          isAnimating && 'scale-125',
        )}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  )
}
