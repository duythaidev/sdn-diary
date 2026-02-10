import { formatDistanceToNow } from 'date-fns'
import type { Comment, User } from '@/types'
import { MessageCircle, Trash } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

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
      <div className="py-12 text-center">
        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-600" />
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const commentUser = typeof comment.userId === 'object' ? comment.userId : null
        const username = commentUser ? (commentUser as User).username : 'Unknown'

        // Generate avatar initials
        const initials = username
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)

        // Generate random pastel color for avatar (deterministic based on username)
        const getAvatarColor = (name: string) => {
          const colors = [
            'from-orange-300 to-pink-300',
            'from-blue-300 to-purple-300',
            'from-green-300 to-teal-300',
            'from-yellow-300 to-orange-300',
            'from-pink-300 to-rose-300',
            'from-purple-300 to-indigo-300',
          ]
          const index = name.charCodeAt(0) % colors.length
          return colors[index]
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
  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    .replace('about ', '')
    .replace('less than a minute ago', 'just now')

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="shrink-0">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${avatarColor}`}>
          <span className="text-lg font-semibold text-gray-800">{initials}</span>
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-base font-semibold text-white">{username}</span>
          <span className="text-sm text-gray-500">• {timeAgo}</span>
        </div>

        {/* Content */}
        <div className="mb-3 flex items-center rounded-lg bg-[#1a2837] px-4 py-3">
          <p className="flex-1 leading-relaxed text-gray-200">{comment.content}</p>
          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              disabled={loading}
              className="ml-auto text-sm text-gray-400 transition-colors hover:text-red-400 disabled:opacity-50"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
