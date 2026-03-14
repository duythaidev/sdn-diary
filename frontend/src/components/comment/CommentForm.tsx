import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useProfile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U'
    return (
      user.username
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'U'
    )
  }

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-orange-300 to-pink-300">
          <span className="text-lg font-semibold text-gray-800">{getUserInitials()}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            disabled={submitting}
            maxLength={500}
            rows={3}
            className="resize-none rounded-lg border bg-gray-50 pr-4 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={!content.trim() || submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </Button>
        </div>
      </form>
    </div>
  )
}
