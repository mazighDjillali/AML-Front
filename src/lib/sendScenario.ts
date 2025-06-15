// src/lib/sendScenario.ts
import { ENDPOINT_SCENARIO } from "@/lib/constants";

export async function sendAnomalyScenario(payload: unknown) {
  try {
    const response = await fetch(ENDPOINT_SCENARIO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();          // { task_id, status, scenario, toast }
  } catch (err) {
    console.error("Error sending anomaly scenario:", err);
    throw err;
  }
}
