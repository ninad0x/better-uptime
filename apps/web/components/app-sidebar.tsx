"use client"

import * as React from "react"
import { LayoutDashboard, Activity, Bell, Settings } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"

const data = {
  user: {
    name: "User Name", // You will eventually pass real session data here
    email: "user@example.com",
    avatar: "/avatar.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Monitors", url: "/dashboard/monitors", icon: Activity },
    { title: "Alerts", url: "/dashboard/alerts", icon: Bell },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}