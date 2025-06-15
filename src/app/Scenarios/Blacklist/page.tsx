"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompliceTable } from "@/components/complice-table";

/* ---------- Helpers ---------- */
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const waitForCompletion = async (taskId: string) => {
  toast("⏳ Recherche en cours…");

  while (true) {
    const res = await fetch(`http://127.0.0.1:8000/api/progress/${taskId}/`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || data.detail || "API error");

    const status = data.status?.toUpperCase();
    if (["PENDING", "PROGRESS", "STARTED", "RETRY"].includes(status)) {
      await sleep(2500);
      continue;
    }
    return data; // SUCCESS ou FAILURE
  }
};

/* ---------- Types ---------- */
type BlacklistRow = {
  reference: string;
  birthday: string | null;
  main_name: string;
  nationalities: string;
  reason_for_sanction: string;
};

/* ---------- Composant ---------- */
export default function Blacklist() {
  /* ----- Onglets ----- */
  const [selectedView, setSelectedView] =
    useState<"Liste ONU" | "Liste interne">("Liste ONU");
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname);

  /* ----- Formulaire (interne) ----- */
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [reference, setReference] = useState("");
  const [running, setRunning] = useState(false);

  /* ----- Données ----- */
  const [internalData, setInternalData] = useState<BlacklistRow[]>([]);
  const [onuData, setOnuData] = useState<BlacklistRow[]>([]);

  /* ---------- Charge la liste ONU la 1ʳᵉ fois qu’on ouvre l’onglet ---------- */
  useEffect(() => {
    if (selectedView !== "Liste ONU" || onuData.length) return;

    const fetchONU = async () => {
      try {
        toast("⏳ Import de la liste ONU…");
        const res = await fetch("/api/onu");
        if (!res.ok) throw new Error("Erreur API");
        const json = await res.json();
        setOnuData(json);
        console.log("Liste ONU chargée :", json);
        toast.success(`✅ ${json.length} individus importés`);
      } catch (err) {
        console.error(err);
        toast.error("❌ Impossible de récupérer la liste ONU");
      }
    };

    fetchONU();
  }, [selectedView, onuData.length]);

  /* ----- Lancer la recherche interne ----- */
  const runBlacklistSearch = async () => {
    if (running) return;
    setRunning(true);
    setInternalData([]);

    const payload = {
      scenario: {
        name: "blacklist",
        categories: {
          localDB: {
            fields: [
              { name: "name", type: "string", val: name },
              { name: "nationality", type: "string", val: nationality },
              {
                name: "date_of_birth",
                type: "string",
                val: dob ? dob.toISOString().split("T")[0] : "",
              },
              { name: "reference", type: "string", val: reference },
            ],
          },
        },
      },
      activeCategory: "localDB",
    };

    try {
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

      const progress = await waitForCompletion(data.task_id);
      setInternalData(progress.blacklistdata ?? []);
      toast.info(
        `Recherche terminée – ${progress.count ?? 0} résultat(s) trouvé(s)`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue.");
    } finally {
      setRunning(false);
    }
  };

  /* ---------- UI ---------- */
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

        <h1 className="font-bold text-2xl m-5">Blacklist</h1>

        {/* ---- Tabs ---- */}
        <div className=" ml-2 flex flex-row items-start mt-4 ">
          {["Liste ONU", "Liste interne"].map(view => (
            <Button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={` border-b-4 rounded-none ${
                selectedView === view
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
              variant="ghost"
            >
              {view}
            </Button>
          ))}
        </div>

        {/* ---- Vue LISTE ONU ---- */}
        {selectedView === "Liste ONU" && (
          <div >
            {onuData.length ? (
              <CompliceTable data={onuData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center p-6">
                <p className="text-gray-800 text-sm font-medium mb-1">
                  Aucune donnée ONU chargée
                </p>
                <p className="text-gray-500 text-sm">
                  Patiente ou clique sur l’onglet pour lancer le chargement.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---- Vue LISTE INTERNE ---- */}
        {selectedView === "Liste interne" && (
          <div className="mt-6 space-y-6">
            {/* Formulaire */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-sm border">
              <Input
                placeholder="Nom / alias"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={running}
              />
              <Input
                placeholder="Nationalité"
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                disabled={running}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start"
                    disabled={running}
                  >
                    {dob ? dob.toLocaleDateString("fr-DZ") : "Date de naissance"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={d => setDob(d)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Référence"
                value={reference}
                onChange={e => setReference(e.target.value)}
                disabled={running}
              />
              <div className="col-span-full text-right">
                <Button
                  onClick={runBlacklistSearch}
                  disabled={running}
                  className="w-full md:w-auto"
                >
                  {running ? "Recherche en cours…" : "Rechercher"}
                </Button>
              </div>
            </div>

            {/* Résultats */}
            {running ? null : internalData.length ? (
              <CompliceTable data={internalData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-52 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center p-6">
                <p className="text-gray-800 text-sm font-medium mb-1">
                  Aucun résultat
                </p>
                <p className="text-gray-500 text-sm">
                  Ajustez vos critères et relancez.
                </p>
              </div>
            )}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
