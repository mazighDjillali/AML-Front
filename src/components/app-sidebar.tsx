"use client";

import * as React from "react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
} from "@tabler/icons-react";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard/app",
    icon: IconDashboard,
  },
  {
    title: "Scenarios",
    url: "/Scenarios",
    icon: IconListDetails,
    subItems: [
      { title: "Structuring", url: "/Scenarios/Structuring" },
      { title: "Anomaly", url: "/Scenarios/Anomaly" },
      { title: "Geographic", url: "/Scenarios/Geographic" },
      { title: "Blacklist", url: "/Scenarios/Blacklist" },
      { title: "Complice", url: "/Scenarios/Complice" },
    ],
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
];

export function AppSidebar({
  currentPage,
  onPageChange,
  ...props
}: DashboardSidebarProps) {
  const [scenariosOpen, setScenariosOpen] = React.useState(true);

  return (
    <Sidebar className="gap-10" collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader className="bg-slate-900 px-4 rounded-xl mb-5 shadow-md">
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          <span className="text-lg font-bold text-white tracking-wide text-center">
            AML Dashboard
          </span>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-6 rounded-3xl w-full text-white bg-slate-900">
        <SidebarGroup className="w-full">
          <SidebarMenu className="flex items-center">
            <div className="flex items-center flex-col gap-3 w-full">
              {navItems.map((item) => {
                const isActive = currentPage === item.url;

                if (item.title === "Scenarios" && item.subItems) {
                  return (
                    <SidebarMenuItem className="w-full" key={item.title}>
                      <Collapsible
                        open={scenariosOpen}
                        onOpenChange={setScenariosOpen}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full rounded-md text-[20px] h-15 transition-all duration-200 cursor-pointer flex items-center gap-2"
                            isActive={isActive}
                          >
                            <item.icon className="h-10 w-10" />
                            <span className="focus:bg-white">{item.title}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="ml-12 mt-2 flex flex-col gap-2 text-white">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.url}
                              href={sub.url}
                              onClick={() => onPageChange(sub.url)}
                              className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem className="w-full" key={item.title}>
                    <Link href={item.url} className="block w-full">
                      <SidebarMenuButton
                        className="w-full rounded-md text-[19px] h-15 transition-all duration-200 cursor-pointer flex items-center gap-2"
                        isActive={isActive}
                        onClick={() => onPageChange(item.url)}
                      >
                        <item.icon className="h-10 w-10 rounded-xl" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
