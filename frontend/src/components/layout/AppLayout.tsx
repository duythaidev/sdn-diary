import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, PenSquare, Home, LayoutDashboard, Book, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../LanguageSwitcher'

export default function AppLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useProfile()

  const isActive = (path: string) => location.pathname === path

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f5f2] font-sans">
      {/* Decorative background pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f5f2]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-2">
              <div className="-rotate-3 rounded-lg bg-black p-2 text-white shadow-md transition-transform duration-300 group-hover:rotate-0">
                <BookOpen className="size-6" />
              </div>
              <h1 className="text-foreground font-serif text-2xl font-bold tracking-tight">
                Journal<span className="text-primary/60">Feed</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden items-center gap-1 rounded-full bg-black/5 p-1 md:flex">
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn('rounded-full px-4', isActive('/') ? 'shadow-md' : 'text-muted-foreground')}
                >
                  <Home className="mr-2 size-4" />
                  {t('sidebar.publicFeed')}
                </Button>
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/dashboard">
                    <Button
                      variant={isActive('/dashboard') ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'rounded-full px-4',
                        isActive('/dashboard') ? 'shadow-md' : 'text-muted-foreground',
                      )}
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      {t('sidebar.dashboard')}
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button
                      variant={isActive('/diary') ? 'default' : 'ghost'}
                      size="sm"
                      className={cn('rounded-full px-4', isActive('/diary') ? 'shadow-md' : 'text-muted-foreground')}
                    >
                      <Book className="mr-2 size-4" />
                      {t('sidebar.myDiaries')}
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <Link to="/diary/create" className="hidden sm:block">
                    <Button className="rounded-full px-6 font-serif shadow-lg transition-all hover:shadow-xl">
                      <PenSquare className="mr-2 size-4" />
                      {isActive('/diary/create') ? t('common.loading') : t('sidebar.createDiary')}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-9 w-9 border border-black/10 transition-all hover:ring-2 hover:ring-black/10">
                          <AvatarImage src={user?.profileImage ?? undefined} alt={user?.username} />
                          <AvatarFallback className="bg-black/5 text-sm">
                            {user ? getInitials(user.username) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.username}</p>
                          <p className="text-muted-foreground text-xs">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        {t('sidebar.profile')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('sidebar.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="rounded-full px-4">
                      {t('common.signIn')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="rounded-full px-6 font-serif shadow-lg transition-all hover:shadow-xl">
                      {t('common.signUp')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto min-h-[calc(100vh-80px)] px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
