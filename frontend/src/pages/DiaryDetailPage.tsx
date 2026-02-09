import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { RootState } from '@/redux/store'

import { diaryService } from '@/services/api/diaryService'
import { commentService } from '@/services/api/commentService'
import { Navbar } from '@/components/layout/Navbar'
import { CommentList } from '@/components/comment/CommentList'
import { CommentForm } from '@/components/comment/CommentForm'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Edit, Trash2, Globe, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary, User } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'

export const DiaryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useProfile()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await diaryService.deleteDiary(id!)
      toast.success('Diary entry deleted successfully')
      navigate('/diary')
    } catch (_error) {
      toast.error('Failed to delete diary entry')
      setDeleting(false)
    }
  }

  const handleAddComment = async (content: string) => {
    try {
      const response = await commentService.createComment(id!, content)
      toast.success('Comment added successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
      throw error
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId)
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!diary) return null

  const diaryUser = typeof diary.userId === 'object' ? diary.userId : null
  const isOwner = user?.id === (diaryUser ? (diaryUser as User).id : diary.userId)

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <CardTitle className="text-3xl">{diary.title}</CardTitle>
                  <Badge variant={diary.isPublic ? 'default' : 'secondary'}>
                    {diary.isPublic ? (
                      <>
                        <Globe className="mr-1 h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1 h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription>
                  By {diaryUser ? (diaryUser as User).username : 'Unknown'} •{' '}
                  {format(new Date(diary.createdAt), 'MMMM dd, yyyy')}
                  {diary.updatedAt !== diary.createdAt && (
                    <> • Updated {format(new Date(diary.updatedAt), 'MMM dd, yyyy')}</>
                  )}
                </CardDescription>
              </div>
              {isOwner && (
                <div className="flex gap-2">
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
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{diary.content}</p>
            </div>
          </CardContent>
        </Card>

        {diary.isPublic && (
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAuthenticated && <CommentForm onSubmit={handleAddComment} />}
              {/* <CommentList
                comments={comments}
                diaryOwnerId={diaryUser ? (diaryUser as User).id : (diary.userId as string)}
                onDelete={handleDeleteComment}
              /> */}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
