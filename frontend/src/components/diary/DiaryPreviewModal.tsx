import { X, ArrowLeft, Share2, MoreHorizontal, Calendar, MessageCircle, Heart } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { vi, enUS } from 'date-fns/locale'

interface DiaryPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  coverPhoto?: string | null
  mood?: {
    icon: string
    label: string
    color: string
  }
  tags?: string[]
  isPublic?: boolean
  allowComments?: boolean
}

export const DiaryPreviewModal = ({
  isOpen,
  onClose,
  title,
  content,
  coverPhoto,
  mood,
  tags,
  isPublic,
  allowComments,
}: DiaryPreviewModalProps) => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayDate = format(new Date(), 'MMMM dd, yyyy', {
    locale: i18n.language === 'vi' ? vi : enUS,
  })

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8f5f2]">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#f8f5f2]/80 px-6 py-3 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 size-4" />
          {t('preview.backToEditor')}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground mr-2 font-mono text-xs tracking-wider uppercase">
            {t('preview.preview')}
          </span>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <Share2 className="text-muted-foreground size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <MoreHorizontal className="text-muted-foreground size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5" onClick={onClose}>
            <X className="text-muted-foreground size-5" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-6 pb-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main Content — The "Paper" */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative lg:col-span-8">
            {/* Decorative Tape */}
            <div className="absolute -top-3 left-1/2 z-20 h-10 w-48 -translate-x-1/2 -rotate-1 border-r border-l border-white/40 bg-[#fbf8f3]/60 shadow-sm backdrop-blur-sm" />

            <div className="relative overflow-hidden rounded-sm border border-black/5 bg-[#fdfbf7] p-8 shadow-xl md:p-12">
              {/* Lined paper texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                  backgroundSize: '100% 32px',
                }}
              />

              {/* Cover photo */}
              {coverPhoto && (
                <div className="relative z-10 -mx-8 -mt-8 mb-8 md:-mx-12 md:-mt-12">
                  <img src={coverPhoto} alt={title} className="h-64 w-full object-cover" />
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
                  {mood && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5" style={{ color: mood.color }}>
                        <span>{mood.icon}</span>
                        {t('common.feeling')} {mood.label}
                      </div>
                    </>
                  )}
                  {isPublic !== undefined && (
                    <>
                      <span>•</span>
                      <span>{isPublic ? t('common.public') : t('common.private')}</span>
                    </>
                  )}
                </div>

                <h1 className="text-foreground/90 mb-4 font-serif text-3xl leading-tight font-bold md:text-5xl">
                  {title || t('common.untitled')}
                </h1>

                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
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
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>

              {/* Footer: mood + placeholder signature */}
              <div className="relative z-10 mt-12 flex items-center justify-between border-t border-black/10 pt-8">
                {mood && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-serif text-sm font-bold italic">
                      {t('common.mood')}:
                    </span>
                    <span
                      className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: `${mood.color}15`,
                        borderColor: `${mood.color}30`,
                        color: mood.color,
                      }}
                    >
                      {mood.icon} {mood.label}
                    </span>
                  </div>
                )}
                <div className="text-muted-foreground -rotate-2 font-serif text-2xl italic opacity-80">
                  {t('preview.preview')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* "Author" placeholder card */}
            <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <div className="from-primary/10 absolute top-0 left-0 h-20 w-full bg-linear-to-b to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-md">
                  <span className="text-muted-foreground font-serif text-2xl opacity-40">?</span>
                </div>
                <h3 className="font-serif text-lg font-bold">{t('preview.authorName')}</h3>
                <p className="border-muted-foreground/20 text-muted-foreground mb-3 flex items-center gap-1.5 border-b pb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('common.author')}
                </p>
                <p className="text-muted-foreground px-4 text-sm leading-relaxed italic">{t('preview.authorDesc')}</p>
              </div>
            </div>

            {/* Engagement preview card */}
            <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-serif font-bold">
                <MessageCircle className="size-4" />
                {t('common.discussion')}
              </h3>

              {/* Like block (static preview) */}
              <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2 shadow-sm">
                    <Heart className="size-5 text-rose-300" />
                  </div>
                  <div>
                    <p className="font-bold text-rose-900">{t('common.likes', { count: 0 })}</p>
                    <p className="text-xs text-rose-700">{t('preview.beFirstToLike')}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-rose-400" disabled>
                  {t('preview.like')}
                </Button>
              </div>

              {/* Comments preview */}
              {allowComments ? (
                <div className="text-muted-foreground py-6 text-center">
                  <MessageCircle className="mx-auto mb-2 size-8 opacity-30" />
                  <p className="font-serif text-sm italic">{t('preview.commentsPlaceholder')}</p>
                </div>
              ) : (
                <div className="text-muted-foreground py-6 text-center">
                  <p className="font-serif text-sm italic">{t('preview.commentsDisabled')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
