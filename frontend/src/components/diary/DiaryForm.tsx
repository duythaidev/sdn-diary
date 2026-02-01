import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter diary title..."
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 200,
              message: 'Title cannot exceed 200 characters',
            },
          })}
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your thoughts..."
          rows={12}
          {...register('content', {
            required: 'Content is required',
          })}
        />
        {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="isPublic" checked={isPublic} onCheckedChange={(checked) => setValue('isPublic', checked)} />
        <Label htmlFor="isPublic" className="cursor-pointer">
          Make this diary public (others can view and comment)
        </Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
