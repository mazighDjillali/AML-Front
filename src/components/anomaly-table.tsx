import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { Input } from "./ui/input"


const ITEMS_PER_PAGE = 14

export function AnomalyTable({ data }: { data: any[] }) {
    const [page, setPage] = useState(1)
    const [accountFilter, setAccountFilter] = useState("")
    const [riskFilter, setRiskFilter] = useState("")

    // Apply filters
    const filteredRows = data.filter((row) => {
        const matchesAccount =
            accountFilter === "" ||
            row.account_number?.toString().toLowerCase().includes(accountFilter.toLowerCase());
        const matchesRisk =
            riskFilter === "" ||
            row.risk_score?.toString().includes(riskFilter);

        return matchesAccount && matchesRisk;
    });


    const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE)
    const paginatedRows = filteredRows.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

    return (
        <div className="rounded-xl  border  bg-white p-4 shadow-md overflow-x-auto">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input
                    placeholder="Filter by Account ID"
                    value={accountFilter}
                    onChange={(e) => {
                        setAccountFilter(e.target.value)
                        setPage(1)
                    }}
                    className="sm:w-1/10"
                />
                <Input
                    placeholder="Filter by Risk "
                    value={riskFilter}
                    onChange={(e) => {
                        setRiskFilter(e.target.value)
                        setPage(1)
                    }}
                    className="sm:w-1/10"
                    type="number"
                />
            </div>
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
                    {paginatedRows.map((row, i) => {
                        const date = new Date(row.operation_date);
                        const formattedDate = date.toISOString().split("T")[0];
                        const formattedTime = date.toTimeString().split(" ")[0];

                        return (
                            <TableRow key={i}>
                                <TableCell>{row.account_number}</TableCell>
                                <TableCell>{formattedDate}</TableCell>
                                <TableCell>{formattedTime}</TableCell>
                                <TableCell>{row.amount?.toFixed(2)} DZD</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={row.risk_score} className="w-24 h-2" />
                                        <span className="text-xs">{row.risk_score}/100</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {row.risk_label}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {data.length === 0 && (
                        <p className="text-center text-sm text-gray-500 mb-4">
                            Aucune anomalie à afficher.
                        </p>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4 text-sm">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
