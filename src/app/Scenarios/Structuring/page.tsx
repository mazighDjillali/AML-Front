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
import { ModelResults } from "@/components/model-report";
// -------------------------------

export default function Structuring() {
    const [selectedScenario, setSelectedScenario] = useState("Smurfing");
    const { clickedFeature } = DashboardStore();
    const [selectedView, setSelectedView] = useState<"Overview" | "Expert" | "Ai insights">("Overview");

    const [totalTransactions, setTotalTransactions] = useState<number | null>(
        null,
    );
    const [totalAccounts, setTotalAccounts] = useState<number | null>(null);
    const [anomalyData, setAnomalyData] = useState<any>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/geozone/count/")
            .then((res) => res.json())
            .then((data) => {
                setTotalTransactions(data.count ?? 0);
            })
            .catch((err) => {
                console.error(
                    "Erreur lors du chargement du total des transactions :",
                    err,
                );
            });
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/nb_accounts/")
            .then((res) => res.json())
            .then((data) => {
                setTotalAccounts(data.distinct_account_count ?? 0);
            })
            .catch((err) =>
                console.error("Erreur lors du chargement des comptes distincts :", err),
            );
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/scenario-stats/")
            .then((res) => res.json())
            .then((data) => setAnomalyData(data))
            .catch((err) =>
                console.error("Erreur lors du chargement des anomalies :", err),
            );
    }, []);

    const getAnomalyCount = (scenario: string): number => {
        if (!anomalyData) return 0;
        switch (scenario) {
            case "Smurfing":
                return anomalyData.advanced_fraud?.total_anomalies || 0;
            case "Anomaly Detection":
                return anomalyData.rule_based_anomaly?.total_anomalies || 0;
            case "Geo Zone":
                return anomalyData.geozone_risk?.total_anomalies || 0;
            case "Insider accomplice":
                return anomalyData.whackamole?.total_anomalies || 0;
            default:
                return 0;
        }
    };

    const getTotalAnomalies = () => {
        if (!anomalyData) return 0;
        return (
            (anomalyData.advanced_fraud?.total_anomalies || 0) +
            (anomalyData.rule_based_anomaly?.total_anomalies || 0) +
            (anomalyData.geozone_risk?.total_anomalies || 0) +
            (anomalyData.whackamole?.total_anomalies || 0)
        );
    };

    const getAnomalyPercent = (count: number, total: number) => {
        return total === 0 ? 0 : Math.round((count / total) * 100);
    };

    const scenarioCount = useMemo(
        () => getAnomalyCount(selectedScenario),
        [anomalyData, selectedScenario],
    );
    const totalAnomalies = useMemo(() => getTotalAnomalies(), [anomalyData]);
    const scenarioPercent = useMemo(
        () => getAnomalyPercent(scenarioCount, totalAnomalies),
        [scenarioCount, totalAnomalies],
    );
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
                        {["Overview", "Expert", "Ai insights"].map((view) => (
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
                    <div className="m-4 bg-blue-100 rounded-xl h-full">
                        <RiskTable />
                    </div>
                )}

                {selectedView === "Expert" && (

                    <ModelResults />
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}

