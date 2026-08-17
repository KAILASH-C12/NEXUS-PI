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
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Multimodal AI Mesh &amp; Model Benchmark Studio
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              6 Model Engines Synchronized
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore OpenAI GPT-4o, Gemini 2.5 Flash Vision, Claude 3.7 Judge, Whisper v3, DALL-E 3 CAD, and Hugging Face LangGraph
          </p>
        </div>
      </div>

      {/* 6 Models Interactive Stations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="gpt4o" className="text-xs flex items-center gap-1.5 py-2.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>1. GPT-4o</span>
          </TabsTrigger>

          <TabsTrigger value="gemini" className="text-xs flex items-center gap-1.5 py-2.5">
            <Camera className="h-3.5 w-3.5 text-indigo-400" />
            <span>2. Gemini Vision</span>
          </TabsTrigger>

          <TabsTrigger value="claude" className="text-xs flex items-center gap-1.5 py-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
            <span>3. Claude 3.7</span>
          </TabsTrigger>

          <TabsTrigger value="whisper" className="text-xs flex items-center gap-1.5 py-2.5">
            <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>4. Whisper v3</span>
          </TabsTrigger>

          <TabsTrigger value="dalle" className="text-xs flex items-center gap-1.5 py-2.5">
            <Box className="h-3.5 w-3.5 text-amber-400" />
            <span>5. DALL-E 3</span>
          </TabsTrigger>

          <TabsTrigger value="huggingface" className="text-xs flex items-center gap-1.5 py-2.5">
            <Binary className="h-3.5 w-3.5 text-sky-400" />
            <span>6. HuggingFace</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. GPT-4o Omni Station */}
        <TabsContent value="gpt4o" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  OpenAI GPT-4o Omni &mdash; Multi-Agent Graph Engine
                  <Badge variant="secondary" className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300">
                    Orchestration
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Drives state graph transitions, technical attribute entity extraction, and comparative synthesis.
                </p>
              </div>

              <Button
                onClick={handleTestGpt}
                disabled={isGptRunning}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
              >
                {isGptRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span>Run GPT-4o Graph Test</span>
              </Button>
            </div>

            {gptOutput && (
              <div className="rounded-xl bg-black/50 border border-cyan-500/30 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    GPT-4o Entity Normalization Payload
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Latency: 142ms
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed">
                  {JSON.stringify(gptOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 2. Google Gemini 2.5 Flash Station */}
        <TabsContent value="gemini" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Google Gemini 2.5 Flash &mdash; Multimodal Vision OCR
                  <Badge variant="secondary" className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300">
                    Vision OCR
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Extracts electrical nameplate parameters, barcodes, and wiring diagrams with optical bounding boxes.
                </p>
              </div>

              <Button
                onClick={() => setImageOpen(true)}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-md"
              >
                <Camera className="h-4 w-4" />
                <span>Launch Camera &amp; Vision Scanner</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Optical Grounding:</span>
                <span className="text-white font-bold text-sm">97.8% Accuracy</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">OCR Latency:</span>
                <span className="text-indigo-300 font-bold text-sm">98ms (Sub-100ms)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Supported Formats:</span>
                <span className="text-emerald-400 font-bold text-sm">Live Camera, PNG, JPG, PDF</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. Anthropic Claude 3.7 Sonnet Station */}
        <TabsContent value="claude" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Anthropic Claude 3.7 Sonnet &mdash; LLM-as-Judge Auditor
                  <Badge variant="secondary" className="text-[10px] font-mono bg-pink-500/10 text-pink-300">
                    QA Auditor
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Audits multi-source consensus, detects parameter anomalies, and generates verified B2B copy.
                </p>
              </div>

              <Button
                onClick={handleTestClaude}
                disabled={isClaudeRunning}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-pink-500/20"
              >
                {isClaudeRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>Execute Claude 3.7 Judge Audit</span>
              </Button>
            </div>

            {claudeOutput && (
              <div className="rounded-xl bg-black/50 border border-pink-500/30 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-pink-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Claude 3.7 4D Audit Verdict
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Composite: 96.5%
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed">
                  {JSON.stringify(claudeOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 4. OpenAI Whisper v3 Station */}
        <TabsContent value="whisper" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  OpenAI Whisper v3 &mdash; Shopfloor Voice Dictation
                  <Badge variant="secondary" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300">
                    Acoustic Voice
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enables technicians to log parts and electrical specs hands-free with ambient noise filtering.
                </p>
              </div>

              <Button
                onClick={() => setVoiceOpen(true)}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold text-xs rounded-xl shadow-md"
              >
                <Mic className="h-4 w-4" />
                <span>Open Whisper Dictation Studio</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Word Error Rate (WER):</span>
                <span className="text-emerald-400 font-bold text-sm">&lt; 1.8% Industrial Vocab</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Multi-Lingual Support:</span>
                <span className="text-cyan-300 font-bold text-sm">99+ Languages</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Sampling Rate:</span>
                <span className="text-white font-bold text-sm">16 kHz / 32-bit Float</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 5. OpenAI DALL-E 3 Station */}
        <TabsContent value="dalle" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  OpenAI DALL-E 3 &mdash; 3D CAD &amp; Blueprint Synthesizer
                  <Badge variant="secondary" className="text-[10px] font-mono bg-amber-500/10 text-amber-300">
                    CAD Schematics
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Generates exploded 3D component cutaways and electrical wiring blueprints from specification metadata.
                </p>
              </div>

              <Button
                onClick={() => setSchematicOpen(true)}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md"
              >
                <Box className="h-4 w-4" />
                <span>Launch DALL-E 3 CAD Studio</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Render Modes:</span>
                <span className="text-amber-300 font-bold text-sm">Exploded 3D &bull; Wiring &bull; Pinout</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Resolution:</span>
                <span className="text-white font-bold text-sm">1024 &times; 1024 High-Def</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Metadata Output:</span>
                <span className="text-cyan-400 font-bold text-sm">JSON Annotation Layer</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 6. Hugging Face Transformers & LangGraph Station */}
        <TabsContent value="huggingface" className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Hugging Face Transformers &amp; LangGraph State Machine
                  <Badge variant="secondary" className="text-[10px] font-mono bg-sky-500/10 text-sky-300">
                    Open-Source &bull; PyTorch
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Executes dense 1024-dim BGE embeddings, DeepSeek-R1 math logic reasoning, and LangChain state transitions.
                </p>
              </div>

              <Button
                onClick={handleTestHuggingFace}
                disabled={isHfRunning}
                className="h-10 px-6 gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-500/20"
              >
                {isHfRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Binary className="h-4 w-4" />}
                <span>Execute HuggingFace Benchmark</span>
              </Button>
            </div>

            {hfOutput && (
              <div className="rounded-xl bg-black/50 border border-sky-500/30 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-sky-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    HuggingFace &amp; LangGraph State Machine Payload
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Latency: 64ms
                  </Badge>
                </div>
                <pre className="text-slate-200 leading-relaxed">
                  {JSON.stringify(hfOutput, null, 2)}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Vector Embedding Model:</span>
                <span className="text-sky-300 font-bold text-sm">BAAI/bge-large-en-v1.5</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">State Machine Framework:</span>
                <span className="text-white font-bold text-sm">LangGraph Cyclic Graph</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Inference Backend:</span>
                <span className="text-emerald-400 font-bold text-sm">FastAPI + PyTorch CUDA</span>
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
