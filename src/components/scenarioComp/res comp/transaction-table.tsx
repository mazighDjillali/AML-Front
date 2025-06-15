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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScenarioStore } from "@/stores/scenario-store";

export function TransactionTable() {
  const data = ScenarioStore((s) => s.transactionRecord); // Assumes your store exposes this
  const selectedPartner = ScenarioStore((s) => s.selectedPartner);
  const selectedMule = ScenarioStore((s) => s.selectedMule);

  const [page, setPage] = React.useState(1);
  const [filterByMule, setFilterByMule] = React.useState(true);
  const [filterByPartner, setFilterByPartner] = React.useState(false);
  const pageSize = 10;

  const filteredData = React.useMemo(() => {
    return data.filter((txn) => {
      const muleMatch = !filterByMule || txn.account_number === selectedMule;
      const partnerMatch =
        !filterByPartner || txn.destination_account === selectedPartner;
      return muleMatch && partnerMatch;
    });
  }, [data, filterByMule, filterByPartner, selectedMule, selectedPartner]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="filter-mule"
              checked={filterByMule}
              onCheckedChange={setFilterByMule}
            />
            <Label htmlFor="filter-mule">
              Filter by Fraud account{" "}
              {filterByMule && selectedMule && `(${selectedMule})`}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="filter-partner"
              checked={filterByPartner}
              onCheckedChange={setFilterByPartner}
            />
            <Label htmlFor="filter-partner">
              Filter by Partner{" "}
              {filterByPartner && selectedPartner && `(${selectedPartner})`}
            </Label>
          </div>
        </div>
      </div>

      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table className="border-collapse border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-300">Sender</TableHead>
              <TableHead className="border border-gray-300">Receiver</TableHead>
              <TableHead className="border border-gray-300">Amount</TableHead>
              <TableHead className="border border-gray-300">Date</TableHead>
              <TableHead className="border border-gray-300">Time</TableHead>
              <TableHead className="border border-gray-300">
                Direction
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center border border-gray-300"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((txn, index) => (
                <TableRow key={`${txn.timestamp}-${index}`}>
                  <TableCell className="border border-gray-300">
                    {txn.account_number}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {txn.destination_account}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {txn.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {txn.operation_date}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {txn.operation_time}
                  </TableCell>
                  <TableCell className="border border-gray-300 capitalize">
                    {txn.direction.replace("_", " ")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {pageCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page >= pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
