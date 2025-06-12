"use client"
import React, { useEffect, useState, useMemo } from "react";
import AlgeriaMap from "@/components/alg-map";
import { LongLineChart } from "@/components/long-linechart";
import { FraudPieChart } from "@/components/piechart";
import { FraudByRiskChart } from "@/components/barchart";
import { DashboardStore } from "@/stores/dashboard-store";

import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Car, CreditCard, User } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RiskTable } from "@/components/structuring-table";
import { AnomalyTable } from "@/components/anomaly-table";
import ContactForm from "@/components/scenario-form";
// -------------------------------

export default function Dashboard() {
    const [selectedView, setSelectedView] = useState<"Overview" | "Detailed View" | "Ai insights">("Overview");

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
                <div className="flex flex-row items-start mt-5 justify-start ">
                    <div className=" mx-5 flex bg-gray-200 space-x-2   rounded-lg  p-1"> {/* Container for the buttons, adds spacing */}
                        {["Overview", "Detailed View"].map((view) => (
                            <button
                                key={view}
                                onClick={() => setSelectedView(view as any)}
                                className={`px-4 py-2 rounded-md shadow-md transition-colors ${selectedView === view
                                    ? "bg-white text-blue-600"
                                    : "bg-blue-50 text-black hover:text-blue-600"
                                    }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                </div>


                {selectedView === "Overview" && (
                    <>
                        <div className="flex flex-row items-center mt-5 justify-center w-full ">
                            <div className="mx-5 grid grid-cols-3 w-full  rounded-lg p-1 gap-2">
                                {/* Ratio élevés */}
                                <div className="bg-white p-3 rounded-2xl shadow-md border border-blue-200 text-center">
                                    <p className="text-sm text-blue-700 uppercase font-medium mb-1">
                                        Ratios Élevés
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        123545
                                    </p>
                                    <p className="text-xs text-blue-900 mt-1">Daily amount/Balance</p>
                                </div>
                                {/* Comptes inactifs */}
                                <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-300 text-center">
                                    <p className="text-sm text-blue-700 uppercase font-medium mb-1">
                                        Comptes Inactifs
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        123545
                                    </p>
                                    <p className="text-xs text-blue-900 mt-1">Sans activité récente</p>
                                </div>
                                {/* Transactions nocturnes */}
                                <div className="bg-white p-3 rounded-2xl shadow-md border border-purple-200 text-center">
                                    <p className="text-sm text-blue-700 uppercase font-medium mb-1">
                                        Transactions Nocturnes
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        123545
                                    </p>
                                    <p className="text-xs text-blue-900 mt-1">Entre 00h et 05h</p>
                                </div>
                            </div>
                        </div>
                        <div className="m-4 bg-blue-100 rounded-xl h-full">
                            <AnomalyTable />
                        </div>
                    </>
                )}

                {selectedView === "Detailed View" && (
                    <div className="grid grid-cols-4  h-full grid-rows-1 gap-4">

                        <div className="flex flex-row items-start  m-5 justify-start ">
                            <ContactForm></ContactForm>
                        </div>
                        <div className="col-span-3 m-5 ">
                            <AnomalyTable  />
                        </div>

                    </div>
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}

