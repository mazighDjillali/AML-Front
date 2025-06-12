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

const rows = [
    {
        id: "CASE-3",
        risk: 100,
        alerts: "Attention! Your performance...",
        assignee: { name: "Precious Owuda", image: "/avatars/1.png" },
        status: "Analyze",
        created: "3 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    {
        id: "CASE-6",
        risk: 97,
        alerts: "Great job! You’ve completed...",
        assignee: { name: "Amira Johnson", image: "/avatars/2.png" },
        status: "Analyze",
        created: "2 days ago",
    },
    // Add more cases as needed...
]
const ITEMS_PER_PAGE = 8

export function AnomalyTable() {
    const [page, setPage] = useState(1)
    const [accountFilter, setAccountFilter] = useState("")
    const [riskFilter, setRiskFilter] = useState("")

    // Apply filters
    const filteredRows = rows.filter((row) => {
        const matchesAccount =
            accountFilter === "" || row.id.toLowerCase().includes(accountFilter.toLowerCase())
        const matchesRisk =
            riskFilter === "" || row.risk.toString().includes(riskFilter)
        return matchesAccount && matchesRisk
    })

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
                    className="sm:w-1/2"
                />
                <Input
                    placeholder="Filter by Risk (e.g. 97)"
                    value={riskFilter}
                    onChange={(e) => {
                        setRiskFilter(e.target.value)
                        setPage(1)
                    }}
                    className="sm:w-1/2"
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
                    {paginatedRows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{row.id}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={row.risk} className="w-24 h-2" />
                                    <span className="text-xs">{row.risk}/100</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm line-clamp-1">{row.alerts}</span>
                                    <span className="text-xs text-gray-500">6 more</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={row.assignee.image} />
                                        <AvatarFallback>{row.assignee.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{row.assignee.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-xs">
                                    {row.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                                {row.created}
                            </TableCell>
                        </TableRow>
                    ))}
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
