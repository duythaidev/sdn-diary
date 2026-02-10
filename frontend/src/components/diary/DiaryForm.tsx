import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Editor } from '../editor/Editor'
import { Calendar, Clock, Eye } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DiaryTitleInput } from './DiaryTitleInput'
import { DiaryAttachments } from './DiaryAttachments'
import { DiaryTags } from './DiaryTags'
import { DiaryPreviewModal } from './DiaryPreviewModal'
import { getAxiosErrorMessage } from '@/lib/error'

interface DiaryFormData {
  title: string
  content: string
  isPublic: boolean
  allowComments: boolean
  selectedMood: string
  tags: string[]
  coverPhoto: string | null
  isDraft: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

interface DiaryFormProps {
  mode: 'create' | 'edit'
  initialData?: DiaryFormData
  onSubmit: (data: DiaryFormData) => Promise<void>
  loading?: boolean
}

export const DiaryForm = ({ mode, initialData, onSubmit, loading = false }: DiaryFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DiaryFormData>({
    defaultValues: initialData || {
      title: '',
      content: '',
      isPublic: false,
      allowComments: true,
      selectedMood: 'happy',
      tags: ['reflection', 'gratitude'],
      coverPhoto: null,
      isDraft: false,
    },
  })

  const isPublic = useWatch({ control: control, name: 'isPublic' })
  const content = useWatch({ control: control, name: 'content' })
  const title = useWatch({ control: control, name: 'title' })
  const allowComments = useWatch({ control: control, name: 'allowComments' })
  const selectedMood = useWatch({ control: control, name: 'selectedMood' })
  const tags = useWatch({ control: control, name: 'tags' })
  const coverPhoto = useWatch({ control: control, name: 'coverPhoto' })

  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
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

  const selectedMoodData = moods.find((mood) => mood.value === selectedMood)

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
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setValue('coverPhoto', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove cover photo
  const removeCoverPhoto = () => {
    setValue('coverPhoto', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Add new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setValue('tags', [...tags, newTag.trim().toLowerCase()])
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
    )
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

  // Handle preview
  const handlePreview = () => {
    if (!title || !content) {
      toast.error('Please add a title and content before previewing')
      return
    }
    setIsPreviewOpen(true)
  }

  const handleSubmitDiary = async (data: DiaryFormData, isDraft: boolean) => {
    await onSubmit({ ...data, isDraft })
  }

  const submitButtonText = mode === 'create' ? 'Publish' : 'Update'
  const loadingButtonText = mode === 'create' ? 'Publishing...' : 'Updating...'

  return (
    <>
      <div className="bg-background flex min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <form className="">
            {/* Title Input - Large */}
            <DiaryTitleInput
              register={register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title cannot exceed 200 characters',
                },
              })}
              errors={errors.title}
            />

            {/* Editor */}
            <div className="space-y-2">
              <Editor onChange={(content) => setValue('content', content)} content={content} />
              {errors.content && <p className="text-destructive mt-2 text-sm">{errors.content.message}</p>}
            </div>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="border-border bg-card flex w-80 flex-col border-l p-6">
          {/* Action Buttons */}
          <div className="mb-8 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 flex-1"
                type="button"
                onClick={handleSubmit((data) => handleSubmitDiary(data, true))} 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>

              <Button
                type="button"
                onClick={handleSubmit((data) => handleSubmitDiary(data, false))}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                disabled={loading}
              >
                {loading ? loadingButtonText : submitButtonText}
              </Button>
            </div>
            <Button
              variant="outline"
              className="border-border hover:bg-muted w-full"
              type="button"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Preview
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
                    onClick={() => setValue('selectedMood', mood.value)}
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
                <Switch checked={allowComments} onCheckedChange={(checked) => setValue('allowComments', checked)} />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <DiaryAttachments
            coverPhoto={coverPhoto}
            fileInputRef={fileInputRef}
            onChange={handleCoverPhotoChange}
            onRemove={removeCoverPhoto}
            className="mb-4"
          />

          {/* Tags Section */}
          <DiaryTags
            tags={tags}
            newTag={newTag}
            isAdding={isAddingTag}
            onNewTagChange={setNewTag}
            onAddTag={handleAddTag}
            onRemoveTag={removeTag}
            onStartAdd={() => setIsAddingTag(true)}
            onCancelAdd={() => {
              setIsAddingTag(false)
              setNewTag('')
            }}
            onKeyPress={handleTagKeyPress}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <DiaryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title || 'Untitled'}
        content={content || ''}
        coverPhoto={coverPhoto}
        mood={selectedMoodData}
        tags={tags}
        isPublic={isPublic}
        allowComments={allowComments}
      />
    </>
  )
}
