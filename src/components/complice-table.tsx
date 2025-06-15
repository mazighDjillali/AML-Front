"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

/* ---------- Types ---------- */
export interface BlacklistRow {
    reference: string;
    main_name: string;
    nationalities: string;
    birthday: string | null;
    reason_for_sanction: string;
}

interface CompliceTableProps {
    data: BlacklistRow[];
    itemsPerPage?: number;
}

/* ---------- Utils ---------- */
const countryNameToCode: Record<string, string> = {
    afghanistan: "af",
    france: "fr",
    algeria: "dz",
    tunisia: "tn",
    germany: "de",
    italy: "it",
    spain: "es",
    unitedstates: "us",
    canada: "ca",
};

const getFirstCountryCode = (nationalities: string | null | undefined) => {
    const safeValue = String(nationalities || "").trim();
    if (!safeValue) return "un";
    const first = safeValue.split(",")[0].toLowerCase().replace(/\s+/g, "");
    return countryNameToCode[first] || "un"; // fallback ONU
};

/* ---------- Component ---------- */
export function CompliceTable({ data, itemsPerPage = 8 }: CompliceTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [natFilter, setNatFilter] = useState("");
    const [page, setPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    /* ----- Filtering ----- */
    const filteredRows = useMemo(() => {
        return data.filter(row => {
            const matchesSearch =
                searchTerm === "" ||
                Object.values(row)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesNat =
                natFilter === "" ||
                row.nationalities.toLowerCase().includes(natFilter.toLowerCase());

            return matchesSearch && matchesNat;
        });
    }, [data, searchTerm, natFilter]);

    /* ----- Pagination ----- */
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

    // keep current page valid if filters change
    if (page > totalPages) setPage(totalPages);

    const paginatedRows = filteredRows.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const prevPage = () => setPage(p => Math.max(p - 1, 1));
    const nextPage = () => setPage(p => Math.min(p + 1, totalPages));

    /* ----- Helpers ----- */
    const toggleExpand = (ref: string) =>
        setExpandedRows(prev => ({ ...prev, [ref]: !prev[ref] }));

    /* ---------- JSX ---------- */
    return (
        <div className="border-t bg-white p-4  shadow-sm overflow-x-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Input
                    placeholder="Recherche globale"
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className="sm:w-1/3"
                />
                
            </div>

            {/* Table or empty message */}
            {filteredRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 border border-dashed rounded-md">
                    <p className="text-sm text-gray-700">Aucun résultat</p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Nom principal</TableHead>
                                <TableHead>Nationalités</TableHead>
                                <TableHead>Date de naissance</TableHead>
                                <TableHead>Motif de sanction</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map(row => {
                                const isExpanded = expandedRows[row.reference];
                                const content = row.reason_for_sanction;
                                const showToggle = content.length > 120; // show button only if long
                                return (
                                    <TableRow key={row.reference}>
                                        <TableCell className="font-medium">{row.reference}</TableCell>

                                        <TableCell className="flex items-center gap-2">
                                            <img
                                                src={`https://flagcdn.com/w40/${getFirstCountryCode(
                                                    row.nationalities
                                                )}.png`}
                                                alt="flag"
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                            {row.main_name}
                                        </TableCell>

                                        <TableCell>{row.nationalities || "—"}</TableCell>

                                        <TableCell>
                                            {row.birthday
                                                ? new Date(row.birthday).toLocaleDateString("fr-DZ")
                                                : "—"}
                                        </TableCell>

                                        <TableCell className="max-w-xs">
                                            <div
                                                className={`whitespace-pre-line break-words ${isExpanded ? "" : "line-clamp-2"
                                                    }`}
                                            >
                                                {content}
                                            </div>
                                            {showToggle && (
                                                <button
                                                    onClick={() => toggleExpand(row.reference)}
                                                    className="mt-1 text-blue-600 text-xs hover:underline"
                                                >
                                                    {isExpanded ? "Voir moins" : "Voir plus"}
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredRows.length > itemsPerPage && (
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <button
                                onClick={prevPage}
                                disabled={page === 1}
                                className="px-3 py-1 rounded-md border bg-gray-100 disabled:opacity-50"
                            >
                                Précédent
                            </button>
                            <span>
                                Page {page} / {totalPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={page === totalPages}
                                className="px-3 py-1 rounded-md border bg-gray-100 disabled:opacity-50"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
