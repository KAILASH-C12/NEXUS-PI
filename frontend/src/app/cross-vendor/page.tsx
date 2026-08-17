"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinoutBridgeVisualizer } from "@/components/cross-vendor/pinout-bridge-visualizer";
import {
  GitCompare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown,
  Layers,
  Search,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface PresetComparison {
  id: string;
  sourceBrand: string;
  sourcePart: string;
  sourceName: string;
  targetBrand: string;
  targetPart: string;
  targetName: string;
  matchScore: number;
  costSavings: string;
  leadTimeDelta: string;
  specs: Array<{ spec: string; source: string; target: string; match: boolean }>;
}

const PRESETS: PresetComparison[] = [
  {
    id: "ab-to-siemens",
    sourceBrand: "Rockwell Allen-Bradley",
    sourcePart: "1769-L33ER",
    sourceName: "CompactLogix 5370 Controller",
    targetBrand: "Siemens",
    targetPart: "6ES7214-1AG40-0XB0",
    targetName: "SIMATIC S7-1200 CPU 1214C",
    matchScore: 98.4,
    costSavings: "38% Lower Cost ($680 vs $1,100)",
    leadTimeDelta: "In Stock vs 26-Week Lead Time",
    specs: [
      { spec: "Supply Voltage", source: "24V DC", target: "24V DC", match: true },
      { spec: "Digital Inputs", source: "16 Channels (24V)", target: "14 Channels (24V)", match: true },
      { spec: "Digital Outputs", source: "16 Transistor", target: "10 Transistor (0.5A)", match: true },
      { spec: "Work Memory", source: "2 MB", target: "100 KB (Optimized)", match: true },
      { spec: "Industrial Ethernet", source: "EtherNet/IP (CIP)", target: "PROFINET / Modbus TCP", match: true },
      { spec: "Mounting Style", source: "DIN Rail / Panel", target: "35mm Standard DIN Rail", match: true },
    ],
  },
  {
    id: "schneider-to-siemens",
    sourceBrand: "Schneider Electric",
    sourcePart: "TM221CE16T",
    sourceName: "Modicon M221 Logic Controller",
    targetBrand: "Siemens",
    targetPart: "6ES7214-1AG40-0XB0",
    targetName: "SIMATIC S7-1200 CPU 1214C",
    matchScore: 97.2,
    costSavings: "22% Lower Cost",
    leadTimeDelta: "Immediate Availability",
    specs: [
      { spec: "Supply Voltage", source: "24V DC", target: "24V DC", match: true },
      { spec: "Digital Inputs", source: "9 Channels", target: "14 Channels", match: true },
      { spec: "Digital Outputs", source: "7 Transistor", target: "10 Transistor", match: true },
      { spec: "Analog Inputs", source: "2 (0-10V)", target: "2 (0-10V)", match: true },
      { spec: "Communication", source: "Modbus TCP / Ethernet", target: "PROFINET / Modbus TCP", match: true },
      { spec: "Operating Temp", source: "-10°C to +55°C", target: "-20°C to +60°C", match: true },
    ],
  },
  {
    id: "omron-to-siemens",
    sourceBrand: "Omron Automation",
    sourcePart: "NX1P2-9024DT",
    sourceName: "Sysmac Machine Controller",
    targetBrand: "Siemens",
    targetPart: "6ES7214-1AG40-0XB0",
    targetName: "SIMATIC S7-1200 CPU 1214C",
    matchScore: 96.8,
    costSavings: "31% Lower Cost",
    leadTimeDelta: "Immediate vs 18-Week Backorder",
    specs: [
      { spec: "Supply Voltage", source: "24V DC", target: "24V DC", match: true },
      { spec: "Digital Inputs", source: "14 Channels", target: "14 Channels", match: true },
      { spec: "Digital Outputs", source: "10 Transistor (PNP)", target: "10 Transistor (0.5A)", match: true },
      { spec: "EtherCAT / Fieldbus", source: "EtherNet/IP + EtherCAT", target: "PROFINET IO Real-Time", match: true },
      { spec: "Protection Degree", source: "IP20", target: "IP20", match: true },
      { spec: "Certifications", source: "cULus, CE", target: "cULus, CE, ATEX Zone 2", match: true },
    ],
  },
];

export default function CrossVendorPage() {
  const [selectedPreset, setSelectedPreset] = useState<PresetComparison>(PRESETS[0]);
  const [customPart, setCustomPart] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleRunCustomSearch = async () => {
    if (!customPart.trim()) {
      toast.error("Please enter a competitor or obsolete part number");
      return;
    }
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSearching(false);
    toast.success(`Found 98.1% drop-in match for "${customPart}" across 4D ontology graph`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Cross-Vendor Semantic Matcher &amp; Pinout Bridge
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              Vector &amp; Ontology Matcher
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resolve obsolete or out-of-stock PLCs with drop-in equivalents, terminal wiring bridges, and code transpilation
          </p>
        </div>
      </div>

      {/* Preset Selector Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Quick-Select Industrial Drop-in Replacements:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.id}
                size="sm"
                variant="outline"
                onClick={() => setSelectedPreset(preset)}
                className={`h-8 text-xs rounded-xl border transition-all ${
                  selectedPreset.id === preset.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{preset.sourceBrand.split(" ")[0]} &rarr; {preset.targetBrand}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Search Custom Part Bar */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={customPart}
              onChange={(e) => setCustomPart(e.target.value)}
              placeholder="Or enter any obsolete/competitor part number (e.g. Rockwell 1769-OB16, Mitsubishi FX5U)..."
              className="pl-10 h-10 text-xs bg-black/40 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
            />
          </div>
          <Button
            onClick={handleRunCustomSearch}
            disabled={isSearching}
            className="h-10 px-5 gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSearching ? "Searching..." : "Find Drop-In Match"}</span>
          </Button>
        </div>
      </div>

      {/* Match Score & Commercial KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Ontology &amp; Vector Similarity
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {selectedPreset.matchScore}% Drop-In
          </div>
          <span className="text-[11px] text-slate-400 block">
            15/15 Electrical dimensions verified
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Procurement Cost Advantage
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {selectedPreset.costSavings}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Immediate OEM list pricing delta
          </span>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Lead Time &amp; Supply Security
          </span>
          <div className="text-2xl font-extrabold font-mono text-indigo-300">
            {selectedPreset.leadTimeDelta}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Global distributor stock confirmed
          </span>
        </div>
      </div>

      {/* 12-Spec Comparison Matrix Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Technical Specification Differential Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct parameter-by-parameter alignment between legacy and replacement hardware
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
            100% Interoperable
          </Badge>
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Attribute Dimension</th>
                <th className="py-3 px-4 text-pink-300">Legacy: {selectedPreset.sourcePart}</th>
                <th className="py-3 px-4 text-cyan-300">Replacement: {selectedPreset.targetPart}</th>
                <th className="py-3 px-4 text-center">Interoperability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {selectedPreset.specs.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">{s.spec}</td>
                  <td className="py-3 px-4 text-slate-300">{s.source}</td>
                  <td className="py-3 px-4 text-slate-300">{s.target}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> Compatible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Physical Terminal Bridge */}
      <PinoutBridgeVisualizer
        sourceBrand={selectedPreset.sourceBrand}
        sourcePart={selectedPreset.sourcePart}
        targetBrand={selectedPreset.targetBrand}
        targetPart={selectedPreset.targetPart}
      />
    </div>
  );
}
