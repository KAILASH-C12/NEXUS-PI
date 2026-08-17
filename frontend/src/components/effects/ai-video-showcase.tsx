"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Sparkles,
  Camera,
  Box,
  Cpu,
  CheckCircle2,
  Maximize2,
  Layers,
  Radio,
  Zap,
  Flame,
  Activity,
  ShieldCheck,
  Binary,
} from "lucide-react";

export function AiVideoShowcase() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [frameTick, setFrameTick] = useState<number>(0);

  // Synchronized playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
      setFrameTick((prev) => prev + 1);
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Derived live dynamic values
  const coreTemp = (42 + Math.sin(frameTick * 0.08) * 8).toFixed(1);
  const voltage = (24.0 + Math.cos(frameTick * 0.1) * 0.4).toFixed(2);
  const laserTopPct = (progress * 0.95) % 100;
  const activeAgentIdx = Math.floor((progress / 25) % 4);

  return (
    <div className="space-y-4">
      {/* Master Player Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>Synchronized Multimodal AI Motion Engine</span>
              <Badge variant="outline" className="text-[10px] font-mono text-amber-300 border-amber-400/40 bg-amber-400/10">
                3-in-1 Master Reel
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Vision OCR &bull; 3D Thermal Twin Physics &bull; 7-Agent Swarm Consensus running simultaneously
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
            60 FPS AI Pipeline
          </Badge>
        </div>
      </div>

      {/* ── UNIFIED MASTER MULTIMODAL SCREEN (ALL 3 SIMULTANEOUS) ── */}
      <div className="relative rounded-3xl border-2 border-white/20 bg-gradient-to-br from-[#121626] via-[#0d101c] to-[#070810] overflow-hidden shadow-2xl backdrop-blur-2xl">
        {/* Luminous Ambient Highlights */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none" />

        {/* Master Screen Top HUD Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              <span>LIVE AI MESH FEED &bull; 1080P 60FPS</span>
            </div>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">PART: SIEMENS S7-1200 CPU 1214C</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">LATENCY: 1.4s</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300 font-bold">4D TRUST: 96.5%</span>
          </div>
        </div>

        {/* ── 3 SYNCHRONIZED SIMULTANEOUS PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10 p-4 sm:p-6 gap-6 lg:gap-0">
          {/* PANEL 1: COMPUTER VISION OCR SCANNER (Left 4 Cols) */}
          <div className="lg:col-span-4 lg:pr-6 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-white">1. Gemini Vision OCR</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono text-cyan-300 border-cyan-500/30">
                Optical Grounding
              </Badge>
            </div>

            {/* Simulated Live Nameplate Viewfinder */}
            <div className="relative rounded-2xl bg-black/80 border border-cyan-500/40 p-4 aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-lg shadow-cyan-500/10">
              {/* Laser Scanning Line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400"
                style={{ top: `${laserTopPct}%` }}
              />

              {/* Bounding Box 1: MPN */}
              <div className="border border-cyan-400 bg-cyan-500/10 rounded p-1.5 font-mono text-[10px] space-y-0.5">
                <div className="flex justify-between text-cyan-300 font-bold">
                  <span>[BOX 1: MPN]</span>
                  <span className="text-emerald-400">99.4%</span>
                </div>
                <div className="text-white font-bold">6ES7214-1AG40-0XB0</div>
              </div>

              {/* Bounding Box 2: Voltage */}
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                <div className="border border-cyan-400/60 bg-cyan-950/40 rounded p-1.5">
                  <span className="text-slate-400 block">RATED SUPPLY:</span>
                  <span className="text-cyan-300 font-bold">24V DC (20.4-28.8V)</span>
                </div>
                <div className="border border-cyan-400/60 bg-cyan-950/40 rounded p-1.5">
                  <span className="text-slate-400 block">I/O TERMINALS:</span>
                  <span className="text-cyan-300 font-bold">14 DI / 10 DO</span>
                </div>
              </div>

              {/* Bounding Box 3: Certifications */}
              <div className="border border-emerald-400/40 bg-emerald-950/30 rounded p-1 text-[9px] font-mono text-emerald-300 flex justify-between">
                <span>CERTS: CE &bull; cULus &bull; ATEX</span>
                <span>IP20</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>BARCODE DECODED: 100%</span>
              <span className="text-cyan-400">SUB-100MS OCR</span>
            </div>
          </div>

          {/* PANEL 2: 3D DIGITAL TWIN THERMAL SHADER (Center 4 Cols) */}
          <div className="lg:col-span-4 lg:px-6 space-y-3 flex flex-col justify-between pt-4 lg:pt-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-white">2. 3D Twin Physics</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono text-amber-300 border-amber-400/30">
                Arrhenius FEM
              </Badge>
            </div>

            {/* Simulated Live Thermal Physics Engine */}
            <div className="relative rounded-2xl bg-black/80 border border-amber-500/40 p-4 aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-lg shadow-amber-500/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-white font-bold">Core Temp: {coreTemp}°C</span>
                </div>
                <span className="text-amber-300 font-bold">{voltage}V DC</span>
              </div>

              {/* Dynamic Heatwave Visualizer */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-900/60 via-amber-900/60 to-rose-900/60 border border-white/10 space-y-2 text-center">
                <div className="flex items-center justify-around">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full transition-all duration-100"
                      style={{
                        height: `${Math.max(12, Math.sin((i + frameTick * 0.15)) * 24 + 20)}px`,
                        backgroundColor: i > 10 ? "#f43f5e" : i > 5 ? "#f59e0b" : "#06b6d4",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-200 block">
                  HEATMAP GRADIENT: NOMINAL 24°C &rarr; PEAK 58°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-1.5 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block">DEGRADED MTBF:</span>
                  <span className="text-emerald-400 font-bold">520,000 Hours</span>
                </div>
                <div className="p-1.5 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block">10-YR STABILITY:</span>
                  <span className="text-cyan-300 font-bold">98.8% Health</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>GALVANIC ISOLATION: 500V</span>
              <span className="text-amber-400">DIN-RAIL MOUNTED</span>
            </div>
          </div>

          {/* PANEL 3: 7-AGENT SWARM & 4D AUDIT (Right 4 Cols) */}
          <div className="lg:col-span-4 lg:pl-6 space-y-3 flex flex-col justify-between pt-4 lg:pt-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span className="font-bold text-white">3. 7-Agent Swarm</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono text-indigo-300 border-indigo-400/30">
                Claude 3.7 Judge
              </Badge>
            </div>

            {/* Simulated Live Agent Consensus Engine */}
            <div className="relative rounded-2xl bg-black/80 border border-indigo-500/40 p-4 aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-lg shadow-indigo-500/10 font-mono text-xs">
              {/* 4 Agent Nodes */}
              <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-bold">
                {["1. Discovery", "2. Analysis", "3. Enrich", "4. 4D Audit"].map((node, i) => (
                  <div
                    key={node}
                    className={`p-1.5 rounded-lg border transition-all ${
                      activeAgentIdx === i
                        ? "bg-cyan-500/30 text-white border-cyan-400 shadow-md shadow-cyan-500/30"
                        : "bg-white/[0.03] text-slate-400 border-white/5"
                    }`}
                  >
                    {node.split(" ")[1]}
                  </div>
                ))}
              </div>

              {/* Live Spec Normalization Ticker */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span>UNSPSC Taxonomy:</span>
                  <span className="text-cyan-300 font-bold">32151705</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>eCl@ss 14.0 Code:</span>
                  <span className="text-indigo-300 font-bold">27-24-22-07</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cross-Ref Consensus:</span>
                  <span className="text-emerald-400 font-bold">6/6 Sources Agree</span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[10px] text-emerald-300 flex items-center justify-between font-bold">
                <span>AUDIT: APPROVED FOR COMMERCE</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>ZERO HITL ESCALATION</span>
              <span className="text-emerald-400">100% PROVENANCE</span>
            </div>
          </div>
        </div>

        {/* Master Video Scrubber Bar (Bottom) */}
        <div className="px-5 py-3 bg-black/60 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            title={isPlaying ? "Pause Video Motion" : "Play Video Motion"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          {/* Continuous Progress Scrubber */}
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-amber-300 to-indigo-400 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-slate-300 font-bold shrink-0">
            00:0{Math.floor((progress / 100) * 6)} / 00:06
          </span>
        </div>
      </div>
    </div>
  );
}
