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
import {
  Result,
  SimpleClickableBadges,
} from "@/components/scenarioComp/scenario-res-choices";
import { Button } from "@/components/ui/button";
import { Car, CreditCard, User } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

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

export default function Anomaly() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<"Overview" | "Detailed View" | "Ai insights">("Overview");
  const [stats, setStats] = React.useState({
    ratio_stat: 0,
    inactif_stat_count: 0,
    nocturn_stat_count: 0,
  });
  const [anomalies2, setAnomalies2] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* helper ─────────────────────────────────────────────────────────────── */
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const waitForCompletion = async (taskId: string) => {
    while (true) {
      const res = await fetch(`http://127.0.0.1:8000/api/progress/${taskId}/`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.detail || "API error");

      if (data.status?.toUpperCase() === "PENDING") {
        toast("⏳ Analyse toujours en cours…");
        await sleep(3000); // 3 s pause then retry
        continue;
      }

      return data; // status is SUCCESS / FAILURE / etc.
    }
  };

  /* main hook ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const runAnomalyDetection = async () => {
      const payload = {
        scenario: {
          name: "anomaly detection",
          categories: {
            account: {
              fields: [
                { name: "accountnum", type: "text", val: "" },
                { name: "transaction_amount", type: "float", val: 0 },
                { name: "inactivity_duration", type: "number", val: 2 },
                { name: "risk", type: "text", val: "All" },
                {
                  name: "datetime_range",
                  type: "daterange",
                  val: { from: "2022-01-01", to: "2026-01-01" },
                },
                { name: "num_lines", type: "number", val: 100 },
              ],
            },
          },
        },
        activeCategory: "account",
      };

      try {
        /* 1 — start the scenario */
        const res = await fetch("http://127.0.0.1:8000/api/scenarios/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(`Erreur : ${data.error || data.detail}`);
          return;
        }

        toast.success(data.toast as string);

        /* 2 — keep polling until done */
        const progressData = await waitForCompletion(data.task_id as string);

        setAnomalies2(progressData.result?.anomalies ?? []);
        toast.info(`Statut final : ${progressData.status || "Inconnu"}`);
      } catch (err) {
        console.error("❌", err);
        toast.error("Une erreur s’est produite pendant l’envoi ou le suivi.");
      }
    };

    runAnomalyDetection(); // run once on mount
  }, []); // empty deps ⇒ only on mount
  // Fetch anomaly stats for the cards
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/scenario-stats-anomaly/",
        );
        const result = await response.json();
        setStats(result);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    }

    fetchStats();
  }, []);
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
                    {stats.ratio_stat}
                  </p>
                  <p className="text-xs text-blue-900 mt-1">Daily amount/Balance</p>
                </div>
                {/* Comptes inactifs */}
                <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-300 text-center">
                  <p className="text-sm text-blue-700 uppercase font-medium mb-1">
                    Comptes Inactifs
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.inactif_stat_count}
                  </p>
                  <p className="text-xs text-blue-900 mt-1">Sans activité récente</p>
                </div>
                {/* Transactions nocturnes */}
                <div className="bg-white p-3 rounded-2xl shadow-md border border-purple-200 text-center">
                  <p className="text-sm text-blue-700 uppercase font-medium mb-1">
                    Transactions Nocturnes
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.nocturn_stat_count}
                  </p>
                  <p className="text-xs text-blue-900 mt-1">Entre 00h et 05h</p>
                </div>
              </div>
            </div>
            <div className="m-4 bg-blue-100 rounded-xl h-full">
              <AnomalyTable key="overview-table" data={anomalies2} />
            </div>
            <p className="text-xs text-gray-600 m-5">
              * Les données affichées représentent les transactions anormales détectées automatiquement selon les critères définis.
            </p>
          </>
        )}

        {selectedView === "Detailed View" && (
          <div className="grid grid-cols-4  h-full grid-rows-1 gap-4">

            <div className="flex flex-row items-start  m-5 justify-start ">
              <ContactForm onResult={setAnomalies} />   {/* pass setter as prop */}
            </div>
            <div className="col-span-3 m-5 ">
              <AnomalyTable key="detailed-table" data={anomalies} />
            </div>


          </div>
        )}


      </SidebarInset>
    </SidebarProvider>
  );
}

