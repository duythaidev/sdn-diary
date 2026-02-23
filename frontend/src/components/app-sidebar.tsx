'use client'

import * as React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Edit, FileText, Globe, Home, User } from 'lucide-react'

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
import { Button } from './ui/button'

import { useTranslation } from 'react-i18next'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useProfile()
  const navigate = useNavigate()
  const { state } = useSidebar()

  const navTabs = [
    {
      title: t('sidebar.dashboard'),
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t('sidebar.myDiaries'),
      url: '/diary',
      icon: FileText,
    },
    {
      title: t('sidebar.publicFeed'),
      url: '/',
      icon: Globe,
    },
    {
      title: t('sidebar.profile'),
      url: '/profile',
      icon: User,
    },
  ]

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
              {navTabs.map((item) => {
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
        <SidebarMenuItem className="p-2">
          <Button onClick={() => navigate('/diary/create')} className="text-md w-full">
            <Edit className="h-4 w-4!" />
            {!isCollapsed && <span>{t('sidebar.createDiary')}</span>}
          </Button>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
