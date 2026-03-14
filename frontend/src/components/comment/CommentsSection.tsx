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
      {isAuthenticated && (
        <div className="mb-10">
          <CommentForm onSubmit={handleAddComment} />
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-10 rounded-lg border bg-gray-50 py-4">
          <p className="text-center text-gray-400">
            Vui lòng{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              đăng nhập
            </Link>{' '}
            để bình luận
          </p>
        </div>
      )}

      <CommentList comments={comments} diaryOwnerId={diaryOwnerId} onDelete={handleDeleteComment} loading={loading} />
    </>
  )
}
