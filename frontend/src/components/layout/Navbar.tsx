import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BookOpen, LogOut, Search, User } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useState, useEffect } from 'react'
import { diaryService } from '@/services/api/diaryService'
import type { Diary, User as UserType } from '@/types'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import useDebounce from '@/hooks/useDebounce'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [publicDiaries, setPublicDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(false)

  const searchQueryDebounce = useDebounce(searchQuery, 500)

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fetch public diaries when dialog opens or search query changes
  useEffect(() => {
    if (open) {
      fetchPublicDiaries()
    }
  }, [open, searchQueryDebounce])

  const fetchPublicDiaries = async () => {
    setLoading(true)
    try {
      const response = await diaryService.getPublicDiaries(true, false, searchQueryDebounce)
      setPublicDiaries(response.diaries)
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to load public diaries'))
    } finally {
      setLoading(false)
    }
  }

  const handleDiarySelect = (diaryId: string) => {
    setOpen(false)
    setSearchQuery('')
    navigate(`/diary/${diaryId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="text-primary h-6 w-6" />
                <span className="text-xl font-bold">Personal Diary</span>
              </Link>

              <div className="flex flex-1 items-center justify-center px-8">
                <div className="relative w-full max-w-md">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search public diaries..."
                    onFocus={() => setOpen(true)}
                    readOnly
                    className="h-10 w-full cursor-pointer pr-4 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button variant="ghost" size="sm">
                      My Diaries
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarFallback>{user ? getInitials(user.username) : 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.username}</p>
                          <p className="text-muted-foreground text-xs">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search public diaries..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm">Loading...</div>
            ) : publicDiaries.length === 0 ? (
              <CommandEmpty>No public diaries found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Public Diaries">
                {publicDiaries.map((diary) => (
                  <CommandItem key={diary._id} onSelect={() => handleDiarySelect(diary._id)} className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{diary.title}</span>
                        <span className="text-muted-foreground text-xs">
                          by {(diary.userId as UserType).username || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span>{formatDate(diary.createdAt)}</span>
                        {diary.selectedMood && (
                          <>
                            <span>•</span>
                            <span>{diary.selectedMood}</span>
                          </>
                        )}
                      </div>
                      {diary.content && (
                        <p className="text-muted-foreground line-clamp-1 text-sm">
                          {diary.content.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
