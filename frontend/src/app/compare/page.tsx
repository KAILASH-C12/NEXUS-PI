"use client";

import { useState } from "react";
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { SAMPLE_PRODUCTS } from "@/lib/mock-data";
import { NexusApiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";

export default function CompareMatrixPage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useEnrichmentStore();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAiComparison = async () => {
    if (compareList.length < 2) {
      toast.error("Please add at least 2 products to compare");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await NexusApiClient.compareProducts(
        compareList.map((p) => p.input.part_number),
        compareList[0].input.brand
      );
      setAiAnalysis(res.ai_synthesis);
      toast.success("AI Differential Synthesis generated");
    } catch (e: any) {
      toast.error("Comparison analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSample = (prod: typeof SAMPLE_PRODUCTS[0]) => {
    addToCompare(prod);
    toast.info(`Added ${prod.input.part_number} to matrix`);
  };

  return (
    <div className="space-y-8 text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Autonomous Differential Comparison Matrix
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              Cross-SKU Delta
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Evaluate engineering specs, thermal ratings, fieldbus interfaces, and price tiers side-by-side
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="h-9 px-3 rounded-xl border border-[#d4d4d8] bg-white text-xs font-mono font-bold text-red-600 hover:border-red-400 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Matrix</span>
            </button>
          )}

          <button
            onClick={handleRunAiComparison}
            disabled={isAnalyzing || compareList.length < 2}
            className="h-9 px-5 rounded-xl bg-[#ff5500] hover:bg-[#e04b00] disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ff5500]/25 transition-all flex items-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isAnalyzing ? "Analyzing..." : "Generate AI Synthesis"}</span>
          </button>
        </div>
      </div>

      {/* Suggested SKUs to add if fewer than 2 */}
      {compareList.length < 2 && (
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 space-y-3 shadow-sm font-mono">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Add Sample SKUs to Compare Matrix:
          </h3>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRODUCTS.map((p) => (
              <button
                key={p.product_id}
                onClick={() => handleAddSample(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] text-xs text-[#111113] font-bold transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{p.input.brand} {p.input.part_number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Synthesis Box */}
      {aiAnalysis && (
        <div className="rounded-2xl border-2 border-[#111113] bg-white p-6 shadow-xl space-y-3 font-mono">
          <div className="flex items-center gap-2 text-[#ff5500]">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-sm font-black text-[#111113] uppercase tracking-wider">
              GPT-4o Differential Architectural Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-semibold">{aiAnalysis}</p>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      {compareList.length > 0 ? (
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-6 overflow-x-auto font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[700px]">
            {compareList.map((prod) => {
              const conf = Math.round((prod.quality_report?.overall_confidence || 0.95) * 100);
              return (
                <div
                  key={prod.product_id}
                  className="rounded-2xl border-2 border-[#d4d4d8] bg-slate-50/50 p-5 space-y-4 flex flex-col justify-between hover:border-[#ff5500] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-slate-200 text-slate-800 border-slate-300 text-xs font-bold">
                        {prod.input.brand}
                      </Badge>
                      <button
                        onClick={() => removeFromCompare(prod.product_id)}
                        className="text-slate-500 hover:text-red-600 text-xs font-bold"
                      >
                        Remove &times;
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#111113]">{prod.input.part_number}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-semibold">{prod.input.description}</p>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#d4d4d8] text-xs">
                      <span className="text-slate-600 font-bold">4D Confidence:</span>
                      <span className="text-emerald-700 font-extrabold">{conf}%</span>
                    </div>

                    {/* Spec List */}
                    <div className="space-y-2 pt-2 border-t border-[#d4d4d8] text-xs">
                      {prod.specifications.slice(0, 6).map((spec) => (
                        <div key={spec.attribute_name} className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-600 text-[11px] truncate max-w-[130px] font-medium">
                            {spec.attribute_name}:
                          </span>
                          <span className="font-bold text-[#111113] text-right">
                            {spec.value} {spec.unit || ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/results/${prod.product_id}`} className="pt-3">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs border-[#d4d4d8] text-[#111113] hover:border-[#ff5500] hover:text-[#ff5500] font-bold">
                      <span>Full Dossier</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#d4d4d8] bg-slate-50 space-y-3 font-mono">
          <GitCompare className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No products selected for comparison</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add products from the Enrichment Studio, Batch Pipeline, or click quick-add presets above.
          </p>
        </div>
      )}
    </div>
  );
}
