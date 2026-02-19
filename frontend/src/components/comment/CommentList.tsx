import { formatDistanceToNow } from 'date-fns'
import type { Comment, User } from '@/types'
import { MessageCircle, Trash } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CommentListProps {
  comments: Comment[]
  diaryOwnerId: string
  onDelete: (commentId: string) => void
  loading?: boolean
}

export const CommentList = ({ comments, diaryOwnerId, onDelete, loading }: CommentListProps) => {
  const { user } = useProfile()

  const canDelete = (comment: Comment) => {
    if (!user) return false
    const commentUserId = typeof comment.userId === 'object' ? (comment.userId as User)._id : comment.userId
    return user._id === commentUserId || user._id === diaryOwnerId
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <MessageCircle className="text-muted-foreground/40 mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground font-serif text-sm italic">No comments yet. Be the first!</p>
      </div>
    )
  }

  return (
    <div className="mb-6 space-y-4">
      {comments.map((comment) => {
        const commentUser = typeof comment.userId === 'object' ? comment.userId : null
        const username = commentUser ? (commentUser as User).username : 'Unknown'
        const initials = username
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)

        const getAvatarColor = (name: string) => {
          const colors = [
            'from-orange-300 to-pink-300',
            'from-blue-300 to-purple-300',
            'from-green-300 to-teal-300',
            'from-yellow-300 to-orange-300',
            'from-pink-300 to-rose-300',
            'from-purple-300 to-indigo-300',
          ]
          return colors[name.charCodeAt(0) % colors.length]
        }

        return (
          <CommentItem
            key={comment._id}
            comment={comment}
            username={username}
            initials={initials}
            avatarColor={getAvatarColor(username)}
            canDelete={canDelete(comment)}
            onDelete={onDelete}
            loading={loading}
          />
        )
      })}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  username: string
  initials: string
  avatarColor: string
  canDelete: boolean
  onDelete: (commentId: string) => void
  loading?: boolean
}

const CommentItem = ({ comment, username, initials, avatarColor, canDelete, onDelete, loading }: CommentItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt as string), { addSuffix: true })
    .replace('about ', '')
    .replace('less than a minute ago', 'just now')

  const commentUser = typeof comment.userId === 'object' ? (comment.userId as User) : null

  return (
    <div className="flex items-start gap-3">
      <Avatar className="mt-1 h-8 w-8 shrink-0">
        <AvatarImage src={commentUser?.profileImage ?? undefined} alt={username} />
        <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-xs font-semibold text-gray-800`}>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 rounded-lg rounded-tl-none bg-gray-50 p-3">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-xs font-bold">{username}</span>
          <span className="text-muted-foreground text-[10px]">{timeAgo}</span>
        </div>
        <div className="flex items-start gap-2">
          <p className="text-foreground/80 flex-1 text-sm leading-relaxed">{comment.content}</p>
          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              disabled={loading}
              className="text-muted-foreground/50 mt-0.5 shrink-0 transition-colors hover:text-red-500 disabled:opacity-50"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
