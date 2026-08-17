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
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Autonomous Industrial BOM &amp; RFP Bulk Optimizer
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              Multi-Agent Batch Ingestion
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resolve unstructured part descriptions, detect obsolete SKUs, filter counterfeit risks, and negotiate volume discounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-white/10 text-slate-200 text-xs font-medium rounded-xl hover:border-cyan-500/40 hover:bg-white/[0.04]"
          >
            <FileDown className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export Cleansed CSV</span>
          </Button>
        </div>
      </div>

      {/* Raw Input Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Upload className="h-3.5 w-3.5 text-cyan-400" />
            <span>Paste Industrial Requisition / BOM Lines</span>
          </span>
          <button
            onClick={() =>
              setRawText(
                `siemns simatic s7-1200 1214c dcdc dc 24v, qty: 25\nsm 1221 16 input 24vdc digital module, qty: 50\nab 1769-L32E compactlogix controller (OLD), qty: 10\nphoenix contact 24v 10a quint power supply, qty: 25\npilz pnoz s4 24vdc safety relay 3n/o 1n/c, qty: 25`
              )
            }
            className="text-[10px] text-cyan-400 hover:underline font-mono"
          >
            Load Sample Factory Requisition
          </button>
        </div>

        <Textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste messy part numbers, quantities, or manufacturer requisition lines..."
          className="min-h-28 font-mono text-xs bg-black/40 border-white/10 text-cyan-300 rounded-xl focus:border-cyan-500/50"
        />

        <div className="flex justify-end pt-1">
          <Button
            onClick={handleProcessBOM}
            disabled={isProcessing}
            className="h-10 px-6 gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Swarm Resolving SKUs...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Autonomous BOM Swarm Optimizer</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resolved Output Table */}
      <BomTableView items={items} />
    </div>
  );
}
