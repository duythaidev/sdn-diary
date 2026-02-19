import { MessageCircle, Share2, Bookmark, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import ImageViewer_Basic from '../commerce-ui/image-viewer-basic'

interface DiaryViewProps {
  title: string
  content: string
  coverPhoto?: string | null
  mood?: {
    icon: string
    label: string
    color: string
  }
  tags?: string[]
  author?: {
    name: string
    avatar?: string
  }
  date?: string
  isPublic?: boolean
  allowComments?: boolean
  showActions?: boolean
  className?: string
}

export const DiaryView = ({
  title,
  content,
  coverPhoto,
  mood,
  tags = [],
  author = { name: 'Sarah Jenkins' },
  date,
  isPublic = false,
  allowComments = true,
  showActions = true,
  className,
}: DiaryViewProps) => {
  const displayDate =
    date ||
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className={cn('mx-auto max-w-3xl', className)}>
      <div className="bg-background overflow-hidden rounded-lg shadow-lgpy-6">
        {!isPublic && (
          <div className="mb-4 flex justify-center">
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
              <Lock className="h-3 w-3" />
              Private – Only You Can See This
            </span>
          </div>
        )}

        {/* Header Section */}

        <div className="mb-6 border-b pb-6">
          <h1 className="text-foreground mb-6 text-4xl font-bold">{title}</h1>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-sm font-medium">
                  {author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">{author.name}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{displayDate}</span>
                  {mood && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>{mood.icon}</span>
                        <span style={{ color: mood.color }}>Feeling {mood.label}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {showActions && (
              <div className="flex items-center gap-2">
                {/* <button className="hover:bg-muted rounded-full p-2 transition-colors">
                  <Bookmark className="text-foreground/60 h-5 w-5" />
                </button> */}
                <button className="hover:bg-muted rounded-full p-2 transition-colors">
                  <Share2 className="text-foreground/60 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Photo */}
        {coverPhoto && (
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
            <ImageViewer_Basic thumbnailUrl={coverPhoto} imageUrl={coverPhoto} />
          </div>
        )}

        {/* Content Section */}
        <div className="bg-background">
          <div
            className="text-foreground/90 prose prose-lg max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {showActions && allowComments && (
          <div className="border-border bg-muted/30 flex items-center gap-6 border-t px-8 py-4">
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>0 Comments</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
