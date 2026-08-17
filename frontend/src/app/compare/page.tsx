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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Autonomous Differential Comparison Matrix
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              Cross-SKU Delta
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate engineering specs, thermal ratings, fieldbus interfaces, and price tiers side-by-side
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="border-white/10 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3 mr-1.5" />
              <span>Clear Matrix</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleRunAiComparison}
            disabled={isAnalyzing || compareList.length < 2}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span>Generate AI Synthesis</span>
          </Button>
        </div>
      </div>

      {/* Suggested SKUs to add if fewer than 2 */}
      {compareList.length < 2 && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            Quick Add Sample SKUs to Compare Matrix:
          </h3>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRODUCTS.map((p) => (
              <button
                key={p.product_id}
                onClick={() => handleAddSample(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-cyan-500/20 hover:border-cyan-500/40 text-xs text-white font-mono transition-all"
              >
                <Plus className="h-3.5 w-3.5 text-cyan-400" />
                <span>{p.input.brand} {p.input.part_number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Synthesis Box */}
      {aiAnalysis && (
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-indigo-950/40 p-6 backdrop-blur-xl shadow-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              GPT-4o Differential Architectural Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{aiAnalysis}</p>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      {compareList.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-6 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[700px]">
            {compareList.map((prod) => {
              const conf = Math.round((prod.quality_report?.overall_confidence || 0.95) * 100);
              return (
                <div
                  key={prod.product_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-white/5 text-slate-300 border-white/10 text-xs">
                        {prod.input.brand}
                      </Badge>
                      <button
                        onClick={() => removeFromCompare(prod.product_id)}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        Remove &times;
                      </button>
                    </div>

                    <div>
                      <h3 className="font-mono text-base font-bold text-white">{prod.input.part_number}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prod.input.description}</p>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs font-mono">
                      <span className="text-slate-400">4D Confidence:</span>
                      <span className="text-emerald-400 font-bold">{conf}%</span>
                    </div>

                    {/* Spec List */}
                    <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                      {prod.specifications.slice(0, 6).map((spec) => (
                        <div key={spec.attribute_name} className="flex justify-between items-center py-1 border-b border-white/[0.02]">
                          <span className="text-slate-400 font-mono text-[11px] truncate max-w-[120px]">
                            {spec.attribute_name}:
                          </span>
                          <span className="font-semibold text-white text-right">
                            {spec.value} {spec.unit || ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/results/${prod.product_id}`} className="pt-3">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs border-white/10 text-cyan-300">
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
        <div className="text-center py-16 rounded-2xl border border-white/10 bg-[#0c1222]/40 space-y-3">
          <GitCompare className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No products selected for comparison</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add products from the Enrichment Studio, Batch Pipeline, or click quick-add presets above.
          </p>
        </div>
      )}
    </div>
  );
}
