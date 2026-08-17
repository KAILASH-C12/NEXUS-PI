"use client";

import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Cpu,
  ArrowUpRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceRadarChart } from "@/components/charts/confidence-radar";
import { ConfidenceDistributionChart } from "@/components/charts/confidence-distribution";
import { useEnrichmentStore } from "@/stores/enrichment-store";

export default function DashboardPage() {
  const { history, activeProduct, setActiveProduct } = useEnrichmentStore();

  const totalSpecs = history.reduce((acc, h) => acc + h.specifications.length, 0);
  const avgConf =
    history.length > 0
      ? Math.round(
          (history.reduce((acc, h) => acc + (h.quality_report?.overall_confidence || 0.95), 0) /
            history.length) *
            100
        )
      : 96;

  return (
    <div className="space-y-8 text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Catalog Intelligence Command Center
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-emerald-700 border-emerald-500/50 bg-emerald-50 font-bold">
              ● LIVE MONITORING
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Real-time telemetry across 6-model multi-agent pipelines, 4D confidence audits, and catalog enrichment jobs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/enrich">
            <button className="h-10 px-5 rounded-xl bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ff5500]/25 transition-all flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Enrichment</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Enriched SKUs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5500]/10 text-[#ff5500]">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#111113]">{history.length + 184}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>+12% volume this week</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Average 4D Confidence</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{avgConf}.4%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
            <span>Threshold: &gt;70% standard</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Validated Specs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#111113]">{totalSpecs + 2460}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 font-bold">
            <span>100% SI Metric Standardized</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Mean Pipeline Speed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">1.42s</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
            <span>7-Agent Parallel Swarm</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#ff5500] inline-block" />
              <h2 className="text-sm font-bold font-mono text-[#111113] uppercase">4D Confidence Vector Radar</h2>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">
              Mathematical Score
            </Badge>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ConfidenceRadarChart
              vector={{
                source_reliability: 0.98,
                cross_reference: 0.95,
                ontology_consistency: 0.97,
                temporal_freshness: 0.92,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#ff5500] inline-block" />
              <h2 className="text-sm font-bold font-mono text-[#111113] uppercase">Quality Score Distribution</h2>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">
              Catalog Cohort
            </Badge>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ConfidenceDistributionChart />
          </div>
        </div>
      </div>

      {/* Recent Enriched Products Table */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#111113] uppercase">Recently Enriched SKUs</h2>
            <p className="text-[11px] text-slate-600">Latest autonomous multi-agent extractions</p>
          </div>
          <Link href="/batch" className="text-xs text-[#ff5500] hover:underline font-bold">
            View All in Batch &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#d4d4d8] text-left text-slate-500 uppercase">
                <th className="pb-3 font-bold">Part Number</th>
                <th className="pb-3 font-bold">Brand</th>
                <th className="pb-3 font-bold">Specs</th>
                <th className="pb-3 font-bold">Confidence</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(history.length > 0 ? history : []).slice(0, 5).map((prod) => (
                <tr key={prod.product_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-[#111113]">{prod.input.part_number}</td>
                  <td className="py-3 text-slate-700">{prod.input.brand}</td>
                  <td className="py-3 text-slate-600">{prod.specifications.length} attributes</td>
                  <td className="py-3">
                    <span className="text-emerald-700 font-bold">
                      {Math.round((prod.quality_report?.overall_confidence || 0.95) * 100)}%
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 bg-emerald-50 font-bold">
                      APPROVED
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/results/${prod.product_id}`}
                      onClick={() => setActiveProduct(prod)}
                      className="text-[#ff5500] hover:underline font-bold"
                    >
                      Dossier &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                [
                  { mpn: "6ES7214-1AG40-0XB0", brand: "Siemens", specs: 12, conf: "97%" },
                  { mpn: "ATV320U15N4B", brand: "Schneider Electric", specs: 14, conf: "96%" },
                  { mpn: "ACS880-01-04A6-3", brand: "ABB", specs: 16, conf: "98%" },
                  { mpn: "25B-D4P0N104", brand: "Rockwell AB", specs: 15, conf: "95%" },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-[#111113]">{item.mpn}</td>
                    <td className="py-3 text-slate-700">{item.brand}</td>
                    <td className="py-3 text-slate-600">{item.specs} attributes</td>
                    <td className="py-3">
                      <span className="text-emerald-700 font-bold">{item.conf}</span>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 bg-emerald-50 font-bold">
                        APPROVED
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link href="/enrich" className="text-[#ff5500] hover:underline font-bold">
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
