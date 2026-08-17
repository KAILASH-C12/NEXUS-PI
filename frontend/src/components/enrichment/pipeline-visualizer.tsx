"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Binary,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  Sparkles,
} from "lucide-react";
import { StreamStageEvent } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface PipelineVisualizerProps {
  currentStage?: string;
  progress?: number;
  events?: StreamStageEvent[];
  isStreaming?: boolean;
}

const STAGES = [
  {
    id: "DISCOVERY",
    title: "1. Autonomous Discovery",
    agent: "Discovery Agent",
    model: "Gemini 2.5 Flash / SerpAPI",
    icon: Globe,
    desc: "OEM datasheets, PDF manuals, distributors",
  },
  {
    id: "ANALYSIS",
    title: "2. Schema Normalization",
    agent: "Analysis Agent",
    model: "GPT-4o",
    icon: Binary,
    desc: "Entity extraction, SI unit parser, UNSPSC/eCl@ss",
  },
  {
    id: "ENRICHMENT",
    title: "3. Commerce Intelligence",
    agent: "Enrichment Agent",
    model: "Claude 3.7 Sonnet",
    icon: PenTool,
    desc: "Long descriptions, feature bullets, SEO meta",
  },
  {
    id: "VALIDATION",
    title: "4. 4D QA & Provenance",
    agent: "Validation Agent",
    model: "LLM-as-Judge 4D Engine",
    icon: CheckCircle2,
    desc: "Cross-ref audit, anomaly detection, HITL gate",
  },
];

export function PipelineVisualizer({
  currentStage = "COMPLETE",
  progress = 100,
  events = [],
  isStreaming = false,
}: PipelineVisualizerProps) {
  const getStageStatus = (stageId: string) => {
    const stageOrder = ["INIT", "DISCOVERY", "ANALYSIS", "ENRICHMENT", "VALIDATION", "COMPLETE"];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageId);

    if (currentStage === "COMPLETE" || currentIndex > stageIndex) return "completed";
    if (currentIndex === stageIndex) return isStreaming ? "active" : "completed";
    return "pending";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header with progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Autonomous Multi-Agent Pipeline
              {isStreaming && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" /> LIVE
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Coordinated LangGraph workflow across 4 specialized agents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-300">
              {progress}%
            </span>
            <span className="text-[10px] text-slate-500 block">Completion</span>
          </div>
          <div className="w-24 sm:w-32">
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </div>
      </div>

      {/* 4 Agent Stage Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {STAGES.map((stage, i) => {
          const status = getStageStatus(stage.id);
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-xl p-3.5 border transition-all ${
                status === "active"
                  ? "bg-cyan-950/40 border-cyan-400/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                  : status === "completed"
                  ? "bg-white/[0.02] border-emerald-500/30 text-slate-200"
                  : "bg-white/[0.01] border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    status === "active"
                      ? "bg-cyan-500/20 text-cyan-300"
                      : status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {status === "active" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  ) : status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                  {stage.model.split(" ")[0]}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-white mb-0.5">{stage.title}</h4>
              <p className="text-[11px] text-cyan-400/80 font-mono mb-1">{stage.agent}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{stage.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Live Stream Event Log */}
      {events.length > 0 && (
        <div className="rounded-xl bg-black/40 border border-white/5 p-3 font-mono text-[11px] space-y-1.5 max-h-32 overflow-y-auto">
          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-cyan-400" /> Pipeline Event Stream
          </div>
          {events.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <span className="text-cyan-400 shrink-0">[{ev.stage}]</span>
              <span className="text-slate-400">{ev.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
