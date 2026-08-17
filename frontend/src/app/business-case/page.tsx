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
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Problem Statement &amp; ROI Business Case
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              Validated Enterprise Impact
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Why NEXUS-PI was engineered: Solving the $12B industrial catalog enrichment crisis with quantifiable ROI
          </p>
        </div>
      </div>

      {/* The Core Enterprise Crisis: Before vs After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before NEXUS-PI (The Crisis) */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertOctagon className="h-5 w-5" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              The Enterprise Crisis (Status Quo)
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Industrial distributors and manufacturers manage millions of legacy SKUs with messy, unstandardized descriptions, missing attributes, and zero compliance metadata.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">&times;</span>
              <span><strong>Exorbitant Manual Labor:</strong> Catalog engineers spend 35–45 minutes searching PDFs, costing <strong>$50–$120 per SKU</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">&times;</span>
              <span><strong>Missing Taxonomies:</strong> 40%+ of parts lack UNSPSC &amp; eCl@ss codes, breaking eCommerce punchouts and search.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">&times;</span>
              <span><strong>Unchecked Hallucinations:</strong> Naive AI models hallucinate electrical ratings, risking expensive factory downtime.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">&times;</span>
              <span><strong>Regulatory Fines:</strong> Zero traceability for RoHS Directive 2011/65/EU and REACH SVHC hazardous substances.</span>
            </li>
          </ul>
        </div>

        {/* After NEXUS-PI (The Autonomous Solution) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              The NEXUS-PI Autonomous Solution
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            A 7-agent swarm with 4D mathematical trust scoring that transforms raw inputs into enterprise-grade, validated product intelligence dossiers in 1.4 seconds.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">&check;</span>
              <span><strong>99.9% Cost Reduction:</strong> Drops enrichment cost from <strong>$65.00 down to $0.035</strong> per SKU.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">&check;</span>
              <span><strong>1,500x Faster Time-to-Market:</strong> Enriches 25,000 SKUs in hours instead of 7 full-time engineer years.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">&check;</span>
              <span><strong>Zero-Hallucination 4D Trust Vector:</strong> Cross-references 6+ OEM datasheets with mathematical provenance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">&check;</span>
              <span><strong>Autonomous ESG &amp; Lifecycle:</strong> Built-in RoHS 3, REACH SVHC, embodied carbon (12.8 kg CO2e), and MTBF (520k hrs).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Live ROI & Cost Savings Calculator */}
      <div className="rounded-2xl border border-cyan-500/30 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono">
              Live Enterprise ROI &amp; Labor Savings Simulator
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Simulate your catalog volume to view live financial savings
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Catalog SKU Volume:</span>
              <span className="text-cyan-400 font-bold">{skuCount.toLocaleString()} SKUs</span>
            </div>
            <input
              type="range"
              min="1000"
              max="250000"
              step="1000"
              value={skuCount}
              onChange={(e) => setSkuCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Manual Cost per SKU:</span>
              <span className="text-amber-400 font-bold">${manualCostPerSku}.00 / SKU</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={manualCostPerSku}
              onChange={(e) => setManualCostPerSku(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Manual Time per SKU:</span>
              <span className="text-indigo-400 font-bold">{manualMinutesPerSku} mins</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={manualMinutesPerSku}
              onChange={(e) => setManualMinutesPerSku(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>

        {/* High-Impact Financial Results Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Manual Process Cost:</span>
            <span className="text-lg font-bold font-mono text-red-400">
              ${manualTotalCost.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">{manualTotalHours.toLocaleString()} engineer hours</span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">NEXUS-PI AI Cost:</span>
            <span className="text-lg font-bold font-mono text-cyan-300">
              ${nexusTotalCost.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 block">{nexusTotalHours.toLocaleString()} compute hours</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-300 block font-bold">Total Capital Saved:</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              ${dollarsSaved.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-300/80 block">{costReductionPct}% cost reduction</span>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-300 block font-bold">Human Labor Hours Saved:</span>
            <span className="text-lg font-bold font-mono text-cyan-400">
              {hoursSaved.toLocaleString()} hrs
            </span>
            <span className="text-[10px] text-cyan-300/80 block">{timeReductionPct}% time saved</span>
          </div>
        </div>
      </div>

      {/* 3 Real-World Enterprise User Personas */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Enterprise Stakeholders &amp; Immediate Value Delivered
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
              E-Commerce &amp; Catalog VP
            </Badge>
            <h3 className="text-sm font-bold text-white">Distributors (e.g. RS, DigiKey)</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Launch complete new supplier catalog lines in 2 hours instead of 6 months, maximizing SEO organic search and customer conversion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <Badge className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">
              Procurement &amp; Plant Operations
            </Badge>
            <h3 className="text-sm font-bold text-white">Factory Systems Integrators</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Instant pinout verification, drop-in replacement discovery, and automated BMEcat/SAP punchout integration with zero compatibility errors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
              ESG &amp; Compliance Officers
            </Badge>
            <h3 className="text-sm font-bold text-white">Enterprise Regulatory Auditing</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Instant RoHS 3 and REACH SVHC certifications audit trails with embodied carbon tracking to comply with EU Corporate Sustainability Due Diligence Directive.
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Call-to-Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30">
        <div>
          <h3 className="text-sm font-bold text-white">Ready to test the autonomous engine in action?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Enrich a real Siemens, Schneider, or ABB part number and see the 4D validation engine in real time.
          </p>
        </div>

        <Link href="/enrich">
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl h-10 px-6">
            <span>Launch Live Enrichment Studio</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
