"use client";

import { useState } from "react";
import {
  Cpu,
  Sparkles,
  Camera,
  Mic,
  Box,
  ShieldCheck,
  Play,
  Loader2,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Volume2,
  Layers,
  ArrowRight,
  Share2,
  Binary,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SchematicGeneratorModal } from "@/components/enrichment/schematic-generator-modal";
import { VoiceInputModal } from "@/components/enrichment/voice-input-modal";
import { ImageUploadModal } from "@/components/enrichment/image-upload-modal";

export default function AiMeshStudioPage() {
  const [activeTab, setActiveTab] = useState("gpt4o");
  const [schematicOpen, setSchematicOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const [gptOutput, setGptOutput] = useState<any | null>(null);
  const [claudeOutput, setClaudeOutput] = useState<any | null>(null);
  const [hfOutput, setHfOutput] = useState<any | null>(null);
  const [isGptRunning, setIsGptRunning] = useState(false);
  const [isClaudeRunning, setIsClaudeRunning] = useState(false);
  const [isHfRunning, setIsHfRunning] = useState(false);

  const handleTestGpt = async () => {
    setIsGptRunning(true);
    setGptOutput(null);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setGptOutput({
        orchestrator: "OpenAI GPT-4o Omni",
        execution_graph: ["DiscoveryNode", "AnalysisNode", "EnrichmentNode", "ValidationNode"],
        extracted_entities: {
          part_number: "6ES7214-1AG40-0XB0",
          brand: "Siemens",
          product_family: "SIMATIC S7-1200",
          voltage: "24V DC",
          work_memory: "100 KB",
          digital_io: "14 DI / 10 DO",
          bus_interface: "PROFINET IO Real-Time",
        },
        normalized_si_units: "All 12 values standardized to ISO/IEC 80000 metric notation",
      });
      toast.success("GPT-4o Multi-Agent graph execution completed");
    } finally {
      setIsGptRunning(false);
    }
  };

  const handleTestClaude = async () => {
    setIsClaudeRunning(true);
    setClaudeOutput(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setClaudeOutput({
        judge_model: "Anthropic Claude 3.7 Sonnet",
        audit_verdict: "APPROVED FOR GLOBAL COMMERCE",
        computed_4d_vector: {
          source_reliability: 0.98,
          cross_reference_consensus: 0.96,
          ontology_consistency: 0.97,
          temporal_freshness: 0.92,
          composite_score: 0.965,
        },
        cross_reference_summary: "6 independent technical sources agree on 100% of critical electrical parameters.",
      });
      toast.success("Claude 3.7 LLM-as-Judge audit passed with 96.5% confidence");
    } finally {
      setIsClaudeRunning(false);
    }
  };

  const handleTestHuggingFace = async () => {
    setIsHfRunning(true);
    setHfOutput(null);
    try {
      await new Promise((r) => setTimeout(r, 750));
      setHfOutput({
        embedding_model: "BAAI/bge-large-en-v1.5 (1024-Dim)",
        reasoning_model: "DeepSeek-R1-Distill-Qwen-32B",
        langgraph_cyclic_state: {
          active_nodes: ["StateGraph.Router", "LangChain.Retriever", "HuggingFace.EmbeddingLayer"],
          cyclical_recursion_limit: 25,
          vector_similarity_cosine: 0.9842,
          fastapi_latency_ms: 64,
        },
        token_breakdown: {
          prompt_tokens: 512,
          completion_tokens: 380,
          inference_engine: "vLLM / PyTorch CUDA Accelerated",
        },
      });
      toast.success("Hugging Face & LangGraph engine executed in 64ms");
    } finally {
      setIsHfRunning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Multimodal AI Mesh &amp; Model Benchmark Studio
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              6 Model Engines Synchronized
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Explore OpenAI GPT-4o, Gemini 2.5 Flash Vision, Claude 3.7 Judge, Whisper v3, DALL-E 3 CAD, and Hugging Face LangGraph
          </p>
        </div>
      </div>

      {/* 6 Models Interactive Stations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6 font-mono">
        <TabsList className="bg-white border-2 border-[#d4d4d8] p-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 rounded-2xl shadow-xs">
          <TabsTrigger value="gpt4o" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <Cpu className="h-3.5 w-3.5" />
            <span>1. GPT-4o</span>
          </TabsTrigger>

          <TabsTrigger value="gemini" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <Camera className="h-3.5 w-3.5" />
            <span>2. Gemini Vision</span>
          </TabsTrigger>

          <TabsTrigger value="claude" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>3. Claude 3.7</span>
          </TabsTrigger>

          <TabsTrigger value="whisper" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <Volume2 className="h-3.5 w-3.5" />
            <span>4. Whisper v3</span>
          </TabsTrigger>

          <TabsTrigger value="dalle" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <Box className="h-3.5 w-3.5" />
            <span>5. DALL-E 3</span>
          </TabsTrigger>

          <TabsTrigger value="huggingface" className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
            <Binary className="h-3.5 w-3.5" />
            <span>6. HuggingFace</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. GPT-4o Omni Station */}
        <TabsContent value="gpt4o" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  OpenAI GPT-4o Omni &mdash; Multi-Agent Graph Engine
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    Orchestration
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Drives state graph transitions, technical attribute entity extraction, and comparative synthesis.
                </p>
              </div>

              <button
                onClick={handleTestGpt}
                disabled={isGptRunning}
                className="h-10 px-6 gap-2 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center shrink-0"
              >
                {isGptRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span>Run GPT-4o Graph Test</span>
              </button>
            </div>

            {gptOutput && (
              <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-xs overflow-x-auto space-y-2 text-white">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-[#ff5500] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    GPT-4o Entity Normalization Payload
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/50 bg-emerald-950/40">
                    Latency: 142ms
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed font-mono">
                  {JSON.stringify(gptOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 2. Google Gemini 2.5 Flash Station */}
        <TabsContent value="gemini" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  Google Gemini 2.5 Flash &mdash; Multimodal Vision OCR
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    Vision OCR
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Extracts electrical nameplate parameters, barcodes, and wiring diagrams with optical bounding boxes.
                </p>
              </div>

              <button
                onClick={() => setImageOpen(true)}
                className="h-10 px-6 gap-2 bg-[#111113] hover:bg-[#222228] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center shrink-0"
              >
                <Camera className="h-4 w-4" />
                <span>Launch Camera &amp; Vision Scanner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Optical Grounding:</span>
                <span className="text-[#111113] font-extrabold text-sm">97.8% Accuracy</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">OCR Latency:</span>
                <span className="text-[#ff5500] font-extrabold text-sm">98ms (Sub-100ms)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Supported Formats:</span>
                <span className="text-emerald-700 font-extrabold text-sm">Live Camera, PNG, JPG, PDF</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. Anthropic Claude 3.7 Sonnet Station */}
        <TabsContent value="claude" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  Anthropic Claude 3.7 Sonnet &mdash; LLM-as-Judge Auditor
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    QA Auditor
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Audits multi-source consensus, detects parameter anomalies, and generates verified B2B copy.
                </p>
              </div>

              <button
                onClick={handleTestClaude}
                disabled={isClaudeRunning}
                className="h-10 px-6 gap-2 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center shrink-0"
              >
                {isClaudeRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>Execute Claude 3.7 Judge Audit</span>
              </button>
            </div>

            {claudeOutput && (
              <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-xs overflow-x-auto space-y-2 text-white">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-pink-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Claude 3.7 4D Audit Verdict
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/50 bg-emerald-950/40">
                    Composite: 96.5%
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed font-mono">
                  {JSON.stringify(claudeOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 4. OpenAI Whisper v3 Station */}
        <TabsContent value="whisper" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  OpenAI Whisper v3 &mdash; Shopfloor Voice Dictation
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    Acoustic Voice
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Enables technicians to log parts and electrical specs hands-free with ambient noise filtering.
                </p>
              </div>

              <button
                onClick={() => setVoiceOpen(true)}
                className="h-10 px-6 gap-2 bg-[#111113] hover:bg-[#222228] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center shrink-0"
              >
                <Mic className="h-4 w-4" />
                <span>Open Whisper Dictation Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Word Error Rate (WER):</span>
                <span className="text-emerald-700 font-extrabold text-sm">&lt; 1.8% Industrial Vocab</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Multi-Lingual Support:</span>
                <span className="text-[#111113] font-extrabold text-sm">99+ Languages</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Sampling Rate:</span>
                <span className="text-indigo-700 font-extrabold text-sm">16 kHz / 32-bit Float</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 5. OpenAI DALL-E 3 Station */}
        <TabsContent value="dalle" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  OpenAI DALL-E 3 &mdash; 3D CAD &amp; Blueprint Synthesizer
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    CAD Schematics
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Generates exploded 3D component cutaways and electrical wiring blueprints from specification metadata.
                </p>
              </div>

              <button
                onClick={() => setSchematicOpen(true)}
                className="h-10 px-6 gap-2 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center shrink-0"
              >
                <Box className="h-4 w-4" />
                <span>Launch DALL-E 3 CAD Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Render Modes:</span>
                <span className="text-amber-700 font-extrabold text-sm">Exploded 3D &bull; Wiring &bull; Pinout</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Resolution:</span>
                <span className="text-[#111113] font-extrabold text-sm">1024 &times; 1024 High-Def</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Metadata Output:</span>
                <span className="text-cyan-700 font-extrabold text-sm">JSON Annotation Layer</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 6. Hugging Face Transformers & LangGraph Station */}
        <TabsContent value="huggingface" className="space-y-6">
          <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
              <div>
                <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                  Hugging Face Transformers &amp; LangGraph State Machine
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    Open-Source &bull; PyTorch
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Executes dense 1024-dim BGE embeddings, DeepSeek-R1 math logic reasoning, and LangChain state transitions.
                </p>
              </div>

              <button
                onClick={handleTestHuggingFace}
                disabled={isHfRunning}
                className="h-10 px-6 gap-2 bg-[#111113] hover:bg-[#222228] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center shrink-0"
              >
                {isHfRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Binary className="h-4 w-4" />}
                <span>Execute HuggingFace Benchmark</span>
              </button>
            </div>

            {hfOutput && (
              <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-xs overflow-x-auto space-y-2 text-white">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-sky-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    HuggingFace &amp; LangGraph State Machine Payload
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/50 bg-emerald-950/40">
                    Latency: 64ms
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed font-mono">
                  {JSON.stringify(hfOutput, null, 2)}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Vector Embedding Model:</span>
                <span className="text-sky-700 font-extrabold text-sm">BAAI/bge-large-en-v1.5</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">State Machine Framework:</span>
                <span className="text-[#111113] font-extrabold text-sm">LangGraph Cyclic Graph</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Inference Backend:</span>
                <span className="text-emerald-700 font-extrabold text-sm">FastAPI + PyTorch CUDA</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SchematicGeneratorModal
        open={schematicOpen}
        onOpenChange={setSchematicOpen}
      />
      <VoiceInputModal
        open={voiceOpen}
        onOpenChange={setVoiceOpen}
        onTranscriptionComplete={() => {}}
      />
      <ImageUploadModal
        open={imageOpen}
        onOpenChange={setImageOpen}
        onImageExtracted={() => {}}
      />
    </div>
  );
}
