import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
interface CommentFormData {
  content: string;
}
interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}
export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  const handleFormSubmit = async (data: CommentFormData) => {
    setLoading(true);
    try {
      await onSubmit(data.content);
      reset();
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Add a comment</Label>
        <Textarea
          id="content"
          placeholder="Write your comment..."
          rows={3}
          {...register('content', { 
            required: 'Comment cannot be empty',
            maxLength: {
              value: 500,
              message: 'Comment cannot exceed 500 characters'
            }
          })}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  );
};
