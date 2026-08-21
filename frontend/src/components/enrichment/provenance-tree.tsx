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
        return <Badge className="text-[10px] bg-red-100 text-red-800 border-red-200 font-bold">OEM PDF</Badge>;
      case "WEB_SCRAPE":
        return <Badge className="text-[10px] bg-blue-100 text-blue-800 border-blue-200 font-bold">Distributor</Badge>;
      case "API_LOOKUP":
        return <Badge className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-200 font-bold">API DB</Badge>;
      case "KNOWLEDGE_GRAPH":
        return <Badge className="text-[10px] bg-violet-100 text-violet-800 border-violet-200 font-bold">Taxonomy Graph</Badge>;
      default:
        return <Badge className="text-[10px] bg-slate-100 text-slate-800 border-slate-200 font-bold">LLM Inference</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4 font-mono text-[#111113]">
      <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111113] uppercase">4D Provenance Lineage Chain</h3>
            <p className="text-xs text-slate-600">
              Audit trails tracing every extracted specification back to authentic source documents
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-300 bg-emerald-50 font-bold">
          100% Traceable
        </Badge>
      </div>

      <div className="space-y-2">
        {specifications.map((spec, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={spec.attribute_name}
              className="rounded-xl border border-[#d4d4d8] bg-slate-50/70 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-[#ff5500]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#111113]">
                      {spec.attribute_name}
                    </span>
                    <span className="text-xs text-slate-600 ml-2 font-semibold">
                      = {spec.value} {spec.unit || ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] bg-white text-slate-700 border border-[#d4d4d8] font-bold">
                    {spec.provenance.length} Source{spec.provenance.length > 1 ? "s" : ""}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-700">
                    {Math.round((spec.confidence?.overall || 0.95) * 100)}%
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 bg-white border-t border-[#d4d4d8] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Source Document Citations:
                  </span>
                  <div className="space-y-2">
                    {spec.provenance.map((prov, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-lg bg-slate-50 border border-[#d4d4d8] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#111113] flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-[#ff5500]" />
                            {prov.source_name}
                          </span>
                          {getMethodBadge(prov.extraction_method)}
                        </div>

                        {prov.raw_snippet && (
                          <div className="p-2 rounded bg-white border border-[#d4d4d8] text-[11px] text-slate-700 italic font-mono">
                            &ldquo;{prov.raw_snippet}&rdquo;
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Confidence Weight: <strong className="text-slate-800">{prov.reliability_score * 100}%</strong></span>
                          <span>Timestamp: {new Date(prov.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
