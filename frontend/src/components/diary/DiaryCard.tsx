import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Diary, User } from '@/types'
import { Globe, Lock } from 'lucide-react'
interface DiaryCardProps {
  diary: Diary
}
export const DiaryCard = ({ diary }: DiaryCardProps) => {
  const user = typeof diary.userId === 'object' ? diary.userId : null
  const excerpt = diary.content.substring(0, 150) + (diary.content.length > 150 ? '...' : '')
  return (
    <Link to={`/diary/${diary._id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1">{diary.title}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                {user && <span>{(user as User).username}</span>}
                <span>•</span>
                <span>{format(new Date(diary.createdAt), 'MMM dd, yyyy')}</span>
              </CardDescription>
            </div>
            <Badge variant={diary.isPublic ? 'default' : 'secondary'} className="ml-2">
              {diary.isPublic ? (
                <>
                  <Globe className="mr-1 h-3 w-3" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="mr-1 h-3 w-3" />
                  Private
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 text-sm">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
