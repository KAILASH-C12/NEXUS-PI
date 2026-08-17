"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Mic,
  Camera,
  Cpu,
  Loader2,
  ArrowRight,
  RefreshCw,
  FileText,
  Layers,
  Database,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PipelineVisualizer } from "@/components/enrichment/pipeline-visualizer";
import { SpecsTable } from "@/components/enrichment/specs-table";
import { AgentSwarmGraph } from "@/components/enrichment/agent-swarm-graph";
import { LiveAgentThoughtStream } from "@/components/enrichment/live-agent-thought-stream";
import { VoiceInputModal } from "@/components/enrichment/voice-input-modal";
import { ImageUploadModal } from "@/components/enrichment/image-upload-modal";
import { NexusApiClient } from "@/lib/api-client";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { ProductOutput, StreamStageEvent } from "@/lib/types";
import { toast } from "sonner";

const QUICK_PRESETS = [
  { part: "6ES7214-1AG40-0XB0", brand: "Siemens", desc: "SIMATIC S7-1200 CPU 1214C DC/DC/DC Compact Controller" },
  { part: "ATV320U15N4B", brand: "Schneider Electric", desc: "Altivar Machine ATV320 1.5kW 400V 3-Phase Inverter" },
  { part: "E3Z-D61 2M", brand: "Omron", desc: "Photoelectric Sensor Diffuse-Reflective M8 100mm NPN IP69K" },
  { part: "1756-L83E", brand: "Rockwell Automation", desc: "Allen-Bradley ControlLogix 5580 Controller 10MB" },
];

function EnrichmentStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [partNumber, setPartNumber] = useState(qParam || "6ES7214-1AG40-0XB0");
  const [brand, setBrand] = useState("Siemens");
  const [description, setDescription] = useState("SIMATIC S7-1200 CPU 1214C DC/DC/DC Compact Controller");
  const [additionalContext, setAdditionalContext] = useState("");
  const [targetModel, setTargetModel] = useState("gpt-4o");

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const {
    activeProduct,
    setActiveProduct,
    addToHistory,
    isStreaming,
    setIsStreaming,
    streamEvents,
    addStreamEvent,
    resetStreamEvents,
  } = useEnrichmentStore();

  const [currentStage, setCurrentStage] = useState<string>("COMPLETE");
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (qParam) {
      setPartNumber(qParam);
    }
  }, [qParam]);

  const handleStartEnrichment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNumber.trim() || !brand.trim()) {
      toast.error("Please provide Part Number and Brand");
      return;
    }

    setIsStreaming(true);
    resetStreamEvents();
    setCurrentStage("INIT");
    setProgress(5);

    try {
      const result = await NexusApiClient.streamEnrichProduct(
        {
          part_number: partNumber.trim(),
          brand: brand.trim(),
          description: description.trim(),
          additional_context: additionalContext.trim() || null,
          target_model: targetModel,
        },
        (event: StreamStageEvent) => {
          addStreamEvent(event);
          setCurrentStage(event.stage);
          setProgress(event.progress);
        }
      );

      setActiveProduct(result);
      addToHistory(result);
      toast.success(`Enrichment complete for ${result.input.brand} ${result.input.part_number}`);
    } catch (err: any) {
      toast.error(`Enrichment error: ${err.message || "Failed"}`);
    } finally {
      setIsStreaming(false);
      setCurrentStage("COMPLETE");
      setProgress(100);
    }
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setPartNumber(preset.part);
    setBrand(preset.brand);
    setDescription(preset.desc);
    toast.info(`Loaded ${preset.brand} ${preset.part} preset`);
  };

  return (
    <div className="space-y-8 text-[#111113]">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Multimodal Enrichment Studio
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              6-Model Swarm
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Feed minimal product identifiers or raw text &mdash; our agents autonomously assemble verified 4D intelligence
          </p>
        </div>

        {activeProduct && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/results/${activeProduct.product_id}`)}
            className="border-2 border-[#111113] bg-white text-[#111113] hover:bg-slate-100 text-xs font-mono font-bold rounded-xl"
          >
            <span>Open Full Audit View</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        )}
      </div>

      {/* Input Formulation Card */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-md space-y-6">
        <form onSubmit={handleStartEnrichment} className="space-y-5">
          {/* Quick Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">Quick Presets:</span>
            {QUICK_PRESETS.map((p) => (
              <button
                key={p.part}
                type="button"
                onClick={() => applyPreset(p)}
                className="shrink-0 rounded-lg border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500]/10 hover:border-[#ff5500] hover:text-[#ff5500] px-2.5 py-1 text-[11px] text-slate-700 transition-all font-semibold"
              >
                {p.brand} {p.part}
              </button>
            ))}
          </div>

          {/* Primary Form Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            <div className="space-y-1.5">
              <label className="text-xs uppercase text-slate-700 font-bold flex items-center justify-between">
                <span>Manufacturer Part Number (MPN) *</span>
                <span className="text-[10px] text-[#ff5500]">Exact or Partial</span>
              </label>
              <Input
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. 6ES7214-1AG40-0XB0"
                className="bg-slate-50 border-[#d4d4d8] text-[#111113] font-bold text-sm h-10 rounded-xl focus:border-[#ff5500]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase text-slate-700 font-bold">
                Brand / Manufacturer Name *
              </label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Siemens, Schneider Electric, ABB, Omron"
                className="bg-slate-50 border-[#d4d4d8] text-[#111113] font-bold text-sm h-10 rounded-xl focus:border-[#ff5500]"
                required
              />
            </div>
          </div>

          {/* Description / Partial Specs */}
          <div className="space-y-1.5 font-mono">
            <label className="text-xs uppercase text-slate-700 font-bold">
              Raw Product Description / Partial Specs
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Compact CPU, 24V DC power supply, 14 digital inputs, 10 digital outputs..."
              className="bg-slate-50 border-[#d4d4d8] text-[#111113] text-xs min-h-[68px] rounded-xl focus:border-[#ff5500]"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                className="h-9 px-3 rounded-lg border border-[#d4d4d8] bg-slate-50 hover:border-[#ff5500] hover:text-[#ff5500] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all text-slate-800"
              >
                <Camera className="h-4 w-4 text-[#ff5500]" />
                <span>Scan Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                className="h-9 px-3 rounded-lg border border-[#d4d4d8] bg-slate-50 hover:border-[#ff5500] hover:text-[#ff5500] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all text-slate-800"
              >
                <Mic className="h-4 w-4 text-emerald-600" />
                <span>Dictate</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isStreaming}
              className="h-11 px-8 rounded-xl bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all flex items-center gap-2"
            >
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Swarm Orchestrating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Execute Multi-Agent Enrichment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Real-Time Pipeline Progress */}
      {isStreaming && (
        <div className="space-y-4">
          <PipelineVisualizer currentStage={currentStage} progress={progress} events={streamEvents} />
          <LiveAgentThoughtStream />
        </div>
      )}

      {/* Enriched Result Preview */}
      {activeProduct && !isStreaming && (
        <div className="space-y-6">
          <SpecsTable
            specifications={activeProduct.specifications}
            partNumber={activeProduct.input.part_number}
          />
        </div>
      )}

      {/* Modals */}
      <VoiceInputModal
        open={voiceOpen}
        onOpenChange={setVoiceOpen}
        onTranscriptionComplete={(data) => {
          if (data.partNumber) setPartNumber(data.partNumber);
          if (data.brand) setBrand(data.brand);
          if (data.description) setDescription(data.description);
        }}
      />
      <ImageUploadModal
        open={imageOpen}
        onOpenChange={setImageOpen}
        onImageExtracted={(data) => {
          if (data.partNumber) setPartNumber(data.partNumber);
          if (data.brand) setBrand(data.brand);
          if (data.description) setDescription(data.description);
        }}
      />
    </div>
  );
}

export default function EnrichmentStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-slate-500">Loading Studio...</div>}>
      <EnrichmentStudioContent />
    </Suspense>
  );
}
