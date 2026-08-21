"use client";

import { useState } from "react";
import { ScoredAttribute } from "@/lib/types";
import {
  Search,
  Download,
  Copy,
  Check,
  Filter,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export function SpecsTable({
  specifications,
  partNumber = "Product",
}: {
  specifications: ScoredAttribute[];
  partNumber?: string;
}) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = specifications.filter(
    (s) =>
      s.attribute_name.toLowerCase().includes(search.toLowerCase()) ||
      s.value.toLowerCase().includes(search.toLowerCase())
  );

  const copyAsJson = () => {
    const map: Record<string, any> = {};
    specifications.forEach((s) => {
      map[s.attribute_name] = {
        value: s.value,
        unit: s.unit,
        confidence: s.confidence?.overall || 0.95,
      };
    });
    navigator.clipboard.writeText(JSON.stringify(map, null, 2));
    setCopied(true);
    toast.success("Specifications copied to clipboard as JSON");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const rows = [
      ["Attribute Name", "Value", "Unit", "Overall Confidence", "Sources Count"],
      ...specifications.map((s) => [
        s.attribute_name,
        `"${s.value}"`,
        s.unit || "",
        s.confidence?.overall || "0.95",
        s.provenance.length,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${partNumber}_specs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Specifications exported as CSV");
  };

  return (
    <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4 font-mono text-[#111113]">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter specifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-[#d4d4d8] bg-slate-50 pl-8 pr-3 text-xs text-[#111113] placeholder:text-slate-500 focus:border-[#ff5500] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAsJson}
            className="h-8 px-3 border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] text-xs font-bold text-slate-800 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            <span>Copy JSON</span>
          </button>

          <button
            onClick={exportCsv}
            className="h-8 px-3 border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] text-xs font-bold text-slate-800 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="rounded-xl border border-[#d4d4d8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] tracking-wider border-b border-[#d4d4d8] font-bold">
              <tr>
                <th className="py-2.5 px-4">Attribute Key</th>
                <th className="py-2.5 px-4">Extracted Value</th>
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-4 text-center">4D Confidence</th>
                <th className="py-2.5 px-4 text-right">Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((spec) => {
                const conf = spec.confidence?.overall || 0.95;
                const confPercent = Math.round(conf * 100);

                return (
                  <tr key={spec.attribute_name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#111113]">
                      {spec.attribute_name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-semibold">
                      {spec.value}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-semibold">
                      {spec.unit || "—"}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <Tooltip>
                        <TooltipTrigger>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold cursor-help ${
                              confPercent >= 90
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : confPercent >= 75
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {confPercent}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-white text-xs p-3 space-y-1">
                          <p className="font-bold text-[#ff5500] mb-1">4D Confidence Breakdown</p>
                          <div className="text-slate-300 flex justify-between gap-4">
                            <span>Source Reliability:</span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round((spec.confidence?.source_reliability || 0.95) * 100)}%</span>
                          </div>
                          <div className="text-slate-300 flex justify-between gap-4">
                            <span>Cross-Reference:</span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round((spec.confidence?.cross_reference || 0.92) * 100)}%</span>
                          </div>
                          <div className="text-slate-300 flex justify-between gap-4">
                            <span>Ontology Match:</span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round((spec.confidence?.ontology_consistency || 0.96) * 100)}%</span>
                          </div>
                          <div className="text-slate-300 flex justify-between gap-4">
                            <span>Temporal Freshness:</span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round((spec.confidence?.temporal_freshness || 0.90) * 100)}%</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600 text-[11px] font-semibold">
                      {spec.provenance.length} Source{spec.provenance.length > 1 ? "s" : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
