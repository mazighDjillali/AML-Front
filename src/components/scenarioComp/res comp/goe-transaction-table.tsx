import { useState, useEffect } from "react";
import { ScenarioStore } from "@/stores/scenario-store";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
const ROWS_PER_PAGE = 10;

export function FlaggedTransactionsTable() {
  const { selectedAccount, selectedTransaction, setSelectedTransaction } =
    ScenarioStore();
  const data = ScenarioStore((s) => s.flaggedTransactions);

  // Local state for search and toggle filter and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBySelectedAccount, setFilterBySelectedAccount] = useState(true);
  const [page, setPage] = useState(1);

  // Filter transactions
  const filteredData = data.filter((tx) => {
    // If filtering by selectedAccount is active, filter accordingly
    if (filterBySelectedAccount && selectedAccount) {
      if (
        tx.account_number !== selectedAccount &&
        tx.destination_account !== selectedAccount
      ) {
        return false;
      }
    }

    // Apply search term filter (case insensitive)
    if (searchTerm.trim() === "") return true;
    const search = searchTerm.toLowerCase();
    return (
      tx.account_number.toLowerCase().includes(search) ||
      tx.destination_account.toLowerCase().includes(search)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIdx = (page - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIdx, startIdx + ROWS_PER_PAGE);

  // Change page with bounds checking
  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  // Reset page on filter/search change to avoid invalid page number
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterBySelectedAccount, selectedAccount]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Flagged Transactions</h2>
      

      {/* Controls: Search and Toggle */}
      <div className="mb-4 flex items-center space-x-4">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by Account or Destination"
          className="border border-gray-300 rounded px-3 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Toggle switch */}
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterBySelectedAccount}
            onChange={() => setFilterBySelectedAccount((v) => !v)}
            className="w-5 h-5"
          />
          <span>
            Filter by Selected Account{" "}
            {selectedAccount && `: [${selectedAccount}]`}
          </span>
        </label>
      </div>

      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>States</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((tx, index) => {
                // Use global index in data for selection to avoid conflicts across pages
                const globalIndex = startIdx + index;
                const isSelected = selectedTransaction === globalIndex;
                return (
                  <TableRow
                    key={globalIndex}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                    onClick={() =>
                      setSelectedTransaction(isSelected ? null : globalIndex)
                    }
                  >
                    <TableCell>{tx.account_number}</TableCell>
                    <TableCell>{tx.destination_account}</TableCell>
                    <TableCell>{tx.operation_date}</TableCell>
                    <TableCell>{tx.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tx.flagged_states.map((state, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
                          >
                            {state}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
