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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScenarioStore } from "@/stores/scenario-store";

export function AnomalyTable() {
  const data = ScenarioStore((s) => s.anomalyData);

  const [riskFilter, setRiskFilter] = React.useState<string>("all");
  const [accountSearch, setAccountSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState(accountSearch);
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  const [stats, setStats] = React.useState({
    ratio_stat: 0,
    inactif_stat_count: 0,
    nocturn_stat_count: 0,
  });

  // Fetch anomaly stats for the cards
  React.useEffect(() => {
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

  // Debounce logic
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(accountSearch);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [accountSearch]);

  // Reset pagination on filter
  React.useEffect(() => {
    setPage(1);
  }, [riskFilter]);

  // Filter logic
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesRisk =
        riskFilter === "all" ||
        item.risk_label.toLowerCase() === riskFilter.toLowerCase();
      const matchesAccount =
        debouncedSearch === "" ||
        item.account_number
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      return matchesRisk && matchesAccount;
    });
  }, [data, riskFilter, debouncedSearch]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const pagedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Anomalies</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

      {/* Filters */}
      <div className="flex space-x-6 mb-4 items-end p-6">
        <div className="flex flex-col space-y-1">
          <label htmlFor="risk-filter" className="font-medium">
            Risk Level
          </label>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="account-search" className="font-medium">
            Account Number
          </label>
          <Input
            id="account-search"
            placeholder="Search account"
            value={accountSearch}
            onChange={(e) => setAccountSearch(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setRiskFilter("all");
            setAccountSearch("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hour</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No anomalies found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((item, index) => {
                const dateObj = new Date(item.operation_date);
                const hour = dateObj.getHours();

                return (
                  <TableRow key={`page-${page}-index-${index}`}>
                    <TableCell>{item.account_number}</TableCell>
                    <TableCell>
                      {dateObj.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {isNaN(hour)
                        ? "—"
                        : `${hour.toString().padStart(2, "0")}:00`}
                    </TableCell>
                    <TableCell>
                      {item.amount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      }) ?? "—"}
                    </TableCell>
                    <TableCell>{item.risk_label}</TableCell>
                    <TableCell>{item.anomaly_reason_summary}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {pageCount} — {filteredData.length} items
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
