"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnomalyTable } from "@/components/anomaly-table";

type StatsType = {
  ratio_stat: number;
  inactif_stat_count: number;
  nocturn_stat_count: number;
  moles_percode_stat: Record<string, number>;
  nb_rcv: number;
  mole_account_most_appearances: string;
};

export default function InsiderAccomplice() {
  const pathname = usePathname();
  const [insiderData, setInsiderData] = useState<any[]>([]);
  const [stats, setStats] = useState<StatsType>({
    ratio_stat: 0,
    inactif_stat_count: 0,
    nocturn_stat_count: 0,
    moles_percode_stat: {},
    nb_rcv: 0,
    mole_account_most_appearances: "",
  });
  const [selectedView, setSelectedView] = useState<"Overview" | "Detailed View">("Overview");

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForTaskCompletion = async (taskId: string) => {
    while (true) {
      const res = await fetch(`http://127.0.0.1:8000/api/progress/${taskId}/`);
      const data = await res.json();
      if (data.status === "PENDING") {
        toast("⏳ En cours d'analyse...");
        await sleep(3000);
        continue;
      }
      return data;
    }
  };

  const runScenario = async () => {
    const scenarioPayload = {
      scenario: {
        name: "insider accomplice",
        categories: {
          account: {
            fields: [
              { name: "freq_before_flag", val: 2 },
              {
                name: "suspected_time_range",
                val: { from: "2022-01-01", to: "2026-01-01" },
              },
            ],
          },
        },
      },
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/scenarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenarioPayload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Scenario failed");

      toast.success("🚀 Analyse lancée");

      const final = await waitForTaskCompletion(result.task_id);
      setInsiderData(final.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Échec de l’analyse");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scenario-stats-mole/");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erreur chargement stats", err);
    }
  };

  useEffect(() => {
    runScenario();
    fetchStats();
  }, []);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar currentPage={pathname} onPageChange={() => {}} variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex mt-5 mx-5">
          <div className="bg-gray-200 space-x-2 rounded-lg p-1 flex">
            {["Overview", "Detailed View"].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as "Overview" | "Detailed View")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedView === view
                    ? "bg-white text-blue-600 shadow"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6 mx-5">
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border">
                <p className="text-sm text-blue-700 uppercase font-medium">Transactions par code postal</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Object.values(stats.moles_percode_stat).reduce((sum, val) => sum + val, 0)}
                </p>
                <p className="text-xs text-blue-900 mt-1">Total par zones</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border">
                <p className="text-sm text-blue-700 uppercase font-medium">Receveurs détectés</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.nb_rcv}</p>
                <p className="text-xs text-blue-900 mt-1">Comptes receveurs suspects</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border">
                <p className="text-sm text-blue-700 uppercase font-medium">Compte receveur le plus fréquent</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.mole_account_most_appearances
                    ? "****" + stats.mole_account_most_appearances.slice(-4)
                    : "—"}
                </p>
                <p className="text-xs text-blue-900 mt-1">Compte receveur dominant</p>
              </div>
            </div>

            <div className="m-4 bg-blue-100 rounded-xl">
              <AnomalyTable key="overview" data={insiderData} />
            </div>

            <p className="text-xs text-gray-600 m-5">
              * Les données affichées représentent les transactions suspectes détectées pour le scénario “insider accomplice”.
            </p>
          </>
        )}

        {selectedView === "Detailed View" && (
          <div className="grid grid-cols-4 gap-4 m-5">
            {/* Add detailed stats widgets here if needed */}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
