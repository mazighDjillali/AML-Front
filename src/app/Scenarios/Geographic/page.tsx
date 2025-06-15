"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { algerianStates } from "@/lib/algerian-states";

/* ---------- Helpers ---------- */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Bloque tant que la tâche n’est pas terminée */
const waitForCompletion = async (taskId: string) => {
    toast("⏳ Analyse géographique en cours…");

    while (true) {
        const res = await fetch(`http://127.0.0.1:8000/api/progress/${taskId}/`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || data.detail || "API error");

        const status = data.status?.toUpperCase();
        if (["PENDING", "PROGRESS", "STARTED", "RETRY"].includes(status)) {
            await sleep(3000);
            continue;
        }
        return data; // SUCCESS ou FAILURE
    }
};

/* ---------- Types ---------- */
type Stats = {
    most_frequent_ccp?: string;
    max_total_mtop?: number;
};

type FlaggedTransaction = {
    account_number: string;
    destination_account: string;
    operation_date: string;
    amount: number;
    flagged_states: string[];
};

type GeoData = {
    flagged_transactions: FlaggedTransaction[];
    flagged_accounts: any[];
};

/* ---------- Composant ---------- */
export default function Geographic() {
    const DEFAULT_WILAYA = "02"; // sélection initiale
    const ITEMS_PER_PAGE = 10;    // lignes du tableau par page

    /* ----- State ----- */
    const [stats, setStats] = useState<Stats | null>(null);
    const [geoData, setGeoData] = useState<GeoData | null>(null);

    const [selectedStates, setSelectedStates] = useState<string[]>([
        DEFAULT_WILAYA,
    ]);
    const [showWilayaSection, setShowWilayaSection] = useState(false);
    const [running, setRunning] = useState(false);

    // pagination
    const [page, setPage] = useState(1);

    // sidebar
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState(pathname);

    /* ----- Chargement des stats ----- */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    "http://127.0.0.1:8000/api/scenario-stats-geo/"
                );
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Erreur lors du chargement des statistiques :", err);
            }
        })();
    }, []);

    /* ----- Lancement du scénario ----- */
    const runGeoRisk = async (wilayas: string[]) => {
        if (running || wilayas.length === 0) return;

        setRunning(true);
        setPage(1); // reset pagination

        const payload = {
            scenario: {
                name: "risky geographic zones",
                categories: {
                    transaction: {
                        fields: [
                            { name: "states", type: "list", val: wilayas.map(Number) },
                        ],
                    },
                },
            },
            activeCategory: "transaction",
        };

        try {
            // 1. créer le scénario
            const res = await fetch("http://127.0.0.1:8000/api/scenarios/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(`Erreur : ${data.error || data.detail}`);
                return;
            }

            toast.success(data.toast);

            // 2. suivre la progression
            const progress = await waitForCompletion(data.task_id);

            // 3. stocker le résultat
            setGeoData({
                flagged_transactions: progress.result?.flagged_transactions ?? [],
                flagged_accounts: progress.result?.flagged_accounts ?? [],
            });

            // 4. cacher la sélection si réussite
            if (progress.status?.toUpperCase() === "SUCCESS") {
                setShowWilayaSection(false);
            }

            toast.info(`Statut final : ${progress.status || "Inconnu"}`);
        } catch (err) {
            console.error("❌", err);
            toast.error("Une erreur s’est produite pendant l’analyse.");
        } finally {
            setRunning(false);
        }
    };

    /* ----- Lancer automatiquement sur mount avec la wilaya par défaut ----- */
    useEffect(() => {
        runGeoRisk(selectedStates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ----- Pagination helpers ----- */
    const totalItems = geoData?.flagged_transactions.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const paginatedRows =
        geoData?.flagged_transactions.slice(
            (page - 1) * ITEMS_PER_PAGE,
            page * ITEMS_PER_PAGE
        ) ?? [];

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                variant="inset"
            />

            <SidebarInset>
                <SiteHeader />

                {/* ---- Cartes statistiques ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 mt-4">
                    <div className="bg-white p-3 rounded-2xl shadow-md border text-blue-700 text-center">
                        <p className="text-sm uppercase font-medium mb-1">
                            Max Transactions – Wilaya Frauduleuse
                        </p>
                        <p className="text-2xl font-bold text-yellow-400">
                            {stats?.most_frequent_ccp || "—"}
                        </p>
                        <p className="text-xs text-blue-900 mt-1">
                            Plus haut nombre de transactions suspectes
                        </p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl shadow-md border text-blue-700 text-center">
                        <p className="text-sm uppercase font-medium mb-1">
                            Max Montant – Wilaya Frauduleuse
                        </p>
                        <p className="text-2xl font-bold text-yellow-400">
                            {stats?.max_total_mtop != null
                                ? `${stats.max_total_mtop.toLocaleString("fr-DZ")} DZD`
                                : "—"}
                        </p>
                        <p className="text-xs text-blue-900 mt-1">
                            Montant le plus élevé détecté
                        </p>
                    </div>
                </div>

                {/* ---- Sélection Wilayas ---- */}
                <div className="m-4">
                    <button
                        onClick={() => {
                            if (!running) setShowWilayaSection(!showWilayaSection);
                        }}
                        disabled={running}
                        className={`mb-3 px-4 py-2 rounded-md border text-sm transition-all ${running
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                    >
                        {showWilayaSection ? "Masquer la sélection des wilayas" : "Afficher la sélection des wilayas"}
                    </button>


                    {showWilayaSection && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h2 className="font-semibold text-blue-800 mb-3">
                                Wilayas à analyser
                            </h2>

                            <div className="flex flex-wrap gap-3 mb-4">
                                <button
                                    onClick={() => setSelectedStates(algerianStates.map(w => w.number))}
                                    className="px-3 py-1 text-sm text-green-700 border border-green-500 hover:bg-green-100 rounded-md"
                                >
                                    Tout sélectionner
                                </button>
                                <button
                                    onClick={() => setSelectedStates([])}
                                    className="px-3 py-1 text-sm text-red-700 border border-red-500 hover:bg-red-100 rounded-md"
                                >
                                    Tout désélectionner
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {algerianStates.map(({ number, label }) => {
                                    const isSelected = selectedStates.includes(number);
                                    return (
                                        <button
                                            key={number}
                                            type="button"
                                            onClick={() =>
                                                setSelectedStates((prev) =>
                                                    isSelected
                                                        ? prev.filter((n) => n !== number)
                                                        : [...prev, number]
                                                )
                                            }
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-150
              ${isSelected
                                                    ? "bg-blue-600 text-white border-blue-700 shadow-md"
                                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                                }
            `}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => runGeoRisk(selectedStates)}
                                disabled={running || selectedStates.length === 0}
                                className={`mt-5 px-4 py-2 rounded-md text-sm text-white ${running
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {running ? "Analyse en cours…" : "Lancer l’analyse"}
                            </button>
                        </div>
                    )}

                </div>

                {/* ---- Tableau + pagination ---- */}
                {geoData && (
                    <div className="m-4  rounded-xl p-4 overflow-auto">
                        <h2 className="font-semibold mb-2 text-blue-800">
                            Transactions signalées
                        </h2>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Compte source</TableHead>
                                    <TableHead>Compte destination</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Wilayas signalées</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedRows.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.account_number}</TableCell>
                                        <TableCell>{row.destination_account}</TableCell>
                                        <TableCell>
                                            {new Date(row.operation_date).toLocaleDateString("fr-DZ")}
                                        </TableCell>
                                        <TableCell>
                                            {row.amount.toLocaleString("fr-DZ")} DZD
                                        </TableCell>
                                        <TableCell>{row.flagged_states.join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* ---- Contrôles de pagination ---- */}
                        {totalItems > ITEMS_PER_PAGE && (
                            <div className="mt-4 flex justify-between items-center text-sm">
                                <p>
                                    Page {page} sur {totalPages}
                                </p>

                                <div className="space-x-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 bg-white rounded-md border hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1 bg-white rounded-md border hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <p className="text-xs text-gray-600 m-5">
                    * Les données affichées représentent les transactions anormales
                    détectées automatiquement selon les critères définis.
                </p>
            </SidebarInset>
        </SidebarProvider>
    );
}
