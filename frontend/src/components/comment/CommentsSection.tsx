import { useState } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import type { Comment } from '@/types'
import { Link } from 'react-router-dom'

interface CommentsSectionProps {
  diaryId: string
  diaryOwnerId: string
  comments?: Comment[]
  onAddComment: (content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
  isAuthenticated: boolean
}

export const CommentsSection = ({
  diaryOwnerId,
  comments = [],
  onAddComment,
  onDeleteComment,
  isAuthenticated,
}: CommentsSectionProps) => {
  const [loading, setLoading] = useState(false)

  const handleAddComment = async (content: string) => {
    setLoading(true)
    try {
      await onAddComment(content)
      // Parent component should handle updating the comments list
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    setLoading(true)
    try {
      await onDeleteComment(commentId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <h2 className="text-xl text-3xl text-primary">Comments</h2>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-gray-300">
          {comments.length}
        </span>
      </div>

      {isAuthenticated && (
        <div className="mb-10">
          <CommentForm onSubmit={handleAddComment} />
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-10 rounded-lg border bg-gray-50 py-4">
          <p className="text-center text-gray-400">
            Please{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              sign in
            </Link>{' '}
            to leave a comment
          </p>
        </div>
      )}

      <CommentList comments={comments} diaryOwnerId={diaryOwnerId} onDelete={handleDeleteComment} loading={loading} />
    </>
  )
}
