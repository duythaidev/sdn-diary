import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { commentService } from '@/services/api/commentService'
import { CommentList } from '@/components/comment/CommentList'
import { CommentForm } from '@/components/comment/CommentForm'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'
import { Edit, Trash2, ArrowLeft, Lock, Bookmark, Share2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Comment, Diary, User } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import ImageViewer_Basic from '@/components/commerce-ui/image-viewer-basic'

export const DiaryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useProfile()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [diary, setDiary] = useState<Diary | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  const moods = [
    { icon: '😫', label: 'Stressed', value: 'stressed', color: 'orange' },
    { icon: '😐', label: 'Okay', value: 'okay', color: '#6e6e4e' },
    { icon: '😌', label: 'Calm', value: 'calm', color: '#1d3a50' },
    { icon: '😊', label: 'Happy', value: 'happy', color: '#1abc9c' },
    { icon: '🤩', label: 'Great', value: 'great', color: '#8e44ad' },
  ]

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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await diaryService.deleteDiary(id!)
      toast.success('Diary entry deleted successfully')
      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
      setDeleting(false)
    }
  }

  const handleAddComment = async (content: string) => {
    try {
      const response = await commentService.createComment(id!, content)
      setComments([response.comment, ...comments])
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
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  if (loading) return <LoadingSpinner />
  if (!diary) return null

  const diaryUser = typeof diary.userId === 'object' ? diary.userId : null
  const isOwner = user?._id === (diaryUser ? (diaryUser as User)._id : diary.userId)

  const selectedMoodData = diary.selectedMood ? moods.find((mood) => mood.value === diary.selectedMood) : undefined

  const displayDate = format(new Date(diary.createdAt), 'MMM dd, yyyy')
  const authorName = diaryUser ? (diaryUser as User).username : 'Unknown'

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Main Content Card */}
        <div className="bg-background mx-auto max-w-3xl overflow-hidden rounded-lg shadow-lg">
          {/* Private Badge */}
          {!diary.isPublic && (
            <div className="mb-4 flex justify-center">
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                <Lock className="h-3 w-3" />
                Private – Only You Can See This
              </span>
            </div>
          )}

          {/* Header Section with Title and Author */}
          <div className="mb-6 border-b pb-6">
            <h1 className="text-foreground mb-6 text-4xl font-bold">{diary.title}</h1>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-sm font-medium">
                    {authorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{authorName}</p>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
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
                  <>
                    <Link to={`/diary/${id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" disabled={deleting}>
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Diary Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this diary entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <button className="hover:bg-muted rounded-full p-2 transition-colors">
                  <Bookmark className="text-foreground/60 h-5 w-5" />
                </button>
                <button className="hover:bg-muted rounded-full p-2 transition-colors">
                  <Share2 className="text-foreground/60 h-5 w-5" />
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
          <div className="bg-background px-8">
            <div
              className="text-foreground/90 prose prose-lg max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: diary.content }}
            />

            {/* Tags */}
            {diary.tags && diary.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {diary.tags.map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          {diary.allowComments && (
            <div className="border-border mt-8 border-t">
              <div className="bg-muted/30 flex items-center gap-6 px-8 py-4">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length} Comments</span>
                </div>
              </div>

              <div className="space-y-6 py-6">
                {isAuthenticated && (
                  <div className="mb-6">
                    <CommentForm onSubmit={handleAddComment} />
                  </div>
                )}

                <CommentList
                  comments={comments}
                  diaryOwnerId={diaryUser ? ((diaryUser as User)._id as string) : (diary.userId as string)}
                  onDelete={handleDeleteComment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
