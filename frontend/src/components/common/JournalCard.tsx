import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Calendar, Heart, MessageCircle, Pin, Paperclip, MoreHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface Journal {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  date: string
  tags: string[]
  likes: number
  comments: number
}

interface JournalCardProps {
  journal: Journal
  rotation?: number
  color?: string
  texture?: 'plain' | 'lined' | 'dotted'
  decoration?: 'tape' | 'pin' | 'clip' | 'none'
  delay?: number
}

export function JournalCard({
  journal,
  rotation = 0,
  color = 'bg-[#fdfbf7]', // Default off-white paper
  texture = 'plain',
  decoration = 'none',
  delay = 0,
}: JournalCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Texture styles
  const textureStyles = {
    plain: {},
    lined: {
      backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '100% 24px',
    },
    dotted: {
      backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        zIndex: 10,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="group relative mx-2 mb-8 w-full"
    >
      {/* Decorations */}
      {decoration === 'tape' && (
        <div className="absolute -top-3 left-1/2 z-20 h-8 w-32 -translate-x-1/2 rotate-1 border-r border-l border-white/60 bg-white/40 shadow-sm backdrop-blur-sm" />
      )}
      {decoration === 'pin' && (
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 drop-shadow-md">
          <Pin className="size-6 rotate-12 fill-red-500 text-red-600" />
        </div>
      )}
      {decoration === 'clip' && (
        <div className="absolute -top-4 right-4 z-20 drop-shadow-md">
          <Paperclip className="size-8 -rotate-45 text-zinc-600" />
        </div>
      )}

      <Card className={cn('relative overflow-hidden border-0 shadow-lg', color)}>
        {/* Paper texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-50" style={textureStyles[texture]} />

        {/* Top "torn" edge effect for some variety - using CSS masking would be complex, so staying simple with border radius */}

        <CardContent className="relative z-10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/50 shadow-sm">
                <AvatarImage src={journal.author.avatar} alt={journal.author.name} />
                <AvatarFallback className="bg-primary/5 font-serif">{getInitials(journal.author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground/80 font-serif text-sm font-bold tracking-wide">{journal.author.name}</p>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Calendar className="size-3" />
                  <time>{journal.date}</time>
                </div>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          <h3 className="text-foreground/90 mb-3 font-serif text-xl leading-tight font-bold">{journal.title}</h3>

          <p className="text-muted-foreground mb-6 line-clamp-4 font-serif text-sm leading-relaxed">
            {journal.content}
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {journal.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-foreground/70 border-0 bg-black/5 px-2 py-0.5 font-mono text-xs font-normal hover:bg-black/10"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-4">
            <div className="flex gap-4">
              <button className="text-muted-foreground group/like flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-red-500">
                <Heart className="size-4 transition-all group-hover/like:fill-red-500" />
                <span>{journal.likes}</span>
              </button>
              <button className="text-muted-foreground group/comment flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-blue-500">
                <MessageCircle className="size-4 transition-all group-hover/comment:fill-blue-100" />
                <span>{journal.comments}</span>
              </button>
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              {Math.ceil(journal.content.length / 200)} min read
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
