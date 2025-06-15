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
import { ScenarioStore } from "@/stores/scenario-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PartnerTable() {
  const data = ScenarioStore((s) => s.partnerData);
  const selectedPartner = ScenarioStore((s) => s.selectedPartner);
  const selectedMule = ScenarioStore((s) => s.selectedMule);
  const { setSelectedPartner } = ScenarioStore();

  const [page, setPage] = React.useState(1);
  const [filterByMule, setFilterByMule] = React.useState(false);
  const pageSize = 10;

  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (selectedPartner) {
      filtered = filtered.filter((p) => p.partner === selectedPartner);
    }
    if (filterByMule && selectedMule) {
      filtered = filtered.filter((p) => p.mule === selectedMule);
    }
    return filtered;
  }, [data, selectedPartner, filterByMule, selectedMule]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  function onSelectPartner(partnerId: string) {
    const newSelection = selectedPartner === partnerId ? null : partnerId;
    setSelectedPartner(newSelection);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mule Account</h2>
        <div className="flex items-center gap-4">
          {selectedPartner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSelectedPartner(null)}
            >
              Clear Partner Filter
            </Button>
          )}
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
        </div>
      </div>

      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table className="border-collapse border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-300">Mule</TableHead>
              <TableHead className="border border-gray-300">Partner</TableHead>
              <TableHead className="border border-gray-300">
                # Transactions
              </TableHead>
              <TableHead className="border border-gray-300">
                Total Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center border border-gray-300"
                >
                  No partners found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((partner) => {
                const isSelected = partner.partner === selectedPartner;
                return (
                  <TableRow
                    key={`${partner.mule}-${partner.partner}`}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                    onClick={() => onSelectPartner(partner.partner)}
                  >
                    <TableCell className="border border-gray-300">
                      {partner.mule}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {partner.partner}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {partner.transaction_count}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {partner.total_amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
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
