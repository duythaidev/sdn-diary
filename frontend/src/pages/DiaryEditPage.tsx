import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  Send,
  Image as ImageIcon,
  Tag,
  Hash,
  Smile,
  AlignLeft,
  Bold,
  Italic,
  List,
  Type,
  X,
  ChevronLeft,
  Lock,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { diaryService } from '@/services/api/diaryService'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import type { DiaryFormData } from '@/types'

export function DiaryEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [mood, setMood] = useState<string>('neutral')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [paperType, setPaperType] = useState<'plain' | 'lined' | 'dotted'>('lined')

  useEffect(() => {
    const fetchDiary = async () => {
      if (!id) return
      try {
        const response = await diaryService.getDiaryById(id)
        const d = response.diary
        setTitle(d.title)
        setContent(d.content)
        setTags(d.tags || [])
        setMood(d.selectedMood || 'neutral')
        setVisibility(d.isPublic ? 'public' : 'private')
      } catch (error) {
        toast.error(getAxiosErrorMessage(error, 'Failed to load diary'))
        navigate('/diary')
      } finally {
        setFetchLoading(false)
      }
    }
    fetchDiary()
  }, [id, navigate])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      const newTag = currentTag.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const moods = [
    { id: 'happy', icon: '😊', label: 'Happy' },
    { id: 'calm', icon: '😌', label: 'Calm' },
    { id: 'sad', icon: '😔', label: 'Sad' },
    { id: 'excited', icon: '🤩', label: 'Excited' },
    { id: 'tired', icon: '😴', label: 'Tired' },
    { id: 'grateful', icon: '🥰', label: 'Grateful' },
  ]

  const handleSubmit = async (isDraft: boolean) => {
    if (!id) return
    if (!title.trim() && !content.trim()) {
      toast.error('Please enter a title or content')
      return
    }

    setLoading(true)
    try {
      const diaryData: DiaryFormData = {
        title,
        content,
        isPublic: visibility === 'public',
        allowComments: true,
        selectedMood: mood,
        isDraft,
        tags,
        coverPhoto: null,
        likesCount: 0,
        isLiked: false,
      }

      await diaryService.updateDiary(id, diaryData)

      if (isDraft) {
        toast.success('Draft updated successfully!')
        navigate('/diary')
      } else {
        toast.success('Diary entry updated successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to update diary'))
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in mx-auto max-w-6xl pb-20 duration-500">
      {/* Top Navigation / Action Bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link to="/diary">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-2 size-4" />
            Back to My Journal
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-black/10 bg-white hover:bg-black/5"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            <Save className="mr-2 size-4" />
            Save Draft
          </Button>
          <Button
            className="shadow-lg transition-all hover:shadow-xl"
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            <Send className="mr-2 size-4" />
            Update Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Writing Area - The "Paper" */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="relative flex min-h-[800px] flex-col overflow-hidden rounded-sm border border-black/5 bg-white shadow-xl">
            {/* Paper decoration */}
            <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-50" />

            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-black/5 bg-[#fbfbfb] p-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <Bold className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <Italic className="size-4" />
              </Button>
              <div className="mx-1 h-4 w-px bg-black/10" />
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <AlignLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <List className="size-4" />
              </Button>
              <div className="mx-1 h-4 w-px bg-black/10" />
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <Type className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <ImageIcon className="size-4" />
              </Button>

              <div className="flex-1" />

              {/* Paper Type Toggles */}
              <div className="flex rounded-lg bg-black/5 p-0.5">
                <button
                  onClick={() => setPaperType('plain')}
                  className={cn(
                    'rounded-md px-2 py-1 text-[10px] transition-all',
                    paperType === 'plain'
                      ? 'bg-white font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Plain
                </button>
                <button
                  onClick={() => setPaperType('lined')}
                  className={cn(
                    'rounded-md px-2 py-1 text-[10px] transition-all',
                    paperType === 'lined'
                      ? 'bg-white font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Lined
                </button>
                <button
                  onClick={() => setPaperType('dotted')}
                  className={cn(
                    'rounded-md px-2 py-1 text-[10px] transition-all',
                    paperType === 'dotted'
                      ? 'bg-white font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Dotted
                </button>
              </div>
            </div>

            {/* Content Input Area */}
            <div className="group relative flex-1 p-8 md:p-12">
              {/* Date Stamp */}
              <div className="pointer-events-none absolute top-6 right-8 rotate-3 rounded border-2 border-red-200 px-2 py-1 font-mono text-xs tracking-widest text-red-300 uppercase opacity-70 select-none">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              <input
                type="text"
                placeholder="Untitled Entry"
                className="placeholder:text-muted-foreground/40 text-foreground/90 mb-6 block w-full border-none bg-transparent font-serif text-4xl font-bold outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Start writing your thoughts here..."
                className={cn(
                  'text-foreground/80 block h-[600px] w-full resize-none border-none bg-transparent p-0 text-lg leading-8 outline-none focus:ring-0',
                  paperType === 'lined' &&
                    'bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:100%_32px] font-serif leading-[32px]',
                  paperType === 'plain' && 'font-sans',
                  paperType === 'dotted' &&
                    'bg-[radial-gradient(#d1d5db_1px,transparent_1px)] bg-[size:20px_20px] font-mono',
                )}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Sidebar Tools - "Desk Accessories" */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="relative overflow-hidden rounded-xl border border-black/5 bg-[#fdfbf7] p-6 shadow-sm">
            {/* "Washi Tape" Decoration */}
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
                  onClick={() => setVisibility('private')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-all',
                    visibility === 'private'
                      ? 'text-foreground border-black/10 bg-white font-medium shadow-sm'
                      : 'text-muted-foreground border-transparent hover:bg-black/5',
                  )}
                >
                  <Lock className="size-3.5" />
                  Private
                </button>
                <button
                  onClick={() => setVisibility('public')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-all',
                    visibility === 'public'
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
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={cn(
                      'group relative flex aspect-square items-center justify-center rounded-lg text-2xl transition-all hover:bg-black/5',
                      mood === m.id
                        ? 'scale-110 bg-black/5 ring-1 ring-black/10'
                        : 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0',
                    )}
                    title={m.label}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Input */}
            <div className="mb-2">
              <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
                Tags
              </label>
              <div className="mb-2 flex min-h-[28px] flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-foreground group h-7 cursor-default border border-black/5 bg-white py-1 pr-1 pl-2 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                  >
                    <span className="mr-1">#{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="cursor-pointer rounded-full p-0.5 hover:bg-red-100"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
