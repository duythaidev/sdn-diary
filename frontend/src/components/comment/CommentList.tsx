import { format } from 'date-fns';
import { Comment, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
interface CommentListProps {
  comments: Comment[];
  diaryOwnerId: string;
  onDelete: (commentId: string) => void;
  loading?: boolean;
}
export const CommentList = ({ comments, diaryOwnerId, onDelete, loading }: CommentListProps) => {
  const { user } = useAuth();
  const canDelete = (comment: Comment) => {
    if (!user) return false;
    const commentUserId = typeof comment.userId === 'object' 
      ? (comment.userId as User).id 
      : comment.userId;
    return user.id === commentUserId || user.id === diaryOwnerId;
  };
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const commentUser = typeof comment.userId === 'object' ? comment.userId : null;
        return (
          <Card key={comment._id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">
                      {commentUser ? (commentUser as User).username : 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                {canDelete(comment) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(comment._id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};