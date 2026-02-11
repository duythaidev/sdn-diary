import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { commentService } from '@/services/api/commentService'
import { CommentsSection } from '@/components/comment/CommentsSection'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { LikeButton } from '@/components/common/LikeButton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Edit, ArrowLeft, Lock, Bookmark, Share2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary, User, Comment } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import ImageViewer_Basic from '@/components/commerce-ui/image-viewer-basic'
import TagsList from '@/components/common/TagsList'
import { MOODS } from '@/constants'

export const DiaryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useProfile()
  const [loading, setLoading] = useState(true)
  const [diary, setDiary] = useState<Diary | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    if (id) {
      fetchDiary(id)
    }
  }, [id])

  const fetchDiary = async (id: string) => {
    try {
      const response = await diaryService.getDiaryById(id)
      setDiary(response.diary)
      setComments(response.comments || [])
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
      navigate('/diary')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (content: string) => {
    try {
      const response = await commentService.createComment(id!, content)
      setComments([response.comment, ...comments])
      fetchDiary(id!)
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
      throw error
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId)
      setComments(comments.filter((c) => c._id !== commentId))
      fetchDiary(id!)
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  const handleLike = async (diaryId: string) => {
    const result = await diaryService.toggleLike(diaryId)
    if (diary) {
      setDiary({
        ...diary,
        likesCount: result.likesCount,
        isLiked: result.isLiked,
      })
    }
    return result
  }

  if (loading) return <LoadingSpinner />
  if (!diary) return null

  const diaryUser = typeof diary.userId === 'object' ? diary.userId : null
  const isOwner = user?._id === (diaryUser ? (diaryUser as User)._id : diary.userId)

  const selectedMoodData = diary.selectedMood ? MOODS.find((mood) => mood.value === diary.selectedMood) : undefined

  const displayDate = format(new Date(diary.createdAt), 'MMM dd, yyyy')
  const authorName = diaryUser ? (diaryUser as User).username : 'Unknown'

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-gray-300 hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Main Content Card */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-lg">
          {/* Private Badge */}
          {!diary.isPublic && (
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                <Lock className="h-3 w-3" />
                Private – Only You Can See This
              </span>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8 border-b border-slate-700/50 pb-8">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">{diary.title}</h1>

            {/* Author Info and Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 ring-2 ring-slate-800/50">
                  {(diaryUser as User)?.profileImage ? (
                    <img
                      src={(diaryUser as User).profileImage!}
                      alt={authorName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {authorName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{authorName}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{displayDate}</span>
                    {selectedMoodData && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>{selectedMoodData.icon}</span>
                          <span style={{ color: selectedMoodData.color }}>Feeling {selectedMoodData.label}</span>
                        </span>
                      </>
                    )}
                    {diary.updatedAt !== diary.createdAt && (
                      <>
                        <span>•</span>
                        <span>Updated {format(new Date(diary.updatedAt), 'MMM dd, yyyy')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Link to={`/diary/${id}/edit`}>
                    <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <button className="rounded-full p-2 transition-colors hover:bg-gray-800">
                  <Bookmark className="h-5 w-5 text-gray-400" />
                </button>
                <button className="rounded-full p-2 transition-colors hover:bg-gray-800">
                  <Share2 className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          {diary.coverPhoto && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <ImageViewer_Basic thumbnailUrl={diary.coverPhoto} imageUrl={diary.coverPhoto} />
            </div>
          )}

          {/* Content Section */}
          <div>
            <div
              className="prose prose-invert prose-lg max-w-none leading-relaxed text-gray-200"
              dangerouslySetInnerHTML={{ __html: diary.content }}
            />
          </div>

          {/* Tags */}
          {diary.tags && diary.tags.length > 0 && (
            <div className="mb-8">
              <TagsList tags={diary.tags} />
            </div>
          )}

          {/* Like Button - Only show for public diaries */}
          {diary.isPublic && !diary.isDraft && isAuthenticated && (
            <div className="mb-8 flex items-center gap-4 border-t border-slate-700/50 pt-6">
              <LikeButton
                diaryId={diary._id}
                initialLikesCount={diary.likesCount || 0}
                initialIsLiked={diary.isLiked || false}
                onLike={handleLike}
                variant="detail"
              />
            </div>
          )}

          {/* Comments Section */}
          {diary.allowComments && !diary.isDraft && (
            <div className="mt-12">
              <CommentsSection
                diaryId={id!}
                diaryOwnerId={diaryUser ? ((diaryUser as User)._id as string) : (diary.userId as string)}
                comments={comments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
