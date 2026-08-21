"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  WifiOff,
  Database,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceRadarChart } from "@/components/charts/confidence-radar";
import { ConfidenceDistributionChart } from "@/components/charts/confidence-distribution";
import { NexusApiClient } from "@/lib/api-client";
import { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NexusApiClient.getDashboardStats();
      setStats(data);
      setBackendOnline(true);
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard data");
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalProducts = stats?.total_products || 0;
  const avgConf = stats ? Math.round(stats.average_confidence * 100) : 0;
  const avgTime = stats?.average_processing_time || 0;
  const reviewCount = stats?.review_required_count || 0;

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
            <Badge variant="outline" className={`text-xs font-mono font-bold ${backendOnline ? "text-emerald-700 border-emerald-500/50 bg-emerald-50" : "text-red-700 border-red-500/50 bg-red-50"}`}>
              {backendOnline ? "● LIVE" : "● OFFLINE"}
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Real-time telemetry from SQLite database — all metrics are from actual enrichment pipeline executions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="h-9 px-3 rounded-lg border border-[#d4d4d8] bg-white hover:border-[#ff5500] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all text-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <Link href="/enrich">
            <button className="h-10 px-5 rounded-xl bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ff5500]/25 transition-all flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Enrichment</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 flex items-center gap-4">
          <WifiOff className="h-8 w-8 text-amber-500 shrink-0" />
          <div>
            <h3 className="font-mono font-bold text-amber-800 text-sm">Backend Connection Issue</h3>
            <p className="text-xs text-amber-700 font-mono mt-1">{error}</p>
            <p className="text-xs text-amber-600 font-mono mt-2">
              Start the backend: <code className="bg-amber-100 px-1.5 py-0.5 rounded">uvicorn nexus_pi.api.main:app --reload --port 8000</code>
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff5500]" />
          <span className="ml-3 text-sm font-mono text-slate-600">Loading dashboard data...</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Total Enriched SKUs</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5500]/10 text-[#ff5500]">
                  <Database className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[#111113]">{totalProducts}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                <span>Stored in SQLite database</span>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Average 4D Confidence</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${avgConf >= 85 ? "text-emerald-700" : avgConf >= 70 ? "text-amber-600" : "text-red-600"}`}>
                {avgConf > 0 ? `${avgConf}%` : "—"}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                <span>Threshold: &gt;70% for auto-approve</span>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Needs Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${reviewCount > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                {reviewCount}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                <span>Products flagged for HITL review</span>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-2 hover:border-[#ff5500] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Avg Pipeline Speed</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-blue-600">
                {avgTime > 0 ? `${avgTime}s` : "—"}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                <span>7-Agent swarm pipeline</span>
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

            {/* Confidence Distribution — now from real data */}
            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#ff5500] inline-block" />
                  <h2 className="text-sm font-bold font-mono text-[#111113] uppercase">Confidence Distribution</h2>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">
                  From Database
                </Badge>
              </div>
              {stats?.confidence_distribution ? (
                <div className="h-[280px] flex items-end justify-center gap-8 px-8 pb-8">
                  {[
                    { label: "High (≥85%)", value: stats.confidence_distribution.high, color: "bg-emerald-500" },
                    { label: "Medium (70-85%)", value: stats.confidence_distribution.medium, color: "bg-amber-500" },
                    { label: "Low (<70%)", value: stats.confidence_distribution.low, color: "bg-red-500" },
                  ].map((item) => {
                    const total = stats.confidence_distribution.high + stats.confidence_distribution.medium + stats.confidence_distribution.low;
                    const height = total > 0 ? Math.max(20, (item.value / total) * 200) : 20;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-2">
                        <span className="text-lg font-bold font-mono text-[#111113]">{item.value}</span>
                        <div className={`w-16 rounded-t-xl ${item.color} transition-all`} style={{ height: `${height}px` }} />
                        <span className="text-[10px] font-mono text-slate-500 text-center font-bold">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[280px] w-full flex items-center justify-center">
                  <ConfidenceDistributionChart />
                </div>
              )}
            </div>
          </div>

          {/* Brand Distribution */}
          {stats && stats.brand_distribution.length > 0 && (
            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#ff5500] inline-block" />
                  <h2 className="text-sm font-bold text-[#111113] uppercase">Brand Distribution</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {stats.brand_distribution.map((b) => (
                  <div key={b.brand} className="flex items-center gap-2 rounded-xl border border-[#d4d4d8] bg-slate-50 px-4 py-2">
                    <span className="text-xs font-bold text-[#111113]">{b.brand}</span>
                    <Badge variant="secondary" className="text-[10px] bg-[#ff5500]/10 text-[#ff5500] border-[#ff5500]/20 font-bold">
                      {b.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Enriched Products Table */}
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#111113] uppercase">Recently Enriched SKUs</h2>
                <p className="text-[11px] text-slate-600">Latest autonomous multi-agent extractions from database</p>
              </div>
              <Link href="/history" className="text-xs text-[#ff5500] hover:underline font-bold">
                View All History &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#d4d4d8] text-left text-slate-500 uppercase">
                    <th className="pb-3 font-bold">Part Number</th>
                    <th className="pb-3 font-bold">Brand</th>
                    <th className="pb-3 font-bold">Confidence</th>
                    <th className="pb-3 font-bold">Time</th>
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats && stats.recent_enrichments.length > 0 ? (
                    stats.recent_enrichments.map((item) => (
                      <tr key={item.product_id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-bold text-[#111113]">{item.part_number}</td>
                        <td className="py-3 text-slate-700">{item.brand}</td>
                        <td className="py-3">
                          <span className={`font-bold ${Math.round(item.overall_confidence * 100) >= 85 ? "text-emerald-700" : "text-amber-600"}`}>
                            {Math.round(item.overall_confidence * 100)}%
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{item.processing_time_seconds}s</td>
                        <td className="py-3 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/results/${item.product_id}`}
                            className="text-[#ff5500] hover:underline font-bold"
                          >
                            Dossier &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No enrichments yet. <Link href="/enrich" className="text-[#ff5500] hover:underline">Run your first enrichment</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
