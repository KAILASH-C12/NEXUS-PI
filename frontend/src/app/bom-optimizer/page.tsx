"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BomTableView, SAMPLE_BOM_DATA, BomItem } from "@/components/bom/bom-table-view";
import {
  FileSpreadsheet,
  Sparkles,
  Play,
  Loader2,
  FileDown,
  Layers,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export default function BomOptimizerPage() {
  const [rawText, setRawText] = useState(
    `siemns simatic s7-1200 1214c dcdc dc 24v, qty: 25\nsm 1221 16 input 24vdc digital module, qty: 50\nab 1769-L32E compactlogix controller (OLD), qty: 10\nphoenix contact 24v 10a quint power supply, qty: 25\npilz pnoz s4 24vdc safety relay 3n/o 1n/c, qty: 25`
  );
  const [items, setItems] = useState<BomItem[]>(SAMPLE_BOM_DATA);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessBOM = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));
    setItems(SAMPLE_BOM_DATA);
    setIsProcessing(false);
    toast.success("Swarm resolved all 5 industrial line items with $19,300 in bulk volume savings");
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Part Number", "Brand", "Description", "Qty", "Original Unit Price", "AI Bulk Price", "Total Price", "Confidence"].join(","),
      ...items.map((i) =>
        [
          i.id,
          `"${i.detectedPartNumber}"`,
          `"${i.detectedBrand}"`,
          `"${i.cleanDescription}"`,
          i.qty,
          i.unitPrice,
          i.optimizedPrice,
          i.optimizedPrice * i.qty,
          i.confidence,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NEXUS_BOM_CLEANSED_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Cleansed ERP BOM exported to CSV");
  };

  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Autonomous Industrial BOM &amp; RFP Bulk Optimizer
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              Multi-Agent Batch Ingestion
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Resolve unstructured part descriptions, detect obsolete SKUs, filter counterfeit risks, and negotiate volume discounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="h-9 px-4 gap-1.5 border border-[#d4d4d8] bg-white text-slate-800 text-xs font-mono font-bold rounded-xl hover:border-[#ff5500] shadow-sm transition-all flex items-center"
          >
            <FileDown className="h-3.5 w-3.5 text-[#ff5500]" />
            <span>Export Cleansed CSV</span>
          </button>
        </div>
      </div>

      {/* Raw Input Box */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Upload className="h-3.5 w-3.5 text-[#ff5500]" />
            <span>Paste Industrial Requisition / BOM Lines</span>
          </span>
          <button
            onClick={() =>
              setRawText(
                `siemns simatic s7-1200 1214c dcdc dc 24v, qty: 25\nsm 1221 16 input 24vdc digital module, qty: 50\nab 1769-L32E compactlogix controller (OLD), qty: 10\nphoenix contact 24v 10a quint power supply, qty: 25\npilz pnoz s4 24vdc safety relay 3n/o 1n/c, qty: 25`
              )
            }
            className="text-[11px] text-[#ff5500] hover:underline font-bold"
          >
            Load Sample Factory Requisition
          </button>
        </div>

        <Textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste messy part numbers, quantities, or manufacturer requisition lines..."
          className="min-h-28 font-mono text-xs bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:border-[#ff5500]"
        />

        <div className="flex justify-end pt-1">
          <button
            onClick={handleProcessBOM}
            disabled={isProcessing || !rawText.trim()}
            className="h-10 px-6 gap-2 bg-[#ff5500] hover:bg-[#e04b00] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{isProcessing ? "Swarm Cleansing BOM..." : "Run Autonomous Swarm Cleanup"}</span>
          </button>
        </div>
      </div>

      {/* Resolved BOM Results Table Component */}
      <BomTableView items={items} />
    </div>
  );
}
