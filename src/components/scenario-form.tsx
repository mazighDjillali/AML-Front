"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "./date-picker"; // Must support `onChange(date: Date)`
import { NumberDropdown } from "./number-selector"; // Must support `onSelect(val: number)`
import { toast } from "sonner"
/** ------------------
 *  Strict Type Models
 *  ------------------*/

/** Generic field description expected by the API */
export type ApiField<T = unknown> =
  | { name: "accountnum" | "risk"; type: "text"; val: string }
  | { name: "transaction_amount"; type: "float"; val: number }
  | { name: "inactivity_duration" | "num_lines"; type: "number"; val: number }
  | {
    name: "datetime_range";
    type: "daterange";
    val: { from: string; to: string };
  };

export interface ApiPayload {
  scenario: {
    name: string;
    categories: {
      account: {
        fields: ApiField[];
      };
    };
  };
  activeCategory: "account";
}

/** UI-local state */
interface FormData {
  nCompte: string;
  mtOp: string;
  lignes: string;
  moisInactif: number | null;
  risque: number | null;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

interface ContactFormProps {
  onResult: (rows: any[]) => void;
}


/** ------------------
 *  Helper Functions
 *  ------------------*/

/**
 * Build the minimal payload, skipping undefined or empty values.
 */
const buildPayload = (data: FormData): ApiPayload => {
  const fields: ApiField[] = [];

  if (data.nCompte.trim())
    fields.push({ name: "accountnum", type: "text", val: data.nCompte.trim() });

  if (data.mtOp.trim())
    fields.push({
      name: "transaction_amount",
      type: "float",
      val: parseFloat(data.mtOp),
    });

  if (data.moisInactif !== null)
    fields.push({
      name: "inactivity_duration",
      type: "number",
      val: data.moisInactif,
    });

  if (data.risque !== null)
    fields.push({ name: "risk", type: "text", val: String(data.risque) });

  if (data.startDate && data.endDate)
    fields.push({
      name: "datetime_range",
      type: "daterange",
      val: { from: data.startDate, to: data.endDate },
    });

  if (data.lignes.trim())
    fields.push({
      name: "num_lines",
      type: "number",
      val: parseInt(data.lignes, 10),
    });

  return {
    scenario: {
      name: "anomaly detection",
      categories: {
        account: { fields },
      },
    },
    activeCategory: "account",
  };
};

/** ------------------
 *  Main Component
 *  ------------------*/
export default function ContactForm({ onResult }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nCompte: "",
    mtOp: "",
    lignes: "",
    moisInactif: null,
    risque: null,
    startDate: "",
    endDate: "",
  });

  /** Generic input change handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Submit scenario to backend */
 const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Poll until status ≠ "PENDING" */
const waitForCompletion = async (taskId: string) => {
  while (true) {
    const res = await fetch(`http://127.0.0.1:8000/api/progress/${taskId}/`);
    const data = await res.json();

    /* defensive fallback if backend errors out */
    if (!res.ok) throw new Error(data.error || data.detail || "API error");

    /* when still pending → wait & loop */
    if (data.status?.toUpperCase() === "PENDING") {
      toast("⏳ Toujours en attente...");
      await sleep(3000); // 3 s between checks
      continue;
    }

    /* finished (SUCCESS, FAILURE, etc.) → return full payload */
    return data;
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const payload = buildPayload(formData);

  try {
    /* ── STEP 1 : start the scenario ──────────────────────────── */
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

    const taskId = data.task_id as string;
    toast.success(data.toast as string);

    /* ── STEP 2 : poll until done ─────────────────────────────── */
    const progressData = await waitForCompletion(taskId);

    onResult(progressData.result?.anomalies ?? []);
    toast(
      `Statut final : ${progressData.status || "Inconnu"}`
    );
  } catch (err) {
    console.error("❌ Error:", err);
    toast.error("Une erreur s’est produite pendant l’envoi ou le suivi.");
  }
};
  /** ------------------
   *  Render
   *  ------------------*/
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white rounded-xl p-6 shadow-md space-y-4"
    >
      {/* Numéro de compte */}
      <div>
        <Label className="mb-2" htmlFor="nCompte">
          Numéro de compte
        </Label>
        <Input
          id="nCompte"
          name="nCompte"
          placeholder="Numéro du compte"
          value={formData.nCompte}
          onChange={handleChange}
        />
      </div>

      {/* Montant de la transaction */}
      <div>
        <Label className="mb-2" htmlFor="mtOp">
          Montant de la transaction
        </Label>
        <Input
          id="mtOp"
          name="mtOp"
          type="number"
          placeholder="Montant de la transaction"
          value={formData.mtOp}
          onChange={handleChange}
        />
      </div>

      {/* Mois d'inactivité */}
      <div>
        <Label className="mb-2" htmlFor="moisInactif">
          Nombre de mois d'inactivité
        </Label>
        <NumberDropdown
          mode="numbers"
          onSelect={(val: string | number) =>
            setFormData((prev) => ({ ...prev, moisInactif: Number(val) }))
          }
        />


      </div>

      {/* Risque */}
      <div>
        <Label className="mb-2" htmlFor="risque">
          Niveau de risque
        </Label>
        <NumberDropdown
          mode="risk"
          onSelect={(val: string | number) =>
            setFormData((prev) => ({ ...prev, risque: Number(val) }))
          }
        />

      </div>

      {/* Plage de dates */}
      <div>
        <Label className="mb-2" htmlFor="dateRange">
          Plage de dates
        </Label>
        <div className="flex flex-row justify-center items-center gap-2">
          <DatePickerDemo
            onChange={(date: Date) =>
              setFormData((prev) => ({
                ...prev,
                startDate: date.toISOString().slice(0, 10),
              }))
            }
          />
          <span className="text-sm">à</span>
          <DatePickerDemo
            onChange={(date: Date) =>
              setFormData((prev) => ({
                ...prev,
                endDate: date.toISOString().slice(0, 10),
              }))
            }
          />
        </div>
      </div>

      {/* Nombre de lignes */}
      <div>
        <Label className="mb-2" htmlFor="lignes">
          Nombre de lignes à afficher
        </Label>
        <Input
          id="lignes"
          name="lignes"
          type="number"
          placeholder="Nombre de lignes"
          value={formData.lignes}
          onChange={handleChange}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="rounded-md bg-slate-900 text-white py-2 mt-4 self-center w-full"
      >
        Envoyer le scénario
      </Button>
    </form>
  );
}
