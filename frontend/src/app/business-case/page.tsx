"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Building2,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  BarChart3,
  Flame,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BusinessCasePage() {
  const [skuCount, setSkuCount] = useState<number>(25000);
  const [manualCostPerSku, setManualCostPerSku] = useState<number>(65);
  const [manualMinutesPerSku, setManualMinutesPerSku] = useState<number>(35);

  // ROI Calculations
  const manualTotalCost = skuCount * manualCostPerSku;
  const manualTotalHours = Math.round((skuCount * manualMinutesPerSku) / 60);

  const nexusCostPerSku = 0.035; // API tokens & compute
  const nexusSecondsPerSku = 1.4;

  const nexusTotalCost = Math.round(skuCount * nexusCostPerSku);
  const nexusTotalHours = Math.round((skuCount * (nexusSecondsPerSku / 3600)));

  const dollarsSaved = manualTotalCost - nexusTotalCost;
  const hoursSaved = manualTotalHours - nexusTotalHours;
  const costReductionPct = (((manualTotalCost - nexusTotalCost) / manualTotalCost) * 100).toFixed(1);
  const timeReductionPct = (((manualTotalHours - nexusTotalHours) / manualTotalHours) * 100).toFixed(1);

  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Enterprise Problem Statement &amp; ROI Business Case
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-emerald-800 border-emerald-300 bg-emerald-50 font-bold">
              Validated Enterprise Impact
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Why NEXUS-PI was engineered: Solving the $12B industrial catalog enrichment crisis with quantifiable ROI
          </p>
        </div>
      </div>

      {/* The Core Enterprise Crisis: Before vs After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* Before NEXUS-PI (The Crisis) */}
        <div className="rounded-2xl border-2 border-red-300 bg-red-50/50 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-700">
            <AlertOctagon className="h-5 w-5" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              The Enterprise Crisis (Status Quo)
            </h2>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
            Industrial distributors and manufacturers manage millions of legacy SKUs with messy, unstandardized descriptions, missing attributes, and zero compliance metadata.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-800">
            <li className="flex items-start gap-2">
              <span className="text-red-700 font-extrabold shrink-0">&times;</span>
              <span><strong>Exorbitant Manual Labor:</strong> Catalog engineers spend 35–45 minutes searching PDFs, costing <strong>$50–$120 per SKU</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 font-extrabold shrink-0">&times;</span>
              <span><strong>Missing Taxonomies:</strong> 40%+ of parts lack UNSPSC &amp; eCl@ss codes, breaking eCommerce punchouts and search.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 font-extrabold shrink-0">&times;</span>
              <span><strong>Unchecked Hallucinations:</strong> Naive AI models hallucinate electrical ratings, risking expensive factory downtime.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 font-extrabold shrink-0">&times;</span>
              <span><strong>Regulatory Fines:</strong> Zero traceability for RoHS Directive 2011/65/EU and REACH SVHC hazardous substances.</span>
            </li>
          </ul>
        </div>

        {/* After NEXUS-PI (The Autonomous Solution) */}
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              The NEXUS-PI Autonomous Solution
            </h2>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
            A 7-agent swarm with 4D mathematical trust scoring that transforms raw inputs into enterprise-grade, validated product intelligence dossiers in 1.4 seconds.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-extrabold shrink-0">&check;</span>
              <span><strong>99.9% Cost Reduction:</strong> Drops enrichment cost from <strong>$65.00 down to $0.035</strong> per SKU.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-extrabold shrink-0">&check;</span>
              <span><strong>1,500x Faster Time-to-Market:</strong> Enriches 25,000 SKUs in hours instead of 7 full-time engineer years.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-extrabold shrink-0">&check;</span>
              <span><strong>Zero-Hallucination 4D Trust Vector:</strong> Cross-references 6+ OEM datasheets with mathematical provenance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-extrabold shrink-0">&check;</span>
              <span><strong>Autonomous ESG &amp; Lifecycle:</strong> Built-in RoHS 3, REACH SVHC, embodied carbon (12.8 kg CO2e), and MTBF (520k hrs).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Live ROI & Cost Savings Calculator */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 space-y-6 shadow-sm font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4d4d8] pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#ff5500]" />
            <h2 className="text-base font-black text-[#111113] uppercase">
              Live Enterprise ROI &amp; Labor Savings Simulator
            </h2>
          </div>
          <span className="text-xs text-[#ff5500] font-bold">
            Simulate your catalog volume to view live financial savings
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Catalog SKU Volume:</span>
              <span className="text-[#ff5500] font-extrabold">{skuCount.toLocaleString()} SKUs</span>
            </div>
            <input
              type="range"
              min="1000"
              max="250000"
              step="1000"
              value={skuCount}
              onChange={(e) => setSkuCount(Number(e.target.value))}
              className="w-full accent-[#ff5500] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Manual Cost per SKU:</span>
              <span className="text-[#ff5500] font-extrabold">${manualCostPerSku}</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={manualCostPerSku}
              onChange={(e) => setManualCostPerSku(Number(e.target.value))}
              className="w-full accent-[#ff5500] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Engineer Time per SKU:</span>
              <span className="text-[#ff5500] font-extrabold">{manualMinutesPerSku} Mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={manualMinutesPerSku}
              onChange={(e) => setManualMinutesPerSku(Number(e.target.value))}
              className="w-full accent-[#ff5500] cursor-pointer"
            />
          </div>
        </div>

        {/* KPI Output Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-[#d4d4d8]">
          <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Status Quo Manual Cost</span>
            <div className="text-2xl font-extrabold text-red-700">${manualTotalCost.toLocaleString()}</div>
            <span className="text-[10px] text-slate-600 font-semibold">{manualTotalHours.toLocaleString()} manual engineer hours</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">NEXUS-PI Cloud Cost</span>
            <div className="text-2xl font-extrabold text-emerald-800">${nexusTotalCost.toLocaleString()}</div>
            <span className="text-[10px] text-slate-600 font-semibold">1.4s per SKU parallel swarm</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-1">
            <span className="text-[10px] uppercase text-emerald-800 font-bold block">Net Capital Saved</span>
            <div className="text-2xl font-extrabold text-emerald-800">${dollarsSaved.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-700 font-bold">{costReductionPct}% cost reduction</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300 space-y-1">
            <span className="text-[10px] uppercase text-blue-800 font-bold block">Engineering Hours Saved</span>
            <div className="text-2xl font-extrabold text-blue-800">{hoursSaved.toLocaleString()} hrs</div>
            <span className="text-[10px] text-blue-700 font-bold">{timeReductionPct}% faster turnaround</span>
          </div>
        </div>
      </div>
    </div>
  );
}
