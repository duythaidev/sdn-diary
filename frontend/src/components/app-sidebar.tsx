'use client'

import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AudioWaveform, Command, Edit, FileText, GalleryVerticalEnd, Globe, Home } from 'lucide-react'

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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { user } = useProfile()
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
          <PrimaryButton className="bg-primary justify-center p-2 text-lg">
            <Edit className='size-6!' />
            <span>New Diary</span>
          </PrimaryButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
