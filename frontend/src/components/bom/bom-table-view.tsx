"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingDown,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export interface BomItem {
  id: string;
  rawInput: string;
  detectedBrand: string;
  detectedPartNumber: string;
  cleanDescription: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  optimizedPrice: number;
  confidence: number;
  status: "ACTIVE_MATCH" | "OBSOLETE_REPLACED" | "COUNTERFEIT_RISK_CLEAR";
  replacementSuggestion?: string;
  leadTime: string;
}

export const SAMPLE_BOM_DATA: BomItem[] = [
  {
    id: "BOM-001",
    rawInput: "siemns simatic s7-1200 1214c dcdc dc 24v",
    detectedBrand: "Siemens",
    detectedPartNumber: "6ES7214-1AG40-0XB0",
    cleanDescription: "SIMATIC S7-1200 CPU 1214C DC/DC/DC Compact Controller",
    qty: 25,
    unitPrice: 420,
    totalPrice: 10500,
    optimizedPrice: 345,
    confidence: 0.985,
    status: "ACTIVE_MATCH",
    leadTime: "2 Days (In Stock)",
  },
  {
    id: "BOM-002",
    rawInput: "sm 1221 16 input 24vdc digital module",
    detectedBrand: "Siemens",
    detectedPartNumber: "6ES7221-1BH32-0XB0",
    cleanDescription: "Signal Module SM 1221, 16 DI 24V DC Digital Expansion",
    qty: 50,
    unitPrice: 185,
    totalPrice: 9250,
    optimizedPrice: 152,
    confidence: 0.978,
    status: "ACTIVE_MATCH",
    leadTime: "3 Days",
  },
  {
    id: "BOM-003",
    rawInput: "ab 1769-L32E compactlogix controller (OLD)",
    detectedBrand: "Rockwell AB",
    detectedPartNumber: "1769-L32E",
    cleanDescription: "CompactLogix 5370 L32E (Obsolete / Discontinued 2022)",
    qty: 10,
    unitPrice: 1650,
    totalPrice: 16500,
    optimizedPrice: 680,
    confidence: 0.962,
    status: "OBSOLETE_REPLACED",
    replacementSuggestion: "Siemens 6ES7215-1AG40-0XB0 (Drop-In S7-1215C Dual Port)",
    leadTime: "Drop-in Ready",
  },
  {
    id: "BOM-004",
    rawInput: "phoenix contact 24v 10a quint power supply",
    detectedBrand: "Phoenix Contact",
    detectedPartNumber: "2904601",
    cleanDescription: "QUINT4-PS/1AC/24DC/10 Power Supply Unit Primary Switched",
    qty: 25,
    unitPrice: 310,
    totalPrice: 7750,
    optimizedPrice: 260,
    confidence: 0.991,
    status: "ACTIVE_MATCH",
    leadTime: "1 Day",
  },
  {
    id: "BOM-005",
    rawInput: "pilz pnoz s4 24vdc safety relay 3n/o 1n/c",
    detectedBrand: "Pilz",
    detectedPartNumber: "750104",
    cleanDescription: "PNOZ s4 24VDC 3 n/o 1 n/c E-Stop Safety Relay",
    qty: 25,
    unitPrice: 220,
    totalPrice: 5500,
    optimizedPrice: 188,
    confidence: 0.984,
    status: "ACTIVE_MATCH",
    leadTime: "2 Days",
  },
];

export function BomTableView({
  items,
  onResolveItem,
}: {
  items: BomItem[];
  onResolveItem?: (item: BomItem) => void;
}) {
  const totalOriginal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalOptimized = items.reduce((acc, i) => acc + i.optimizedPrice * i.qty, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const savingsPct = Math.round((totalSavings / totalOriginal) * 100);

  return (
    <div className="space-y-6">
      {/* Financial Savings Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Original Requisition Value
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-200">
            ${totalOriginal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {items.length} Industrial line items
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            AI Consolidated Bulk Price
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            ${totalOptimized.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block">
            Total Savings: ${totalSavings.toLocaleString()} ({savingsPct}% Discount)
          </span>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Average Provenance Score
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            98.0%
          </div>
          <span className="text-[11px] text-slate-400 block">
            0 Counterfeit risks detected
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
              <span>Resolved Bill of Materials Intelligence Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous multi-agent entity resolution, unit pricing optimization, and obsolescence replacement
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
            {items.length} Lines Cleansed
          </Badge>
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Raw Input / Cleansed Part</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">AI Bulk Price</th>
                <th className="py-3 px-4 text-center">4D Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.detectedPartNumber}</span>
                      {item.status === "OBSOLETE_REPLACED" && (
                        <Badge variant="secondary" className="text-[9px] bg-amber-500/20 text-amber-300 border-none font-sans">
                          Obsolete
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                      {item.cleanDescription}
                    </div>
                    {item.replacementSuggestion && (
                      <div className="text-[10px] text-cyan-400 font-sans flex items-center gap-1 mt-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Recommended: {item.replacementSuggestion}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{item.detectedBrand}</td>
                  <td className="py-3 px-4 text-center font-bold text-white">{item.qty}</td>
                  <td className="py-3 px-4 text-right text-slate-400 line-through">
                    ${item.unitPrice}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                    ${item.optimizedPrice}
                    <span className="text-[9px] text-emerald-500 block font-sans">
                      (-{Math.round(((item.unitPrice - item.optimizedPrice) / item.unitPrice) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "ACTIVE_MATCH" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> {Math.round(item.confidence * 100)}% Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="h-3 w-3" /> Drop-In Mapped
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
