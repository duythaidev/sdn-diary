'use client'

import * as React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AudioWaveform, Command, Edit, FileText, GalleryVerticalEnd, Globe, Home, User } from 'lucide-react'

import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'
import { useProfile } from '@/hooks/useProfile'
import { Separator } from './ui/separator'
import { PrimaryButton } from './ui/button'

const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navTabs: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'My Diaries',
      url: '/diary',
      icon: FileText,
    },
    {
      title: 'Public Diaries',
      url: '/',
      icon: Globe,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { user } = useProfile()
  const navigate = useNavigate()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed' // true khi thu sidebar
  return (
    <Sidebar collapsible="icon" {...props}>
      {user && (
        <SidebarHeader>
          <NavUser user={user} />
        </SidebarHeader>
      )}
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navTabs.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <PrimaryButton onClick={() => navigate('/diary/new')} className="text-md">
            <Edit className="h-4 w-4!" />
            {!isCollapsed && <span>New Diary</span>}
          </PrimaryButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
