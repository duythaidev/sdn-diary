import { Button } from '@/components/ui/button'
import { EyeOff, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShowPasswordProps {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  className?: string
}

const ShowPassword = ({ showPassword, setShowPassword, className }: ShowPasswordProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setShowPassword(!showPassword)}
      className={cn("text-muted-foreground hover:text-foreground hover:bg-transparent", className)}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  )
}

export default ShowPassword
