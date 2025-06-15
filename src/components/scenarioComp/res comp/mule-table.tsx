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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScenarioStore } from "@/stores/scenario-store";
import { ArrowRightIcon } from "lucide-react";

export function MuleTable() {
  const data = ScenarioStore((s) => s.fraudData);
  //console.log("Mule data: ", data);
  const { setSelectedMule } = ScenarioStore();

  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const [filterFanOut, setFilterFanOut] = React.useState<boolean | null>(null);
  const [filterFanIn, setFilterFanIn] = React.useState<boolean | null>(null);

  const [selectedMuleId, setSelectedMuleId] = React.useState<string | null>(
    null,
  );

  const filteredData = React.useMemo(() => {
    return data.filter((mule) => {
      if (filterFanOut !== null && mule.is_fan_out !== filterFanOut)
        return false;
      if (filterFanIn !== null && mule.is_fan_in !== filterFanIn) return false;
      return true;
    });
  }, [data, filterFanOut, filterFanIn]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  function onSelectMule(muleId: string) {
    const newSelection = selectedMuleId === muleId ? null : muleId;
    setSelectedMuleId(newSelection);
    setSelectedMule(newSelection);
  }

  function clearFilters() {
    setFilterFanOut(null);
    setFilterFanIn(null);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fraud Accounts</h2>

      {/* Faceted Filters */}
      <div className="flex space-x-6 mb-4 items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="filter-fanout" className="font-medium">
            Fan-out:
          </label>
          <Select
            value={filterFanOut === null ? "all" : filterFanOut ? "yes" : "no"}
            onValueChange={(val) => {
              if (val === "all") setFilterFanOut(null);
              else setFilterFanOut(val === "yes");
            }}
            id="filter-fanout"
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="filter-fanin" className="font-medium">
            Fan-in:
          </label>
          <Select
            value={filterFanIn === null ? "all" : filterFanIn ? "yes" : "no"}
            onValueChange={(val) => {
              if (val === "all") setFilterFanIn(null);
              else setFilterFanIn(val === "yes");
            }}
            id="filter-fanin"
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Table with borders */}
      <div className="overflow-auto border border-gray-300 rounded-md">
        <Table className="border-collapse border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-300">
                Mule Account
              </TableHead>

              {/* Fan-out */}
              <TableHead className="border border-gray-300 ">
                <div className="flex flex-row">
                  1<ArrowRightIcon />N
                </div>
              </TableHead>
              {/* Fan-in */}
              <TableHead className="border border-gray-300">
                <div className="flex flex-row">
                  N<ArrowRightIcon />1
                </div>
              </TableHead>
              <TableHead className="border border-gray-300">
                Total Sent
              </TableHead>
              <TableHead className="border border-gray-300">
                Total Received
              </TableHead>
              <TableHead className="border border-gray-300">Balance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center border border-gray-300"
                >
                  No mules found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((mule) => {
                const isSelected = mule.mule === selectedMuleId;
                return (
                  <TableRow
                    key={mule.mule}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                    onClick={() => onSelectMule(mule.mule)}
                  >
                    <TableCell className="border border-gray-300">
                      {mule.mule}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {mule.is_fan_out ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {mule.is_fan_in ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {mule.total_sent.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {mule.total_received.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {mule.balance.toFixed(2)}
                    </TableCell>
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
