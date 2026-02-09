import type { UseFormRegisterReturn, FieldError } from 'react-hook-form'
import { Input } from '@/components/ui/input'
    
interface DiaryTitleInputProps {
  register: UseFormRegisterReturn<'title'>
  errors?: FieldError
}

export function DiaryTitleInput({ register, errors }: DiaryTitleInputProps) {
  return (
    <div className="group mb-8">
      <Input
        id="title"
        placeholder="Title your reflection..."
        className="text-foreground placeholder:text-muted-foreground mb-2 h-16 border-none bg-transparent p-0 text-5xl! font-extrabold focus-visible:ring-0 focus-visible:ring-offset-0"
        {...register}
      />
      {errors ? (
        <p className="text-destructive mt-2 text-sm">{errors.message}</p>
      ) : (
        <p className="text-primary text-sm opacity-0 transition-opacity group-focus-within:opacity-100">Title</p>
      )}
    </div>
  )
}
