import { X, ArrowLeft, Bookmark, Share2, MoreHorizontal, Calendar, MessageCircle, Heart } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { format } from 'date-fns'

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
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayDate = format(new Date(), 'MMMM dd, yyyy')

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8f5f2]">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#f8f5f2]/80 px-6 py-3 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-muted-foreground pl-0 hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Editor
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground mr-2 font-mono text-xs uppercase tracking-wider">Preview</span>
          {/* <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <Bookmark className="size-5 text-muted-foreground" />
          </Button> */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <Share2 className="size-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5" onClick={onClose}>
            <X className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main Content — The "Paper" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative lg:col-span-8"
          >
            {/* Decorative Tape */}
            <div className="absolute -top-3 left-1/2 z-20 h-10 w-48 -translate-x-1/2 -rotate-1 border-l border-r border-white/40 bg-[#fbf8f3]/60 shadow-sm backdrop-blur-sm" />

            <div className="relative overflow-hidden rounded-sm border border-black/5 bg-[#fdfbf7] p-8 shadow-xl md:p-12">
              {/* Lined paper texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 32px' }}
              />

              {/* Cover photo */}
              {coverPhoto && (
                <div className="relative z-10 -mx-8 -mt-8 mb-8 md:-mx-12 md:-mt-12">
                  <img src={coverPhoto} alt={title} className="h-64 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fdfbf7]" />
                </div>
              )}

              {/* Header */}
              <div className="relative z-10 pb-6">
                <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {displayDate}
                  </div>
                  {mood && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5" style={{ color: mood.color }}>
                        <span>{mood.icon}</span>
                        Feeling {mood.label}
                      </div>
                    </>
                  )}
                  {isPublic !== undefined && (
                    <>
                      <span>•</span>
                      <span>{isPublic ? 'Public' : 'Private'}</span>
                    </>
                  )}
                </div>

                <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-foreground/90 md:text-5xl">
                  {title || 'Untitled Entry'}
                </h1>

                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="border-0 bg-black/5 font-normal text-muted-foreground hover:bg-black/10"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="relative z-10">
                {/* {content.length > 0 ? (
                  <div className="prose prose-lg prose-stone max-w-none font-serif leading-loose text-foreground/80">
                    {content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="mb-6 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-bold"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : ( */}
                  <div
                    className="prose prose-lg prose-stone max-w-none font-serif leading-loose text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                {/* )} */}
              </div>

              {/* Footer: mood + placeholder signature */}
              <div className="relative z-10 mt-12 flex items-center justify-between border-t border-black/10 pt-8">
                {mood && (
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold italic text-muted-foreground">Mood:</span>
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
                <div className="-rotate-2 font-serif text-2xl italic text-muted-foreground opacity-80">
                  Preview
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* "Author" placeholder card */}
            <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <div className="from-primary/10 absolute top-0 left-0 h-20 w-full bg-gradient-to-b to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-muted shadow-md">
                  <span className="font-serif text-2xl text-muted-foreground opacity-40">?</span>
                </div>
                <h3 className="font-serif text-lg font-bold">Your Name</h3>
                <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Author</p>
                <p className="text-muted-foreground px-4 text-sm leading-relaxed italic">
                  This is a preview of how your entry will appear to readers.
                </p>
              </div>
            </div>

            {/* Engagement preview card */}
            <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-serif mb-4 flex items-center gap-2 font-bold">
                <MessageCircle className="size-4" />
                Discussion
              </h3>

              {/* Like block (static preview) */}
              <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2 shadow-sm">
                    <Heart className="size-5 text-rose-300" />
                  </div>
                  <div>
                    <p className="font-bold text-rose-900">0 Likes</p>
                    <p className="text-xs text-rose-700">Be the first to like this</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-rose-400" disabled>
                  Like
                </Button>
              </div>

              {/* Comments preview */}
              {allowComments ? (
                <div className="text-muted-foreground py-6 text-center">
                  <MessageCircle className="mx-auto mb-2 size-8 opacity-30" />
                  <p className="font-serif text-sm italic">Comments will appear here after publishing.</p>
                </div>
              ) : (
                <div className="text-muted-foreground py-6 text-center">
                  <p className="font-serif text-sm italic">Comments are disabled for this entry.</p>
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