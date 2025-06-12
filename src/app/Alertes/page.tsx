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

// -------------------------------

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState("Smurfing");
  const { clickedFeature } = DashboardStore();

  const [totalTransactions, setTotalTransactions] = useState<number | null>(
    null,
  );
  const [totalAccounts, setTotalAccounts] = useState<number | null>(null);
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname)
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
            <SiteHeader  />
          
      <div className="grid grid-cols-12  gap-4 w-full h-full grid-flow-dense  p-4">
        {/* Map */}
        <div className="col-span-8 row-span-3 bg-gradient-to-br from-blue-300 to-white shadow-md border border-blue-200 rounded-2xl px-4 py-4">
          <AlgeriaMap />
        </div>

        {/* Total Transactions */}
        <Card className="col-span-4 row-span-1 bg-gradient-to-br from-blue-200 to-white shadow-md border border-yellow-300 rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-medium text-apcolor2">
                  Total Transactions
                </CardTitle>
                <span className="text-xs text-yellow-400">April 2025</span>
              </div>
              <CreditCard className="h-5 w-5 text-apcolor2 drop-shadow-sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-1">
                <div className="text-3xl font-extrabold text-blue-700 drop-shadow-md leading-none">
                  {totalTransactions !== null
                    ? totalTransactions.toLocaleString("fr-FR")
                    : "..."}
                </div>
                <span className="text-sm text-yellow-400">normal</span>
              </div>

              <div className="relative h-12 w-12">
                <svg className="h-12 w-12 rotate-[-90deg]" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#bfdbfe"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-apcolor2 font-semibold text-xs">
                  100%
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Total Anomalies by Scenario */}
        <Card className="col-span-4 row-span-1 bg-gradient-to-br from-blue-200 to-white shadow-md border border-yellow-300 rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-medium text-apcolor2">
                  Fraud Transactions – {selectedScenario}
                </CardTitle>
                <span className="text-xs text-yellow-400">April 2025</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-yellow-300 text-red-600 hover:text-red-800 text-xs"
                  >
                    {selectedScenario}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[
                    "Smurfing",
                    "Anomaly Detection",
                    "Geo Zone",
                    "Insider accomplice",
                  ].map((scenario) => (
                    <DropdownMenuItem
                      key={scenario}
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      {scenario}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-1">
                <div className="text-3xl font-extrabold text-red-600 drop-shadow-md leading-none">
                  {scenarioCount.toLocaleString("fr-FR")}
                </div>
                <span className="text-sm text-yellow-400">Fraud</span>
              </div>
              <div>
                <ProgressCircle percent={scenarioPercent} />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Accounts */}
        <Card className="col-span-4 bg-gradient-to-br from-blue-200 to-white shadow-md border border-yellow-300 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-xl font-medium text-apcolor2">
                Total Accounts
              </CardTitle>
              <p className="text-sm text-red-700">April 2025</p>
            </div>
            <User className="h-6 w-6 text-red-700 drop-shadow-sm" />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-start gap-2">
              <div className="text-5xl font-extrabold text-blue-700 drop-shadow-md leading-none">
                {totalAccounts !== null
                  ? totalAccounts.toLocaleString("fr-FR")
                  : "..."}
              </div>
            </div>
            <div className="relative h-14 w-14">
              <svg className="h-14 w-14 rotate-[-90deg]" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#bfdbfe"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeDasharray="100"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-apcolor2 font-semibold text-sm">
                100%
              </div>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="col-span-4 row-span-2">
          <LongLineChart />
        </div>
        <div className="col-span-4 row-span-2">
          <FraudPieChart />
        </div>
        <div className="col-span-4 row-span-2">
          <FraudByRiskChart />
        </div>
      </div>
        </SidebarInset>
    </SidebarProvider>
  );
}

// ✅ ProgressCircle subcomponent
function ProgressCircle({ percent }: { percent: number }) {
  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 rotate-[-90deg]" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="#fecaca"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="#dc2626"
          strokeWidth="4"
          strokeDasharray="100"
          strokeDashoffset={100 - percent}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-semibold text-sm">
        {percent}%
      </div>
    </div>
  );
}
