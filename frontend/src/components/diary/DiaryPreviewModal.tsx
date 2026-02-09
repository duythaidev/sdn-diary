import { X } from 'lucide-react'
import { DiaryView } from './DiaryView'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'

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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-background relative z-10 h-full w-full overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="hover:bg-muted fixed top-4 right-4 z-20 rounded-full p-2 transition-colors"
          aria-label="Close preview"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Preview Content */}
        <div className="px-4 py-16">
          <DiaryView
            title={title}
            content={content}
            coverPhoto={coverPhoto}
            mood={mood}
            tags={tags}
            isPublic={isPublic}
            allowComments={allowComments}
            showActions={false}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
