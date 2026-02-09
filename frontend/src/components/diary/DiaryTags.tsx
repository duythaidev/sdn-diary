import { Input } from '@/components/ui/input'
import { X, Tag, Plus } from 'lucide-react'

interface DiaryTagsProps {
  tags: string[]
  newTag: string
  isAdding: boolean
  onNewTagChange: (v: string) => void
  onAddTag: () => void
  onRemoveTag: (t: string) => void
  onStartAdd: () => void
  onCancelAdd: () => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const DiaryTags = ({
  tags,
  newTag,
  isAdding,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onStartAdd,
  onCancelAdd,
  onKeyPress,
}: DiaryTagsProps) => {
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-secondary text-primary group hover:bg-secondary/80 flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="hover:text-destructive ml-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Enter tag..."
            autoFocus
            className="bg-secondary h-8 flex-1 text-sm"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded p-1"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={onCancelAdd} className="text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
          onClick={onStartAdd}
        >
          <Tag className="h-3 w-3" />
          Add tag
        </button>
      )}
    </div>
  )
}
