"use client"

import * as React from "react"
import { 
  Home, 
  QrCode, 
  Upload, 
  BarChart3, 
  Users, 
  Settings
} from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDashboard, type DashboardSection } from "@/hooks/useDashboard"

// QR Dashboard navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: Home,
      section: "dashboard" as DashboardSection,
    },
    {
      title: "Mine QR-koder",
      icon: QrCode,
      section: "qr-codes" as DashboardSection,
    },
    {
      title: "Bulk Upload",
      icon: Upload,
      section: "bulk-upload" as DashboardSection,
    },
    {
      title: "Analytics",
      icon: BarChart3,
      section: "analytics" as DashboardSection,
    },
    {
      title: "Team",
      icon: Users,
      section: "team" as DashboardSection,
    },
    {
      title: "Innstillinger",
      icon: Settings,
      section: "settings" as DashboardSection,
    },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { activeSection, setActiveSection } = useDashboard()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* QRLab Logo */}
        <div className="flex items-center space-x-3 px-2 py-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-slate-500 rounded-lg flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
            QRLab
          </span>
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
            Navigasjon
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = activeSection === item.section
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => setActiveSection(item.section)}
                      style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/*

        ADD USER INFO HERE.

      */}
      <SidebarRail />
    </Sidebar>
  )
}
