"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  RefreshCw,
} from "lucide-react";
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
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Failed to load dashboard data");
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialStats() {
      try {
        const data = await NexusApiClient.getDashboardStats();
        if (isMounted) {
          setStats(data);
          setBackendOnline(true);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (isMounted) {
          const err = e as Error;
          setError(err.message || "Failed to load dashboard data");
          setBackendOnline(false);
          setLoading(false);
        }
      }
    }

    loadInitialStats();

    return () => {
      isMounted = false;
    };
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
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs font-mono text-amber-900">
          <strong>Notice:</strong> {error}. Serving simulated baseline telemetry.
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Total Products</span>
          <div className="text-3xl font-black font-mono text-[#111113]">{loading ? "..." : totalProducts}</div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">Indexed in SQLite</span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Avg. Confidence</span>
          <div className="text-3xl font-black font-mono text-[#111113]">{loading ? "..." : `${avgConf}%`}</div>
          <span className="text-[10px] font-mono text-[#ff5500] font-bold">4D Vector composite</span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Avg Pipeline Latency</span>
          <div className="text-3xl font-black font-mono text-[#111113]">{loading ? "..." : `${avgTime.toFixed(1)}s`}</div>
          <span className="text-[10px] font-mono text-blue-600 font-bold">7-Agent execution</span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">HITL Queue</span>
          <div className="text-3xl font-black font-mono text-[#111113]">{loading ? "..." : reviewCount}</div>
          <span className="text-[10px] font-mono text-purple-600 font-bold">Requires human review</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black font-mono text-[#111113] uppercase tracking-wider">
            4D Trust Vector Radar Breakdown
          </h2>
          <ConfidenceRadarChart />
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black font-mono text-[#111113] uppercase tracking-wider">
            Catalog Confidence Tier Distribution
          </h2>
          <ConfidenceDistributionChart />
        </div>
      </div>
    </div>
  );
}
