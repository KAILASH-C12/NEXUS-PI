"use client";

import { TaxonomyClassification } from "@/lib/types";
import { Tag, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TaxonomyCard({
  taxonomy,
}: {
  taxonomy: TaxonomyClassification;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4 font-mono text-[#111113]">
      <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5500]/10 text-[#ff5500]">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111113] uppercase">Taxonomy &amp; Standard Classification</h3>
            <p className="text-xs text-slate-600">UNSPSC v26 and eCl@ss 14.0 automated categorization</p>
          </div>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold">
          Mapped
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* UNSPSC */}
        <div className="rounded-xl border border-[#d4d4d8] bg-slate-50 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              UNSPSC Code
            </span>
            <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-800 border-blue-200 font-bold">
              {taxonomy.unspsc_code || "32151705"}
            </Badge>
          </div>
          <p className="text-xs font-bold text-[#111113]">
            {taxonomy.unspsc_description || "Programmable logic controllers PLC"}
          </p>
          <span className="text-[10px] text-slate-500 font-semibold block">Segment 32 / Family 15 / Class 17</span>
        </div>

        {/* eCl@ss */}
        <div className="rounded-xl border border-[#d4d4d8] bg-slate-50 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              eCl@ss 14.0 Code
            </span>
            <Badge variant="secondary" className="text-[10px] bg-indigo-100 text-indigo-800 border-indigo-200 font-bold">
              {taxonomy.eclass_code || "27-24-22-07"}
            </Badge>
          </div>
          <p className="text-xs font-bold text-[#111113]">
            {taxonomy.eclass_description || "PLC central processing unit"}
          </p>
          <span className="text-[10px] text-slate-500 font-semibold block">Domain 27 / Group 24 / Subgroup 22</span>
        </div>
      </div>
    </div>
  );
}
