import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { diaryService } from '@/services/api/diaryService'
import { commentService } from '@/services/api/commentService'
import { CommentsSection } from '@/components/comment/CommentsSection'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { LikeButton } from '@/components/common/LikeButton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Edit, ArrowLeft, Lock, Share2, FileText, Calendar, Heart, MessageCircle, Trash } from 'lucide-react'
import { toast } from 'sonner'
import type { Diary, Comment } from '@/types'
import { useProfile } from '@/hooks/useProfile'
import { getAxiosErrorMessage } from '@/lib/error'
import { MOODS } from '@/constants'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
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

export const DiaryDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useProfile()
  const [loading, setLoading] = useState(true)
  const [diary, setDiary] = useState<Diary | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    if (id) fetchDiary(id)
  }, [id])

  const fetchDiary = async (id: string) => {
    try {
      let response
      if (isAuthenticated) {
        response = await diaryService.getDiaryById(id)
      } else {
        response = await diaryService.getPublicDiaryById(id)
      }
      setDiary(response.diary)
      setComments(response.comments || [])
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (content: string) => {
    try {
      const response = await commentService.createComment(id!, content)
      setComments([response.comment, ...comments])
      fetchDiary(id!)
      toast.success(t('detail.commentSuccess'))
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
      toast.success(t('detail.commentDeleteSuccess'))
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  const handleLike = async (diaryId: string) => {
    const result = await diaryService.toggleLike(diaryId)
    if (diary) {
      setDiary({ ...diary, likesCount: result.likesCount, isLiked: result.isLiked })
    }
    return result
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/diary/${id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Copy đường dẫn thành công')
  }

  const handleDelete = async () => {
    try {
      await diaryService.deleteDiary(id!)
      toast.success(t('diaries.deleteSuccess'))
      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  if (loading) return <LoadingSpinner />
  if (!diary) return null

  const diaryUser = typeof diary.userId === 'object' ? diary.userId : null
  const isOwner = user?._id === (diaryUser ? diaryUser._id : diary.userId)
  const selectedMoodData = diary.selectedMood ? MOODS.find((m) => m.value === diary.selectedMood) : undefined
  const displayDate = new Date(diary.createdAt).toLocaleDateString('vi-VN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const authorName = diaryUser?.username ?? t('common.anonymous')
  const authorInitials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl pb-20 duration-500">
      {/* Navigation Bar */}
      <div className="sticky top-[72px] z-30 mb-8 flex items-center justify-between bg-[#f8f5f2]/80 py-2 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 size-4" />
          {t('common.back')}
        </Button>
        <div className="flex gap-2">
          {isOwner && (
            <Link to={`/diary/${id}/edit`}>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5" title={t('common.edit')}>
                <Edit className="text-muted-foreground size-5" />
              </Button>
            </Link>
          )}
          {diary.isPublic && !diary.isDraft && (
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-black/5"
              title={t('common.share')}
            >
              <Share2 className="text-muted-foreground size-5" />
            </Button>
          )}
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-black/5"
                  title={t('common.delete')}
                >
                  <Trash className="size-5 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('diary.deleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('diary.deleteDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Draft / Private badge */}
      {diary.isDraft ? (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <FileText className="h-3 w-3" />
            {t('detail.draftBadge')}
          </span>
        </div>
      ) : (
        !diary.isPublic && (
          <div className="mb-4 flex justify-center">
            <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium">
              <Lock className="h-3 w-3" />
              {t('detail.privateBadge')}
            </span>
          </div>
        )
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Main Content — The "Paper" */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative lg:col-span-8">
          {/* Decorative Tape */}
          <div className="absolute -top-3 left-1/2 z-20 h-10 w-48 -translate-x-1/2 -rotate-1 border-r border-l border-white/40 bg-[#fbf8f3]/60 shadow-sm backdrop-blur-sm" />

          <div className="relative overflow-hidden rounded-sm border border-black/5 bg-[#fdfbf7] p-8 shadow-xl md:p-12">
            {/* Lined paper texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 32px' }}
            />

            {/* Cover photo */}
            {diary.coverPhoto && (
              <div className="relative z-10 -mx-8 -mt-8 mb-8 md:-mx-12 md:-mt-12">
                <img src={diary.coverPhoto} alt={diary.title} className="h-64 w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#fdfbf7]" />
              </div>
            )}

            {/* Header */}
            <div className="relative z-10 pb-6">
              <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider uppercase">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {displayDate}
                </div>
                {selectedMoodData && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5" style={{ color: selectedMoodData.color }}>
                      <span>{selectedMoodData.icon}</span>
                      {t('common.feeling')} {selectedMoodData.label}
                    </div>
                  </>
                )}
                {diary.updatedAt !== diary.createdAt && (
                  <>
                    <span>•</span>
                    <span>
                      {t('detail.updated')}{' '}
                      {new Date(diary.updatedAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-foreground/90 mb-4 font-serif text-3xl leading-tight font-bold md:text-5xl">
                {diary.title}
              </h1>

              {diary.tags && diary.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {diary.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-muted-foreground border-0 bg-black/5 font-normal hover:bg-black/10"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="relative z-10">
              <div
                className="prose prose-lg prose-stone text-foreground/80 max-w-none font-serif leading-loose"
                dangerouslySetInnerHTML={{ __html: diary.content }}
              />
            </div>

            {/* Footer: mood + author signature */}
            <div className="relative z-10 mt-12 flex items-center justify-between border-t border-black/10 pt-8">
              {selectedMoodData && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-serif text-sm font-bold italic">{t('common.mood')}:</span>
                  <span
                    className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: `${selectedMoodData.color}15`,
                      borderColor: `${selectedMoodData.color}30`,
                      color: selectedMoodData.color,
                    }}
                  >
                    {selectedMoodData.icon} {selectedMoodData.label}
                  </span>
                </div>
              )}
              <div className="text-muted-foreground -rotate-2 font-serif text-2xl italic opacity-80">{authorName}</div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Author Card */}
          <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 text-center shadow-sm">
            <div className="from-primary/10 absolute top-0 left-0 h-20 w-full bg-linear-to-b to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <Avatar className="mb-4 h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={diaryUser?.profileImage ?? undefined} alt={authorName} />
                <AvatarFallback className="font-serif text-lg">{authorInitials}</AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">{t('common.author')}</p>
              <h3 className="font-serif text-lg">{authorName}</h3>
              {diaryUser?.bio && (
                <p className="text-muted-foreground mb-6 px-4 text-sm leading-relaxed">{diaryUser.bio}</p>
              )}
            </div>
          </div>

          {/* Engagement Card */}
          {diary.isPublic && !diary.isDraft && (
            <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
              {diary.allowComments ? (
                <h3 className="mb-4 flex items-center gap-2 font-serif font-bold">
                  <MessageCircle className="size-4" />
                  {t('common.discussion')}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-gray-300">
                    {comments.length}
                  </span>
                </h3>
              ) : (
                <h3 className="mb-4 flex items-center gap-2 font-serif italic">Bài viết không cho bình luận</h3>
              )}

              {/* Like block */}
              {isAuthenticated && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      <Heart className={`size-5 ${diary.isLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-rose-900">{t('common.likes', { count: diary.likesCount || 0 })}</p>
                      <p className="text-xs text-rose-700">{t('detail.peopleLoved')}</p>
                    </div>
                  </div>
                  <LikeButton
                    diaryId={diary._id}
                    initialLikesCount={diary.likesCount || 0}
                    initialIsLiked={diary.isLiked || false}
                    onLike={handleLike}
                    variant="compact"
                  />
                </div>
              )}

              {/* Comments */}
              {diary.allowComments && (
                <CommentsSection
                  diaryId={id!}
                  diaryOwnerId={diaryUser ? (diaryUser._id as string) : (diary.userId as string)}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
