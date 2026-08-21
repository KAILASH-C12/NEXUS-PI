"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Camera,
  Box,
  Cpu,
  CheckCircle2,
  GitCompare,
  Layers,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
} from "lucide-react";

export function NexusExplainerReel() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [scanLaserPct, setScanLaserPct] = useState<number>(10);

  const CHAPTERS = [
    {
      id: "ingest",
      num: "01",
      title: "Multimodal Ingestion",
      tag: "Vision OCR & Voice",
      icon: Camera,
      duration: "00:03",
      heading: "Snap Machine Photos or Dictate Specs",
      description: "Technicians use smartphones or shopfloor microphones. Gemini 2.5 Flash extracts nameplate bounding boxes in 92ms, while Whisper v3 filters ambient factory noise.",
    },
    {
      id: "swarm",
      num: "02",
      title: "7-Agent Autonomous Swarm",
      tag: "4D Confidence Audit",
      icon: Cpu,
      duration: "00:03",
      heading: "Autonomous Datasheet Crawl & SI Standardization",
      description: "Discovery, Analysis, and Enrichment agents crawl global OEM repositories, convert non-standard units to ISO/IEC metric standards, and compute a mathematical 96.5% trust vector.",
    },
    {
      id: "output",
      num: "03",
      title: "Instant Engineering Output",
      tag: "3D Twin & Pinout Bridge",
      icon: Box,
      duration: "00:03",
      heading: "3D Thermal Simulation & Cross-Vendor Bridges",
      description: "Generates real-time 3D FEM thermal heatmaps, finds drop-in replacements for obsolete PLCs with interactive screw terminal wiring diagrams, and creates EU Digital Product Passports.",
    },
  ];

  // Continuous synchronized animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveChapter((c) => (c + 1) % CHAPTERS.length);
          return 0;
        }
        return prev + 1.2;
      });
      setScanLaserPct((prev) => (prev + 2) % 100);
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying, activeChapter]);

  const currentChapter = CHAPTERS[activeChapter];
  const Icon = currentChapter.icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ff5500] inline-block" />
          <h2 className="text-xl font-black font-mono text-[#111113] uppercase tracking-tight">
            How NEXUS-PI Works &bull; Interactive Explainer
          </h2>
          <Badge variant="outline" className="text-[10px] font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
            Interactive Motion
          </Badge>
        </div>

        {/* 3 Step Selectors */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {CHAPTERS.map((ch, idx) => {
            const isSelected = activeChapter === idx;
            const ChIcon = ch.icon;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapter(idx);
                  setProgress(0);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "bg-[#ff5500] text-white border-[#ff5500] shadow-md shadow-[#ff5500]/25 font-bold"
                    : "bg-white text-slate-800 border-[#d4d4d8] hover:border-slate-400 font-semibold"
                }`}
              >
                <ChIcon className="h-3.5 w-3.5" />
                <span>Step {idx + 1}: {ch.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CINEMATIC EXPLAINER SCREEN ── */}
      <div className="relative rounded-3xl border-2 border-[#111113] bg-white shadow-2xl overflow-hidden">
        {/* Top Screen HUD Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-2 font-bold text-[#111113]">
            <Radio className="h-3.5 w-3.5 text-[#ff5500] animate-pulse" />
            <span>STEP {currentChapter.num}: {currentChapter.title.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{currentChapter.tag}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Dynamic Chapter Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center bg-[#fafafa]">
          {/* Left Visual Animation Module (6 Cols) */}
          <div className="lg:col-span-6">
            {/* Chapter 1 Visual: Live Optical Scanner */}
            {activeChapter === 0 && (
              <div className="relative rounded-2xl bg-[#0c0e14] border-2 border-slate-900 p-5 aspect-[16/10] flex flex-col justify-between text-white font-mono text-xs overflow-hidden shadow-xl">
                {/* Laser Scan Line */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-[#ff5500] shadow-[0_0_12px_#ff5500]"
                  style={{ top: `${scanLaserPct}%` }}
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#ff5500] font-bold">[OPTICAL SCANNER FEED]</span>
                  <span className="text-emerald-400">1080P FHD &bull; 92ms</span>
                </div>

                {/* Bounding Box 1 */}
                <div className="border border-[#ff5500] bg-[#ff5500]/10 rounded-lg p-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#ff5500] font-bold">
                    <span>BOX 1: PART NUMBER</span>
                    <span className="text-emerald-400">99.4% CONF</span>
                  </div>
                  <div className="text-sm font-bold text-white">6ES7214-1AG40-0XB0</div>
                </div>

                {/* Bounding Box 2 */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[9px]">VOLTAGE:</span>
                    <span className="text-white font-bold">24V DC</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[9px]">DIGITAL I/O:</span>
                    <span className="text-white font-bold">14 DI / 10 DO</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2 Visual: Multi-Agent Swarm */}
            {activeChapter === 1 && (
              <div className="relative rounded-2xl bg-[#0c0e14] border-2 border-slate-900 p-5 aspect-[16/10] flex flex-col justify-between text-white font-mono text-xs overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#ff5500] font-bold">[LANGGRAPH 7-AGENT SWARM]</span>
                  <span className="text-emerald-400">6/6 SOURCES AGREE</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300">
                    1. Discovery (OEM Crawl)
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/50 text-indigo-300">
                    2. Analysis (SI Units)
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300">
                    3. Claude 3.7 Judge
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">UNSPSC Code:</span>
                    <span className="text-white font-bold">32151705</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">4D Composite Score:</span>
                    <span className="text-emerald-400 font-bold">96.5% (High Precision)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 3 Visual: 3D Twin & Pinout Bridge */}
            {activeChapter === 2 && (
              <div className="relative rounded-2xl bg-[#0c0e14] border-2 border-slate-900 p-5 aspect-[16/10] flex flex-col justify-between text-white font-mono text-xs overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#ff5500] font-bold">[3D DIGITAL TWIN &amp; PINOUT BRIDGE]</span>
                  <span className="text-amber-400">MTBF: 520,000h</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-300">Junction Temp (FEM):</span>
                    <span className="text-amber-400 font-bold">48.2°C (Cool Zone)</span>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-md" />
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-slate-300">Cross-Vendor Drop-In Match:</span>
                  <span className="text-emerald-400 font-bold">Rockwell &rarr; Siemens (98.4%)</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Text Explainer Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-4 font-mono">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/10 text-[#ff5500] font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>STEP {currentChapter.num} OF 03</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#111113] leading-tight">
              {currentChapter.heading}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
              {currentChapter.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveChapter((c) => (c + 1) % CHAPTERS.length);
                  setProgress(0);
                }}
                className="h-10 px-5 rounded-xl bg-[#111113] hover:bg-[#222228] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#ff5500]" />
              </button>
            </div>
          </div>
        </div>

        {/* ── CLEAN ELECTRIC ORANGE & TITANIUM SCRUBBER BAR ── */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 rounded-lg bg-white border border-[#d4d4d8] hover:border-[#ff5500] text-slate-800 flex items-center justify-center transition-colors shrink-0 shadow-sm"
            title={isPlaying ? "Pause Video Motion" : "Play Video Motion"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 text-[#ff5500]" />}
          </button>

          {/* Clean Orange Progress Track */}
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff5500] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-slate-700 font-bold shrink-0">
            00:0{Math.floor((progress / 100) * 3)} / 00:03
          </span>
        </div>
      </div>
    </div>
  );
}
