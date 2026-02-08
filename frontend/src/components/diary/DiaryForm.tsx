import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Editor } from '../editor/Editor'
import { Calendar, Clock, Image, Tag, X, Plus } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import ImageViewer_Basic from '../commerce-ui/image-viewer-basic'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DiaryFormData {
  title: string
  content: string
  isPublic: boolean
}

interface DiaryFormProps {
  initialData?: DiaryFormData
  onSubmit: (data: DiaryFormData) => Promise<void>
  submitLabel?: string
  loading?: boolean
}

export const DiaryForm = ({ initialData, onSubmit, submitLabel = 'Submit', loading = false }: DiaryFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DiaryFormData>({
    defaultValues: initialData || {
      title: '',
      content: '',
      isPublic: false,
    },
  })

  const isPublic = watch('isPublic')
  const [allowComments, setAllowComments] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string>('happy')
  const [tags, setTags] = useState<string[]>(['reflection', 'gratitude'])
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const moods = [
    { icon: '😫', label: 'Stressed', value: 'stressed', color: 'orange' },
    { icon: '😐', label: 'Okay', value: 'okay', color: '#6e6e4e' },
    { icon: '😌', label: 'Calm', value: 'calm', color: '#1d3a50' },
    { icon: '😊', label: 'Happy', value: 'happy', color: '#1abc9c' },
    { icon: '🤩', label: 'Great', value: 'great', color: '#8e44ad' },
  ]

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // Handle cover photo upload
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  // Remove cover photo
  const removeCoverPhoto = () => {
    setCoverPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Add new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle key press in tag input
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Escape') {
      setIsAddingTag(false)
      setNewTag('')
    }
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/* Title Input - Large */}
          <div className="group mb-8">
            <Input
              id="title"
              placeholder="Title your reflection..."
              className="text-foreground placeholder:text-muted-foreground mb-2 h-16 border-none bg-transparent p-0 text-5xl! font-extrabold focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title cannot exceed 200 characters',
                },
              })}
            />
            {errors.title ? (
              <p className="text-destructive mt-2 text-sm">{errors.title.message}</p>
            ) : (
              <p className="text-primary text-sm opacity-0 transition-opacity group-focus-within:opacity-100">Title</p>
            )}
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Editor onChange={(content) => setValue('content', content)} content={watch('content')} />
            {errors.content && <p className="text-destructive mt-2 text-sm">{errors.content.message}</p>}
          </div>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="border-border bg-card flex w-80 flex-col border-l p-6">
        {/* Action Buttons */}
        <div className="mb-8 flex gap-2">
          <Button
            variant="outline"
            className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 flex-1"
            type="button"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>

        {/* Details Section */}
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">Details</h3>
          <div className="space-y-3">
            <div className="text-foreground/80 flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
            <div className="text-foreground/80 flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Mood Section */}
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            How are you feeling?
          </h3>

          <div className="flex items-center justify-between gap-3">
            {moods.map((mood) => {
              const isActive = selectedMood === mood.value

              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      `bg-muted flex h-10 w-10 items-center justify-center rounded-full text-3xl transition-all hover:scale-105`,
                      {
                        'scale-105': isActive,
                        'opacity-70': !isActive,
                      },
                    )}
                    style={{
                      color: mood.color,
                      boxShadow: isActive ? `0 0 0 2px ${mood.color}80` : 'none',
                    }}
                  >
                    {mood.icon}
                  </div>

                  {isActive && (
                    <span className="text-xs font-medium tracking-wide" style={{ color: mood.color }}>
                      {mood.label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Visibility Section */}
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">Visibility</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Make Public</p>
                <p className="text-muted-foreground text-xs">Visible on your profile</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={(checked) => setValue('isPublic', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Allow Comments</p>
                <p className="text-muted-foreground text-xs">Others can reply</p>
              </div>
              <Switch checked={allowComments} onCheckedChange={setAllowComments} />
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">Attachments</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            className="hidden"
            id="cover-photo-input"
          />

          {coverPhoto ? (
            <div className="group relative overflow-hidden rounded-lg">
              {/* <img src={coverPhoto} alt="Cover" className="h-40 w-full rounded-lg object-contain" /> */}
              <ImageViewer_Basic thumbnailUrl={coverPhoto} imageUrl={coverPhoto} className="max-w-[300px]" />
              {/* <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center transition-all"> */}
              <div className="absolute top-2 right-2">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={removeCoverPhoto}
                        className="rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>

                    <TooltipContent side="left" sideOffset={10}>
                      <p>Remove cover photo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* </div> */}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-border hover:border-primary/50 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors"
            >
              <Image className="text-muted-foreground h-8 w-8" />
              <span className="text-muted-foreground text-sm">Add cover photo (5MB max)</span>
            </button>
          )}
        </div>

        {/* Tags Section */}
        <div>
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">Tags</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-primary group hover:bg-secondary/80 flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {isAddingTag ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyPress}
                placeholder="Enter tag..."
                className="bg-secondary border-border text-foreground focus-visible:ring-primary h-8 flex-1 text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded p-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingTag(false)
                  setNewTag('')
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            >
              <Tag className="h-3 w-3" />
              Add tag
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
