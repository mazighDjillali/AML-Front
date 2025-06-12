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

export function RiskTable() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Alerts</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
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
                <Badge variant="outline" className="text-xs">{row.status}</Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">{row.created}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
