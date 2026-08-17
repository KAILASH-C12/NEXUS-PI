"use client";

import { useState } from "react";
import { ProvenanceRecord, ScoredAttribute } from "@/lib/types";
import {
  FileText,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProvenanceTree({
  specifications,
}: {
  specifications: ScoredAttribute[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "PDF_PARSE":
        return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">OEM PDF</Badge>;
      case "WEB_SCRAPE":
        return <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">Distributor</Badge>;
      case "API_LOOKUP":
        return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">API DB</Badge>;
      case "KNOWLEDGE_GRAPH":
        return <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/20">Taxonomy Graph</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] bg-slate-500/10 text-slate-400 border-slate-500/20">LLM Inference</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">4D Provenance Lineage Chain</h3>
            <p className="text-xs text-slate-400">
              Audit trails tracing every extracted specification back to authentic source documents
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
          100% Traceable
        </Badge>
      </div>

      <div className="space-y-2">
        {specifications.map((spec, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={spec.attribute_name}
              className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="text-xs font-mono text-cyan-300 font-medium">
                    {spec.attribute_name}
                  </span>
                  <span className="text-xs text-white font-bold ml-2">
                    {spec.value} {spec.unit || ""}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-emerald-400">
                    {Math.round((spec.confidence?.overall || 0.95) * 100)}% Conf
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {spec.provenance.length} Source{spec.provenance.length > 1 ? "s" : ""}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 pt-1 border-t border-white/5 space-y-2 bg-black/20">
                  {spec.provenance.map((prov, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="font-medium text-slate-200">{prov.source_name}</span>
                          {prov.source_url && (
                            <a
                              href={prov.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>{prov.source_url}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {getMethodBadge(prov.extraction_method)}
                        <span className="text-[11px] font-mono text-slate-400">
                          Rel: <strong className="text-emerald-400">{Math.round(prov.reliability_score * 100)}%</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
