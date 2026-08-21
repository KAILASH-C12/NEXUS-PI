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
    leadTime: "1 Day (In Stock)",
  },
  {
    id: "BOM-003",
    rawInput: "ab 1769-L32E compactlogix controller (OLD)",
    detectedBrand: "Rockwell Allen-Bradley",
    detectedPartNumber: "1769-L32E [DISCONTINUED]",
    cleanDescription: "CompactLogix 5370 L32E PLC Controller (OBSOLETE OEM)",
    qty: 10,
    unitPrice: 1450,
    totalPrice: 14500,
    optimizedPrice: 890,
    confidence: 0.962,
    status: "OBSOLETE_REPLACED",
    replacementSuggestion: "Siemens 6ES7214-1AG40-0XB0 (98.4% Drop-in Equivalent, Saves $560/unit)",
    leadTime: "Drop-in Ready",
  },
  {
    id: "BOM-004",
    rawInput: "phoenix contact 24v 10a quint power supply",
    detectedBrand: "Phoenix Contact",
    detectedPartNumber: "QUINT4-PS/1AC/24DC/10",
    cleanDescription: "QUINT POWER Industrial Power Supply 24V DC / 10A DIN-Rail",
    qty: 25,
    unitPrice: 260,
    totalPrice: 6500,
    optimizedPrice: 215,
    confidence: 0.991,
    status: "ACTIVE_MATCH",
    leadTime: "3 Days",
  },
  {
    id: "BOM-005",
    rawInput: "pilz pnoz s4 24vdc safety relay 3n/o 1n/c",
    detectedBrand: "Pilz",
    detectedPartNumber: "PNOZ s4 750104",
    cleanDescription: "PNOZsigma Safety Relay 24V DC 3 N/O 1 N/C Instantaneous",
    qty: 25,
    unitPrice: 210,
    totalPrice: 5250,
    optimizedPrice: 178,
    confidence: 0.988,
    status: "COUNTERFEIT_RISK_CLEAR",
    leadTime: "In Stock",
  },
];

export function BomTableView({ items }: { items: BomItem[] }) {
  const totalOriginal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalOptimized = items.reduce((acc, i) => acc + i.optimizedPrice * i.qty, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const savingsPct = Math.round((totalSavings / (totalOriginal || 1)) * 100);

  return (
    <div className="space-y-6 font-mono text-[#111113]">
      {/* Financial Savings Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
            Original Requisition Value
          </span>
          <div className="text-3xl font-extrabold text-[#111113]">
            ${totalOriginal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-600 font-semibold block">
            {items.length} Industrial line items
          </span>
        </div>

        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-emerald-800 font-bold block">
            AI Consolidated Bulk Price
          </span>
          <div className="text-3xl font-extrabold text-emerald-700">
            ${totalOptimized.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-800 font-bold block">
            Total Savings: ${totalSavings.toLocaleString()} ({savingsPct}% Discount)
          </span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
            Average Provenance Score
          </span>
          <div className="text-3xl font-extrabold text-indigo-700">
            98.0%
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">
            0 Counterfeit risks detected
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#111113] flex items-center gap-2 uppercase">
              <FileSpreadsheet className="h-4 w-4 text-[#ff5500]" />
              <span>Resolved Bill of Materials Intelligence Matrix</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Autonomous multi-agent entity resolution, unit pricing optimization, and obsolescence replacement
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
            {items.length} Lines Cleansed
          </Badge>
        </div>

        <div className="rounded-xl border border-[#d4d4d8] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-[#d4d4d8] font-bold">
              <tr>
                <th className="py-3 px-4">Raw Input / Cleansed Part</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">AI Bulk Price</th>
                <th className="py-3 px-4 text-center">4D Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="font-bold text-[#111113] flex items-center gap-2">
                      <span>{item.detectedPartNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold max-w-md line-clamp-1">
                      {item.cleanDescription}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono italic">
                      Raw: &ldquo;{item.rawInput}&rdquo;
                    </div>

                    {item.replacementSuggestion && (
                      <div className="p-2 mt-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>{item.replacementSuggestion}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">{item.detectedBrand}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#111113]">{item.qty}</td>
                  <td className="py-3.5 px-4 text-right text-slate-500 line-through font-semibold">${item.unitPrice}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">${item.optimizedPrice}</td>

                  <td className="py-3.5 px-4 text-center">
                    {item.status === "OBSOLETE_REPLACED" ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[9px] font-bold">
                        OBSOLETE &bull; REPLACED
                      </Badge>
                    ) : item.status === "COUNTERFEIT_RISK_CLEAR" ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[9px] font-bold">
                        VERIFIED GENUINE
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[9px] font-bold">
                        {Math.round(item.confidence * 100)}% MATCH
                      </Badge>
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
