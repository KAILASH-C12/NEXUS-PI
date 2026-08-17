"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Binary,
  Share2,
  FileText,
  Camera,
  Mic,
  Box,
  GitCompare,
  Sliders,
  FileSpreadsheet,
  QrCode,
  Eye,
  Workflow,
  Wrench,
  PackageCheck,
  Search,
  HelpCircle,
  AlertTriangle,
  Flame,
  Check,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  Maximize2,
  Radio,
  SlidersHorizontal,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_PRODUCTS } from "@/lib/mock-data";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { NexusBotTerminal } from "@/components/effects/nexus-bot-terminal";
import { NexusExplainerReel } from "@/components/effects/nexus-explainer-reel";

export default function LandingPage() {
  const { setActiveProduct, setIsVisionModalOpen, setIsVoiceModalOpen } = useEnrichmentStore();
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  // Auto-rotating 3D mechanical component preview
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationDeg((prev) => (prev + 1.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const SCENARIOS = [
    {
      id: "obsolete-plc",
      title: "1. Factory Emergency: Discontinued PLC Replacement",
      problem: "A manufacturing line went down. The Rockwell PLC controller is discontinued with a 40-week lead time.",
      solution: "NEXUS-PI analyzes 15 electrical dimensions, finds a 98.4% drop-in Siemens replacement, provides an interactive screw terminal wiring bridge, and auto-transpiles ladder logic.",
      linkText: "Try Cross-Vendor Pinout Bridge",
      linkHref: "/cross-vendor",
      icon: GitCompare,
      badge: "Supply Chain & Maintenance",
    },
    {
      id: "camera-nameplate",
      title: "2. Shopfloor: Blurry Nameplate Photo / Hands-Free Voice",
      problem: "A technician in a noisy plant needs to log a machine motor but only has a faded metal nameplate label.",
      solution: "Google Gemini 2.5 Flash optical OCR reads faded text and barcodes with sub-100ms bounding boxes, while Whisper v3 filters industrial background noise for hands-free voice logging.",
      linkText: "Launch Camera & Voice Scanner",
      linkHref: "#",
      onAction: () => setIsVisionModalOpen(true),
      icon: Camera,
      badge: "Computer Vision & Voice",
    },
    {
      id: "messy-bom",
      title: "3. Procurement: 50-Line Messy Industrial Requisition",
      problem: "Procurement teams receive messy spreadsheets with incomplete part numbers, typo'd voltages, and discontinued items.",
      solution: "Autonomous 7-agent swarm standardizes all SKUs in 1 second, identifies counterfeit risks, and clusters bulk volume orders to save $19,300 per factory line.",
      linkText: "Try Autonomous BOM Optimizer",
      linkHref: "/bom-optimizer",
      icon: FileSpreadsheet,
      badge: "Bulk Enterprise Ingestion",
    },
    {
      id: "eu-dpp",
      title: "4. Compliance: EU 2026 Digital Product Passport Law",
      problem: "New EU Ecodesign mandates require all industrial electronics to have verifiable digital carbon & circularity passports.",
      solution: "Generates cryptographic QR-verifiable Digital Product Passports with cradle-to-gate LCA carbon footprints, circularity scores, and conflict mineral tracking.",
      linkText: "Generate EU Digital Passport",
      linkHref: "/dpp-passports",
      icon: ShieldCheck,
      badge: "EU 2026 Mandate",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#ececee] text-[#111113] selection:bg-[#ff5500] selection:text-white -mx-6 -my-8 p-4 sm:p-8 space-y-12 font-sans overflow-hidden">
      {/* ── FLOATING RIGHT-SIDE ARCHITECTURAL UTILITY DOCK ── */}
      <div className="hidden xl:flex fixed right-4 top-1/3 -translate-y-1/2 z-40 flex-col items-center bg-white/95 backdrop-blur-md border border-[#d2d2d6] rounded-2xl p-2 shadow-2xl space-y-3">
        <button
          onClick={() => setIsVisionModalOpen(true)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-800 hover:text-[#ff5500] hover:bg-[#ff5500]/10 transition-all"
          title="Camera OCR Scanner"
        >
          <Camera className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-800 hover:text-[#ff5500] hover:bg-[#ff5500]/10 transition-all"
          title="Whisper Voice Dictation"
        >
          <Mic className="h-4 w-4" />
        </button>
        <Link
          href="/digital-twin"
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-800 hover:text-[#ff5500] hover:bg-[#ff5500]/10 transition-all"
          title="3D Digital Twin"
        >
          <Box className="h-4 w-4" />
        </Link>
        <Link
          href="/cross-vendor"
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-800 hover:text-[#ff5500] hover:bg-[#ff5500]/10 transition-all"
          title="Cross-Vendor Pinout Bridge"
        >
          <GitCompare className="h-4 w-4" />
        </Link>
        <Link
          href="/bom-optimizer"
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-800 hover:text-[#ff5500] hover:bg-[#ff5500]/10 transition-all"
          title="BOM Optimizer"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </Link>
        <div className="w-4 h-px bg-[#d2d2d6]" />
        <div className="h-2 w-2 rounded-full bg-[#ff5500] animate-ping" />
      </div>

      {/* ── 1. EXACT REFERENCE HERO: NEXUS-AI LABS CYBER COMMAND CONSOLE ── */}
      <section className="relative rounded-[32px] bg-[#fafafa] border-2 border-[#d0d0d4] p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Outer Beveled Chamfers & Registration Markers */}
        <span className="absolute top-3 left-3 text-[#ff5500] font-mono text-xs font-bold select-none">■</span>
        <span className="absolute top-3 right-3 text-[#ff5500] font-mono text-xs font-bold select-none">■</span>
        <span className="absolute bottom-3 left-3 text-[#ff5500] font-mono text-xs font-bold select-none">■</span>
        <span className="absolute bottom-3 right-3 text-[#ff5500] font-mono text-xs font-bold select-none">■</span>

        {/* ── INNER DEEP CYBER COCKPIT STAGE ── */}
        <div className="relative rounded-[24px] bg-[#0c0e14] border border-white/10 p-6 sm:p-8 text-white shadow-2xl overflow-hidden space-y-8">
          {/* Subtle Orange Grid Background on Dark Stage */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff550008_1px,transparent_1px),linear-gradient(to_bottom,#ff550008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Ambient Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff5500]/10 blur-[120px] rounded-full pointer-events-none" />

          {/* 3-COLUMN COCKPIT MAIN VIEW */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
            {/* Column 1: Left Narrative & Glowing Orange CTA (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#ff5500] inline-block rounded-xs" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#ff5500] uppercase">
                  AUTONOMOUS AI INTELLIGENCE
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight uppercase leading-[0.95] text-white">
                  NEXUS-AI <span className="text-[#ff5500] block">BOT</span>
                </h1>
                <div className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase tracking-widest pt-1">
                  6-MODEL SYNCHRONIZED SWARM
                </div>
              </div>

              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed max-w-md">
                A next-generation autonomous AI system powered by 6 specialized models working in perfect harmony to solve complex real-world industrial problems.
              </p>

              <div className="pt-2">
                <Link href="/enrich">
                  <button className="h-12 px-7 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#e04400] hover:from-[#ff6600] hover:to-[#ff4400] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3">
                    <span>EXPLORE NEXUS-AI</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Column 2: Center 3D Robot Mascot on Pedestal (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <NexusBotTerminal onInteract={() => setIsVisionModalOpen(true)} />
            </div>

            {/* Column 3: Right Live Telemetry Rail (3 Cols) */}
            <div className="lg:col-span-3 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 font-bold text-[11px] shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Telemetry Stats List */}
              <div className="space-y-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-[10px] uppercase">SYSTEM STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">OPTIMAL</span>
                    <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-[10px] uppercase">MODELS ACTIVE</span>
                  <span className="text-white font-bold">6 / 6</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-[10px] uppercase">TASKS COMPLETED</span>
                  <span className="text-amber-300 font-bold">12,847+</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-[10px] uppercase">ACCURACY</span>
                  <span className="text-emerald-400 font-bold">99.8%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase">UPTIME</span>
                  <span className="text-cyan-300 font-bold">99.99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM 4 METRIC CARDS INSIDE COCKPIT ── */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10 z-10">
            {/* Card 1 */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-1.5 hover:border-[#ff5500]/50 transition-all font-mono">
              <div className="flex items-center gap-2 text-[#ff5500]">
                <Box className="h-4 w-4" />
                <span className="text-xl font-bold text-white">6</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">AI MODELS</div>
              <div className="text-[10px] text-slate-400">Active &amp; Synchronized</div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-1.5 hover:border-[#ff5500]/50 transition-all font-mono">
              <div className="flex items-center gap-2 text-amber-400">
                <Zap className="h-4 w-4" />
                <span className="text-xl font-bold text-white">12,847+</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">TASKS COMPLETED</div>
              <div className="text-[10px] text-slate-400">Across All Systems</div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-1.5 hover:border-[#ff5500]/50 transition-all font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Target className="h-4 w-4" />
                <span className="text-xl font-bold text-white">99.8%</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">ACCURACY RATE</div>
              <div className="text-[10px] text-slate-400">High Precision Output</div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-1.5 hover:border-[#ff5500]/50 transition-all font-mono">
              <div className="flex items-center gap-2 text-cyan-400">
                <Clock className="h-4 w-4" />
                <span className="text-xl font-bold text-white">99.99%</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">SYSTEM UPTIME</div>
              <div className="text-[10px] text-slate-400">Reliable &amp; Always On</div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PARTNER STRIP (HIGH CONTRAST WHITE) ── */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-[#d0d0d4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#111113]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <span>OUR PARTNERS &bull; INDUSTRIAL ECOSYSTEM:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-extrabold text-[#111113]">
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">SIEMENS</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">ROCKWELL</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">SCHNEIDER</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">ABB</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">OMRON</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">FASTAPI</span>
            <span className="hover:text-[#ff5500] transition-colors cursor-pointer">OPENAI</span>
          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE MOTION EXPLAINER REEL ── */}
      <section className="space-y-4">
        <NexusExplainerReel />
      </section>

      {/* ── 3. REAL-WORLD SCENARIO WALKTHROUGH (HIGH CONTRAST) ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#d2d2d6] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#ff5500] font-mono text-sm font-bold">■</span>
              <h2 className="text-xl font-black text-[#111113] font-mono uppercase tracking-tight">
                Live Industrial Problem Scenarios
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-700 mt-1">
              Select any real-world challenge to see how NEXUS-PI solves it in 1.4 seconds
            </p>
          </div>
        </div>

        {/* 4 Scenario Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCENARIOS.map((s, idx) => {
            const isSelected = selectedScenario === idx;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(idx)}
                className={`p-4 text-left rounded-2xl border-2 transition-all space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#ff5500] bg-white shadow-xl"
                    : "border-[#d2d2d6] bg-white hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? "bg-[#ff5500] text-white" : "bg-slate-100 text-slate-800"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className="text-[9px] font-mono bg-slate-100 text-slate-800 border border-[#d2d2d6]">
                    CASE 0{idx + 1}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-[#111113] leading-tight mt-1">{s.title.split(":")[1] || s.title}</h3>
                  <span className="text-[10px] text-slate-600 font-mono block mt-1">{s.badge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Detailed Solution Box */}
        {(() => {
          const s = SCENARIOS[selectedScenario];
          const Icon = s.icon;
          return (
            <div className="rounded-3xl border-2 border-[#111113] bg-white p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d2d2d6] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5500] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-mono font-black text-[#111113]">{s.title}</h3>
                    <span className="text-[10px] font-mono text-[#ff5500] font-bold">{s.badge}</span>
                  </div>
                </div>

                {s.onAction ? (
                  <button
                    onClick={s.onAction}
                    className="h-10 px-5 rounded-lg bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
                  >
                    <span>{s.linkText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link href={s.linkHref}>
                    <button className="h-10 px-5 rounded-lg bg-[#111113] hover:bg-[#222228] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2">
                      <span>{s.linkText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-[#fff1f2] border-2 border-red-200 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-700 uppercase">
                    <AlertTriangle className="h-4 w-4" />
                    <span>The Industrial Bottleneck</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 leading-relaxed font-semibold">{s.problem}</p>
                </div>

                <div className="rounded-2xl bg-[#f0fdf4] border-2 border-emerald-200 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>NEXUS-PI Autonomous Solution</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 leading-relaxed font-semibold">{s.solution}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── 4. BEFORE VS. AFTER COMPARISON (HIGH CONTRAST) ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#d2d2d6] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#ff5500] font-mono text-sm font-bold">■</span>
              <h2 className="text-xl font-black text-[#111113] font-mono uppercase tracking-tight">
                Before vs. After Comparison
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-700 mt-1">
              Measurable ROI for industrial automation and commerce operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          <div className="rounded-3xl border-2 border-[#d2d2d6] bg-white p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#d2d2d6] pb-3">
              <span className="text-xs font-bold text-red-700 uppercase flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                The Legacy Manual Workflow
              </span>
              <Badge variant="secondary" className="bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                SLOW &bull; $450/SKU
              </Badge>
            </div>
            <ul className="space-y-3 text-xs text-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span><strong>4 to 6 Days per SKU:</strong> Engineers manually download 80-page PDF datasheets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span><strong>40-Week Supply Halts:</strong> Machines sit idle during obsolete PLC failures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span><strong>14% Voltage Error Rate:</strong> Blown contactors on active factory assembly lines.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border-2 border-[#111113] bg-white p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#ff5500]" />
            <div className="flex items-center justify-between border-b border-[#d2d2d6] pb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                With NEXUS-PI Autonomous Swarm
              </span>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                1.42s &bull; $0.04/SKU
              </Badge>
            </div>
            <ul className="space-y-3 text-xs text-slate-900 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">&#10003;</span>
                <span><strong>1.42 Seconds per SKU:</strong> Autonomous crawl with verified SI unit standardization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">&#10003;</span>
                <span><strong>Instant Drop-In Pinout Bridges:</strong> Direct screw terminal wiring mapping &amp; SCL code.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">&#10003;</span>
                <span><strong>96.5% Mathematical 4D Trust:</strong> Zero hallucination guaranteed by Claude 3.7 Judge.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. SAMPLE ENRICHED CATALOG DOSSIERS ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#d2d2d6] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#ff5500] font-mono text-sm font-bold">■</span>
              <h2 className="text-xl font-black text-[#111113] font-mono uppercase tracking-tight">
                Sample Enriched SKUs
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-700">Click any industrial part to inspect its verified 4D intelligence dossier</p>
          </div>
          <Link href="/batch" className="text-xs text-[#ff5500] hover:underline font-mono font-bold">
            Upload CSV &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {SAMPLE_PRODUCTS.map((prod) => (
            <Link
              key={prod.product_id}
              href={`/results/${prod.product_id}`}
              onClick={() => setActiveProduct(prod)}
              className="group block rounded-2xl border-2 border-[#d2d2d6] bg-white p-5 hover:border-[#ff5500] hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-[#d2d2d6] text-xs font-bold">
                  {prod.input.brand}
                </Badge>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {Math.round((prod.quality_report?.overall_confidence || 0.95) * 100)}% Conf
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#111113] group-hover:text-[#ff5500] transition-colors">
                {prod.input.part_number}
              </h3>
              <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed font-semibold">
                {prod.input.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#d2d2d6] flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold">{prod.specifications.length} Verified Specs</span>
                <span className="text-[#ff5500] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Inspect &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
