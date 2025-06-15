"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScenarioStore } from "@/stores/scenario-store";

type MoleStats = {
  moles_percode_stat: Record<string, number>;
  mole_account_most_appearances: string;
  nb_rcv: number;
};

export function WhackamoleTable() {
  const data = ScenarioStore((s) => s.moleData);
  const [stats, setStats] = React.useState<MoleStats | null>(null);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const pageCount = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);

  // 📡 Appel API une fois au montage
  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/scenario-stats-mole/") // Remplace avec ton vrai endpoint
      .then((res) => res.json())
      .then((json: MoleStats) => setStats(json))
      .catch((err) => console.error("Erreur API Mole Stats:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Whack-A-Mole Suspects</h2>

      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Transactions by Postal Code */}
        <div className="bg-white p-3 rounded-2xl shadow-md border text-center">
          <p className="text-sm text-blue-700 uppercase font-medium mb-1">
            Transactions by Postal Code
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats
              ? Object.values(stats.moles_percode_stat).reduce(
                  (sum, val) => sum + val,
                  0,
                )
              : "—"}
          </p>
          <p className="text-xs text-blue-900 mt-1">
            Total distributed by postal code areas
          </p>
        </div>

        {/* Detected Receivers */}
        <div className="bg-white p-3 rounded-2xl shadow-md border text-center">
          <p className="text-sm text-blue-700 uppercase font-medium mb-1">
            Detected Receivers
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats ? stats.nb_rcv : "—"}
          </p>
          <p className="text-xs text-blue-900 mt-1">
            Receiver accounts identified in the flows
          </p>
        </div>

        {/* Top Receiver Account */}
        <div className="bg-white p-3 rounded-2xl shadow-md border text-center">
          <p className="text-sm text-blue-700 uppercase font-medium mb-1">
            Top Receiver Account – Fraud Transactions
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats
              ? `****${stats.mole_account_most_appearances.slice(-4)}`
              : "—"}
          </p>
          <p className="text-xs text-blue-900 mt-1">
            Account with the highest number of received transactions
          </p>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-auto border border-gray-300 rounded-md p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border">Account</TableHead>
              <TableHead className="border">Destination</TableHead>
              <TableHead className="border">Operation Date</TableHead>
              <TableHead className="border">Code</TableHead>
              <TableHead className="border">Amount</TableHead>
              <TableHead className="border">Old Balance</TableHead>
              <TableHead className="border">New Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No suspects found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((op, idx) => (
                <TableRow key={idx}>
                  <TableCell className="border">{op.account_number}</TableCell>
                  <TableCell className="border">
                    {op.destination_account}
                  </TableCell>
                  <TableCell className="border">{op.operation_date}</TableCell>
                  <TableCell className="border">{op.code || "-"}</TableCell>
                  <TableCell className="border">
                    {Number(op.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="border">
                    {Number(op.old_balance).toFixed(2)}
                  </TableCell>
                  <TableCell className="border">
                    {Number(op.new_balance).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {pageCount}
        </div>
        <div className="space-x-2">
          <button
            className="border px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            className="border px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page >= pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
