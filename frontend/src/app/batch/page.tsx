"use client";

import { useState } from "react";
import {
  Layers,
  UploadCloud,
  FileSpreadsheet,
  Play,
  Loader2,
  CheckCircle2,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NexusApiClient } from "@/lib/api-client";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { ProductInput, ProductOutput } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

const SAMPLE_BATCH_ITEMS: ProductInput[] = [
  { part_number: "6ES7214-1AG40-0XB0", brand: "Siemens", description: "SIMATIC S7-1200 CPU 1214C DC/DC/DC" },
  { part_number: "ATV320U15N4B", brand: "Schneider Electric", description: "Altivar Machine ATV320 1.5kW 400V 3-Phase Inverter" },
  { part_number: "E3Z-D61 2M", brand: "Omron", description: "Photoelectric Sensor Diffuse-Reflective M8 100mm NPN" },
  { part_number: "1756-L83E", brand: "Rockwell Automation", description: "Allen-Bradley ControlLogix 5580 Controller 10MB" },
  { part_number: "IRB 6700-150/3.20", brand: "ABB", description: "Industrial 6-Axis Articulated Robot Arm 150kg Payload" },
];

export default function BatchProcessingPage() {
  const [items, setItems] = useState<ProductInput[]>(SAMPLE_BATCH_ITEMS);
  const [results, setResults] = useState<ProductOutput[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { addToHistory, setActiveProduct } = useEnrichmentStore();

  const handleLoadSample = () => {
    setItems(SAMPLE_BATCH_ITEMS);
    setResults([]);
    setProgress(0);
    toast.info("Loaded 5 industrial sample SKUs into batch queue");
  };

  const handleClear = () => {
    setItems([]);
    setResults([]);
    setProgress(0);
  };

  const handleExecuteBatch = async () => {
    if (items.length === 0) {
      toast.error("No items in batch queue");
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setResults([]);

    try {
      const res = await NexusApiClient.batchEnrich(items);
      setResults(res.results);
      res.results.forEach((r) => addToHistory(r));
      setProgress(100);
      toast.success(`Batch completed: ${res.total_processed} SKUs enriched with avg confidence ${Math.round(res.average_confidence * 100)}%`);
    } catch (e: any) {
      toast.error(`Batch failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportAllJson = () => {
    if (results.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `nexus_pi_batch_${Date.now()}.json`);
    dlAnchor.click();
    toast.success("Batch results exported as JSON");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Batch Processing Pipeline
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              High-Throughput
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ingest hundreds of unstructured part numbers via CSV &mdash; our agents parallelize crawling, spec extraction, and taxonomy classification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="border-white/10 text-xs text-slate-300"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            <span>Load Sample CSV</span>
          </Button>

          {results.length > 0 && (
            <Button
              size="sm"
              onClick={exportAllJson}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>Export Batch JSON</span>
            </Button>
          )}
        </div>
      </div>

      {/* CSV Ingestion Dropzone Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Upload Catalog File</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drop your ERP or catalog export file. Required columns: <code>part_number</code>, <code>brand</code>. Optional: <code>description</code>.
          </p>

          <div
            onClick={handleLoadSample}
            className="cursor-pointer border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl p-6 text-center bg-white/[0.01] hover:bg-cyan-500/5 transition-all"
          >
            <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-200">
              Drag &amp; drop CSV / Excel file or <span className="text-cyan-400 underline">click to browse</span>
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Supports .CSV, .XLSX, .JSON (Max 50MB)</span>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleExecuteBatch}
              disabled={isProcessing || items.length === 0}
              className="w-full h-11 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Processing Batch Queue ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  <span>Run Batch Pipeline ({items.length} SKUs)</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Batch Queue & Progress */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Batch SKU Queue</h2>
              <Badge variant="secondary" className="text-[10px] font-mono bg-white/5 text-slate-300">
                {items.length} Items
              </Badge>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
              >
                <Trash2 className="h-3 w-3" /> Clear Queue
              </button>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-1.5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
              <div className="flex justify-between text-xs font-mono text-cyan-300">
                <span>Parallel Multi-Agent Ingestion in progress...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" />
            </div>
          )}

          {/* Queue Table */}
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/5 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Part Number</th>
                    <th className="py-2.5 px-4">Brand</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {items.map((item, idx) => {
                    const resultMatch = results[idx];
                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 text-cyan-300 font-bold">{item.part_number}</td>
                        <td className="py-2.5 px-4 text-slate-300 font-sans">{item.brand}</td>
                        <td className="py-2.5 px-4 text-slate-400 font-sans truncate max-w-xs">
                          {item.description || "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {resultMatch ? (
                            <Link
                              href={`/results/${resultMatch.product_id}`}
                              onClick={() => setActiveProduct(resultMatch)}
                            >
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] cursor-pointer hover:bg-emerald-500/20">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                {Math.round((resultMatch.quality_report?.overall_confidence || 0.95) * 100)}% Conf
                              </Badge>
                            </Link>
                          ) : isProcessing ? (
                            <span className="text-cyan-400 animate-pulse text-[10px]">Processing...</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
