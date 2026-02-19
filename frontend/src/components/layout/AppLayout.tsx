import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookOpen, PenSquare, Home, LayoutDashboard, Book } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
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
                  Feed
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn('rounded-full px-4', isActive('/dashboard') ? 'shadow-md' : 'text-muted-foreground')}
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/diary">
                <Button
                  variant={isActive('/diary') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn('rounded-full px-4', isActive('/diary') ? 'shadow-md' : 'text-muted-foreground')}
                >
                  <Book className="mr-2 size-4" />
                  My Diaries
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/diary/create">
                <Button className="rounded-full px-6 font-serif shadow-lg transition-all hover:shadow-xl">
                  <PenSquare className="mr-2 size-4" />
                  {isActive('/create') ? 'Writing' : 'Write'}
                </Button>
              </Link>

              <Link to="/profile">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-black/10 bg-black/5 transition-all hover:ring-2 hover:ring-black/5">
                  <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                </div>
              </Link>
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
