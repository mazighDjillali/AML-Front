import React, { useState, useEffect } from "react";
import { ScenarioStore } from "@/stores/scenario-store";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

type FlaggedAccount = {
  account: string;
  flagged_states: string[];
  flag_count: number;
};

type Stats = {
  most_frequent_ccp: string;
  max_total_mtop: number;
};

const ROWS_PER_PAGE = 10;

export function FlaggedAccountsTable() {
  const { selectedAccount, selectedTransaction, setSelectedAccount } =
    ScenarioStore();

  const flaggedAccounts = ScenarioStore((s) => s.flaggedAccounts);
  const flaggedTransactions = ScenarioStore((s) => s.flaggedTransactions);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterByTransactionAccount, setFilterByTransactionAccount] =
    useState(false);
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/scenario-stats-geo/") // Remplace par ton vrai endpoint
      .then((res) => res.json())
      .then((data: Stats) => setStats(data))
      .catch((err) => console.error("Erreur API stats:", err));
  }, []);

  // ✅ Vérification explicite que selectedTransaction est un index valide
  const selectedTxAccounts =
    typeof selectedTransaction === "number" &&
    flaggedTransactions[selectedTransaction]
      ? [
          flaggedTransactions[selectedTransaction].account_number,
          flaggedTransactions[selectedTransaction].destination_account,
        ]
      : [];

  const filteredData = flaggedAccounts.filter((acc) => {
    if (searchTerm && !acc.account.includes(searchTerm)) return false;

    if (filterByTransactionAccount && selectedTxAccounts.length > 0) {
      return selectedTxAccounts.includes(acc.account);
    }

    return true;
  });

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIdx = (page - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIdx, startIdx + ROWS_PER_PAGE);

  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterByTransactionAccount, selectedTransaction]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Flagged Accounts</h2>

      {/* 🟦 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Max Transactions – Wilaya */}
        <div className="bg-white p-3 rounded-2xl shadow-md border text-blue-700 text-center">
          <p className="text-sm text-blue-700 uppercase font-medium mb-1">
            Max Transactions – Wilaya Frauduleuse
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats ? stats.most_frequent_ccp : "—"}
          </p>
          <p className="text-xs text-blue-900 mt-1">
            Plus haut nombre de transactions suspectes
          </p>
        </div>

        {/* Max Montant – Wilaya */}
        <div className="bg-white p-3 rounded-2xl shadow-md border text-blue-700 text-center">
          <p className="text-sm text-blue-700 uppercase font-medium mb-1">
            Max Montant – Wilaya Frauduleuse
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats
              ? `${stats.max_total_mtop.toLocaleString("fr-DZ")} DZD`
              : "—"}
          </p>
          <p className="text-xs text-blue-900 mt-1">
            Montant le plus élevé détecté
          </p>
        </div>
      </div>

      {/* 🔍 Search & Filter */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Account"
          className="border border-gray-300 rounded px-3 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterByTransactionAccount}
            onChange={() => setFilterByTransactionAccount((v) => !v)}
            className="w-5 h-5"
          />
          <span>Filter by Selected Transaction Accounts</span>
        </label>
      </div>

      {/* 📋 Table */}
      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Flagged States</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No accounts found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((acc) => {
                const isSelected = selectedAccount === acc.account;
                return (
                  <TableRow
                    key={acc.account}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                    onClick={() =>
                      setSelectedAccount(isSelected ? null : acc.account)
                    }
                  >
                    <TableCell>{acc.account}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {acc.flagged_states.map((state, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                          >
                            {state}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{acc.flag_count}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔄 Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
