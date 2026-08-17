"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  QrCode,
  Leaf,
  Recycle,
  Layers,
  FileCheck,
  Printer,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export interface DppData {
  passportId: string;
  partNumber: string;
  brand: string;
  productName: string;
  carbonFootprintKg: number;
  circularityScorePct: number;
  recycledMaterialPct: number;
  svhcSubstancesCount: number;
  rohsCompliant: boolean;
  reachCompliant: boolean;
  ceMarked: boolean;
  criticalRawMaterials: string[];
  provenanceHash: string;
  issuedDate: string;
  validUntil: string;
}

export const SAMPLE_DPP: DppData = {
  passportId: "EU-DPP-2026-NEXUS-88491",
  partNumber: "6ES7214-1AG40-0XB0",
  brand: "Siemens AG",
  productName: "SIMATIC S7-1200 CPU 1214C DC/DC/DC",
  carbonFootprintKg: 12.8,
  circularityScorePct: 91.0,
  recycledMaterialPct: 42.5,
  svhcSubstancesCount: 0,
  rohsCompliant: true,
  reachCompliant: true,
  ceMarked: true,
  criticalRawMaterials: ["Copper (142g)", "Gold Contact Plating (0.12g)", "Cobalt in Solder (0.4g)"],
  provenanceHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  issuedDate: "2026-03-12",
  validUntil: "2036-03-12 (10-Year Archival)",
};

export function DppCard({ dpp = SAMPLE_DPP }: { dpp?: DppData }) {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(dpp.provenanceHash);
    setCopiedHash(true);
    toast.success("Cryptographic SHA-256 Provenance Hash copied");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
    toast.info("Preparing printable Digital Product Passport...");
  };

  return (
    <div className="space-y-6">
      {/* Official Passport Card */}
      <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#080d1a] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Holographic Watermark / Ambient Gradient */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Passport Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  European Union Digital Product Passport (DPP)
                </h2>
                <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
                  ESPR 2026 Mandate
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Passport ID: <span className="text-cyan-300 font-bold">{dpp.passportId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              variant="outline"
              className="h-8 text-xs border-white/10 text-slate-200 hover:bg-white/5"
            >
              <Printer className="h-3.5 w-3.5 mr-1 text-cyan-400" />
              <span>Print Official Pass</span>
            </Button>
          </div>
        </div>

        {/* Product Identity & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left 8 Cols: Product Metadata */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Manufacturer / Brand
              </span>
              <div className="text-base font-bold text-white">{dpp.brand}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px]">OEM Part Number:</span>
                <span className="text-cyan-300 font-bold text-sm">{dpp.partNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px]">Validity Period:</span>
                <span className="text-slate-200 font-bold text-xs">{dpp.validUntil}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-500 block text-[10px] font-mono uppercase mb-1">
                Official Commercial Designation:
              </span>
              <p className="text-xs text-slate-300">{dpp.productName}</p>
            </div>
          </div>

          {/* Right 4 Cols: Dynamic QR Code Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-black/60 border border-cyan-500/30 text-center space-y-2">
            <div className="p-3 bg-white rounded-xl shadow-md">
              {/* High-res simulated QR Code SVG */}
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-black">
                <path
                  d="M3 3H9V9H3V3ZM5 5V7H7V5H5ZM3 15H9V21H3V15ZM5 17V19H7V17H5ZM15 3H21V9H15V3ZM17 5V7H19V5H17ZM11 5H13V7H11V5ZM11 11H13V13H11V11ZM11 17H13V19H11V17ZM15 11H17V13H15V11ZM17 13H19V15H17V13ZM19 11H21V13H19V11ZM15 15H17V17H15V15ZM19 15H21V17H19V15ZM15 19H19V21H15V19ZM19 19H21V21H19V19ZM7 11H9V13H7V11ZM3 11H5V13H3V11ZM7 13H9V15H7V13ZM13 13H15V15H13V13ZM13 15H15V17H13V15ZM9 15H11V17H9V15ZM9 17H11V19H9V17ZM7 17H9V19H7V17ZM7 19H9V21H7V19ZM11 13H13V15H11V13ZM13 7H15V9H13V7ZM13 9H15V11H13V9ZM9 7H11V9H9V7ZM7 7H9V9H7V7ZM7 9H9V11H7V9ZM5 9H7V11H5V9ZM9 3H11V5H9V3ZM13 3H15V5H13V3Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">
              SCAN FOR VERIFIED PASSPORT
            </span>
          </div>
        </div>

        {/* Environmental & Circularity Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5" />
              Embodied Carbon Footprint
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-300">
              {dpp.carbonFootprintKg} kg CO2e
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Cradle-to-gate LCA ISO 14067
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
              <Recycle className="h-3.5 w-3.5" />
              Circularity &amp; Recyclability
            </span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              {dpp.circularityScorePct}% Score
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {dpp.recycledMaterialPct}% Recycled polymer casing
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5" />
              EU Compliance Declarations
            </span>
            <div className="text-2xl font-extrabold font-mono text-indigo-300">
              0 SVHC Toxins
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              RoHS 2011/65/EU • REACH • CE Mark
            </span>
          </div>
        </div>

        {/* Critical Raw Materials Declaration */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Critical Raw Materials (CRM) Tracking (EU CRM Act 2024):
          </span>
          <div className="flex flex-wrap gap-2">
            {dpp.criticalRawMaterials.map((crm, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/5 text-slate-300 border-white/10 font-mono">
                {crm}
              </Badge>
            ))}
          </div>
        </div>

        {/* Cryptographic SHA-256 Provenance Footer */}
        <div className="rounded-xl bg-black/60 border border-white/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-2 overflow-hidden text-slate-400">
            <span className="text-cyan-400 font-bold shrink-0">SHA-256 Hash:</span>
            <span className="truncate text-slate-300">{dpp.provenanceHash}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyHash}
            className="h-7 text-[10px] border-white/10 text-slate-300 shrink-0"
          >
            {copiedHash ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            <span>Copy Hash</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
