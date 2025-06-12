"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, FileText, Home, LineChart, Settings } from "lucide-react"

import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { IconShieldCheck } from "@tabler/icons-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/app",
      icon: IconDashboard,
    },
    {
      title: "Scenarios",
      url: "/Scenarios",
      icon: IconListDetails,
    },
    {
      title: "Alertes",
      url: "/Alertes",
      icon: IconChartBar,
    },
    {
      title: "Rapports",
      url: "/Rapport",
      icon: IconFolder,
    },

  ],


}
interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPage: string
  onPageChange: (page: string) => void
}
export function AppSidebar({ currentPage, onPageChange, ...props }: DashboardSidebarProps) {

  return (
    <Sidebar className="gap-10 " collapsible="offcanvas" {...props}>

      <SidebarHeader className="bg-slate-900 px-4  rounded-xl mb-5 shadow-md">
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          {/* Logo */}


          {/* Title */}
          <span className="text-lg font-bold text-white tracking-wide text-center">
            AML Dashboard
          </span>
        </div>
      </SidebarHeader>


      <SidebarContent className=" px-3 py-6 rounded-3xl w-full text-white bg-slate-900">
        <SidebarGroup className="w-full">
          <SidebarMenu className="flex items-center  ">
            <div className="flex items-center  flex-col  gap-3 w-full">

              {data.navMain.map((item) => {
                const isActive = currentPage === item.url

                // Dropdown for Scenarios
                if (item.title === "Scenarios") {
                  return (
                    <SidebarMenuItem className="w-full" key={item.title}>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full rounded-md text-[20px] h-15 transition-all duration-200 cursor-pointer flex items-center gap-2"
                            isActive={isActive}
                          >
                            <item.icon className="h-10 w-10" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="ml-12 mt-2 flex flex-col gap-2 text-white">
                          <Link
                            href="/Scenarios/Structuring"
                            onClick={() => onPageChange("/Alertes/Notifications")}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          >
                            Structuring
                          </Link>
                          <Link
                            href="/Scenarios/Anomaly"
                            onClick={() => onPageChange("/Scenarios/Logs")}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          >
                            Anomaly
                          </Link>
                          
                          <Link
                            href="/Scenarios/Geographic"
                            onClick={() => onPageChange("/Scenarios/Geographic")}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          >
                            Geographic
                          </Link>
                           <Link
                            href="/Scenarios/Structuring"
                            onClick={() => onPageChange("/Alertes/Notifications")}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          >
                            Blacklist
                          </Link>
                          <Link
                            href="/Alertes/Logs"
                            onClick={() => onPageChange("/Scenarios/Logs")}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          >
                            Complice
                          </Link>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  )
                }

                // Default SidebarMenuButton
                return (
                  <SidebarMenuItem className="w-full" key={item.title}>
                    <Link href={item.url} className="block w-full">
                      <SidebarMenuButton
                        className="w-full rounded-md text-[19px] transition-all h-15 duration-200 cursor-pointer flex items-center gap-2"
                        isActive={isActive}
                        onClick={() => onPageChange(item.url)}
                      >
                        <item.icon className="h-10 w-10 rounded-xl" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              })}

            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  )
}




