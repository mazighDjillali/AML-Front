"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { Reportform } from "@/components/report-form";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const GenerateReport = () => {
 
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname)
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Reportform />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default GenerateReport;
