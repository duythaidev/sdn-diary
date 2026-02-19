import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Editor } from '../editor/Editor'
import { Save, Send, ChevronLeft, Lock, Globe, Tag, Hash, Smile, Image as ImageIcon, X, Eye } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DiaryPreviewModal } from './DiaryPreviewModal'
import { MOODS } from '@/constants'
import { Input } from '@/components/ui/input'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

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
      tags: [],
      coverPhoto: null,
      isDraft: false,
    },
  })

  const isPublic = useWatch({ control, name: 'isPublic' })
  const content = useWatch({ control, name: 'content' })
  const title = useWatch({ control, name: 'title' })
  const selectedMood = useWatch({ control, name: 'selectedMood' })
  const tags = useWatch({ control, name: 'tags' })
  const coverPhoto = useWatch({ control, name: 'coverPhoto' })

  const [currentTag, setCurrentTag] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedMoodData = MOODS.find((m) => m.value === selectedMood)

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size should be less than 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setValue('coverPhoto', reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeCoverPhoto = () => {
    setValue('coverPhoto', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      const trimmed = currentTag.trim().toLowerCase()
      if (!tags.includes(trimmed)) setValue('tags', [...tags, trimmed])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) =>
    setValue(
      'tags',
      tags.filter((t) => t !== tag),
    )

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

  const submitLabel = mode === 'create' ? 'Publish Entry' : 'Update Entry'
  const loadingLabel = mode === 'create' ? 'Publishing...' : 'Updating...'

  return (
    <>
      <div className="mx-auto max-w-6xl pb-20">
        {/* Top Navigation / Action Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link to={mode === 'edit' ? '/diary' : '/dashboard'}>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="mr-2 size-4" />
              {mode === 'edit' ? 'Back to Diary' : 'Back to Dashboard'}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground mr-2 hidden text-sm sm:inline-block">
              {loading ? 'Saving...' : 'Draft saved just now'}
            </span>
            <Button
              variant="outline"
              className="border-black/10 bg-white hover:bg-black/5"
              onClick={handleSubmit((data) => handleSubmitDiary(data, true))}
              disabled={loading}
            >
              <Save className="mr-2 size-4" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              className="border-black/10 bg-white hover:bg-black/5"
              onClick={handlePreview}
              disabled={loading}
            >
              <Eye className="mr-1 size-4" />
              View Draft
            </Button>
            <Button
              className="shadow-lg transition-all hover:shadow-xl"
              onClick={handleSubmit((data) => handleSubmitDiary(data, false))}
              disabled={loading}
            >
              <Send className="mr-2 size-4" />
              {loading ? loadingLabel : submitLabel}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Writing Area — The "Paper" */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="relative flex min-h-[800px] flex-col overflow-hidden rounded-sm border border-black/5 bg-white shadow-xl">
              {/* Top paper edge */}
              <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-50" />

              {/* Content Area */}
              <div className="relative flex-1 p-8 md:p-12">
                {/* Date Stamp */}
                <div className="pointer-events-none absolute top-6 right-8 rotate-3 rounded border-2 border-red-200 px-2 py-1 font-mono text-xs tracking-widest text-red-300 uppercase opacity-70 select-none">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Untitled Entry"
                  className="text-foreground/90 placeholder:text-muted-foreground/40 mb-6 block w-full border-none bg-transparent font-serif text-4xl font-bold outline-none"
                  {...register('title', {
                    required: 'Title is required',
                    maxLength: { value: 200, message: 'Title cannot exceed 200 characters' },
                  })}
                />
                {errors.title && <p className="text-destructive mb-2 text-sm">{errors.title.message}</p>}

                {/* Editor / Textarea */}
                <div
                  className={cn(
                    'min-h-[500px]',
                    // paperType === 'lined' && 'bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[100%_32px]',
                    // paperType === 'dotted' && 'bg-[radial-gradient(#d1d5db_1px,transparent_1px)] bg-[size:20px_20px]',
                  )}
                >
                  <Editor onChange={(val) => setValue('content', val)} content={content} />
                </div>
                {errors.content && <p className="text-destructive mt-2 text-sm">{errors.content.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Sidebar — "Desk Accessories" */}
          <div className="space-y-6">
            {/* Cover Image Card */}
            <div className="rounded-xl border border-black/5 bg-white p-1 shadow-sm">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoChange}
              />
              {coverPhoto ? (
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img src={coverPhoto} alt="Cover" className="h-full w-full object-cover" />
                  <button
                    onClick={removeCoverPhoto}
                    className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 shadow-sm hover:bg-white"
                  >
                    <X className="text-foreground/70 size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground border-muted bg-muted/30 hover:bg-muted/50 flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
                >
                  <ImageIcon className="size-8 opacity-50" />
                  <span className="text-sm font-medium">Add Cover Image</span>
                </button>
              )}
            </div>

            {/* Metadata Card */}
            <div className="relative overflow-hidden rounded-xl border border-black/5 bg-[#fdfbf7] p-6 shadow-sm">
              {/* Washi tape decoration */}
              <div className="absolute top-0 left-1/2 h-4 w-32 -translate-x-1/2 -rotate-1 bg-rose-200/50 opacity-80" />

              <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold">
                <Tag className="size-4" />
                Details
              </h3>

              {/* Visibility Toggle */}
              <div className="mb-6">
                <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('isPublic', false)
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-all',
                      !isPublic
                        ? 'text-foreground border-black/10 bg-white font-medium shadow-sm'
                        : 'text-muted-foreground border-transparent hover:bg-black/5',
                    )}
                  >
                    <Lock className="size-3.5" />
                    Private
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('isPublic', true)
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-all',
                      isPublic
                        ? 'text-foreground border-black/10 bg-white font-medium shadow-sm'
                        : 'text-muted-foreground border-transparent hover:bg-black/5',
                    )}
                  >
                    <Globe className="size-3.5" />
                    Public
                  </button>
                </div>
                
              </div>

              {/* Mood Selector */}
              <div className="mb-6">
                <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
                  Mood
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setValue('selectedMood', mood.value)}
                      title={mood.label}
                      className={cn(
                        'relative flex aspect-square items-center justify-center rounded-lg text-2xl transition-all hover:bg-black/5',
                        selectedMood === mood.value
                          ? 'scale-110 bg-black/5 ring-1 ring-black/10'
                          : 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0',
                      )}
                    >
                      {mood.icon}
                    </button>
                  ))}
                </div>
                {selectedMoodData && (
                  <p
                    className="mt-2 text-center font-mono text-xs font-medium"
                    style={{ color: selectedMoodData.color }}
                  >
                    {selectedMoodData.label}
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
                  Tags
                </label>

                <div className="relative">
                  <Hash className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Add a tag..."
                    className="h-9 border-black/10 bg-white pl-8 text-sm focus:border-black/20"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
                <p className="text-muted-foreground mt-1.5 ml-1 text-[10px]">Press Enter to add tags</p>
                <div className="mb-2 flex min-h-[28px] flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-foreground h-7 cursor-default border border-black/5 bg-white py-1 pr-1 pl-2 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                      <span className="mr-1">#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="cursor-pointer rounded-full p-0.5 hover:bg-red-100"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Writer's Block Prompt Card */}
            <div className="relative rounded-xl border border-blue-100 bg-[#f0f9ff] p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
                  <Smile className="size-4" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold text-blue-900">Writer's Block?</h4>
                  <p className="text-xs leading-relaxed text-blue-800/70">
                    Try describing the most interesting person you saw today. What were they wearing? What were they
                    doing?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DiaryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title || 'Untitled'}
        content={content || ''}
        coverPhoto={coverPhoto}
        mood={selectedMoodData}
        tags={tags}
        isPublic={isPublic}
        allowComments={useWatch({ control, name: 'allowComments' })}
      />
    </>
  )
}
