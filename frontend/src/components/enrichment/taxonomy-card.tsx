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
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Taxonomy & Standard Classification</h3>
            <p className="text-xs text-slate-400">UNSPSC v26 and eCl@ss 14.0 automated categorization</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
          Mapped
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* UNSPSC */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              UNSPSC Code
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
              {taxonomy.unspsc_code || "32151705"}
            </Badge>
          </div>
          <p className="text-xs font-medium text-white">
            {taxonomy.unspsc_description || "Programmable logic controllers PLC"}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block">Segment 32 / Family 15 / Class 17</span>
        </div>

        {/* eCl@ss */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              eCl@ss 14.0 Code
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
              {taxonomy.eclass_code || "27-24-22-07"}
            </Badge>
          </div>
          <p className="text-xs font-medium text-white">
            {taxonomy.eclass_description || "PLC central processing unit"}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block">Domain 27 / Group 24 / Subgroup 22</span>
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.01] border border-white/5 p-3 flex items-center justify-between text-xs">
        <span className="text-slate-400">Primary Product Category:</span>
        <span className="font-semibold text-cyan-300">{taxonomy.product_category}</span>
      </div>
    </div>
  );
}
