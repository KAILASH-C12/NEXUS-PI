"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Binary,
  PenTool,
  ShieldCheck,
  Leaf,
  Clock,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentNodeProps {
  name: string;
  role: string;
  model: string;
  icon: any;
  status: "idle" | "active" | "completed";
  color: string;
  tools: string[];
}

const AGENTS: AgentNodeProps[] = [
  {
    name: "Discovery Agent",
    role: "Multimodal Web & PDF Ingestion",
    model: "Gemini 2.5 Flash / SerpAPI",
    icon: Globe,
    status: "completed",
    color: "#06b6d4",
    tools: ["web_crawler", "pdf_ocr_parser", "nameplate_vision_scanner"],
  },
  {
    name: "Analysis Agent",
    role: "SI Units & Taxonomy Parser",
    model: "OpenAI GPT-4o",
    icon: Binary,
    status: "completed",
    color: "#3b82f6",
    tools: ["regex_unit_parser", "unspsc_classifier", "eclass_matcher"],
  },
  {
    name: "Enrichment Agent",
    role: "Commerce Copy & SEO Architect",
    model: "Anthropic Claude 3.7",
    icon: PenTool,
    status: "completed",
    color: "#d946ef",
    tools: ["copywriter_engine", "schema_org_builder", "upsell_graph"],
  },
  {
    name: "ESG & Compliance Agent",
    role: "RoHS / REACH & Carbon Auditor",
    model: "Deterministic + DeepSeek R1",
    icon: Leaf,
    status: "completed",
    color: "#10b981",
    tools: ["rohs_evaluator", "reach_svhc_lookup", "carbon_calculator"],
  },
  {
    name: "Lifecycle & MTBF Agent",
    role: "Obsolescence & Supply Risk Forecaster",
    model: "GPT-4o + Historical Actuarial DB",
    icon: Clock,
    status: "completed",
    color: "#f59e0b",
    tools: ["mtbf_estimator", "eol_forecaster", "counterfeit_risk_scorer"],
  },
  {
    name: "Validation Judge Agent",
    role: "4D Confidence Vector QA Auditor",
    model: "LLM-as-Judge 4D Engine",
    icon: ShieldCheck,
    status: "completed",
    color: "#8b5cf6",
    tools: ["cross_reference_audit", "anomaly_detector", "hitl_router"],
  },
];

export function AgentSwarmGraph({ activeStage }: { activeStage?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous 6-Agent Swarm Topology
              <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
                LangGraph State Mesh
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Coordinated distributed multi-agent state graph with autonomous tool execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            6 Agents Synchronized
          </span>
        </div>
      </div>

      {/* Agents Swarm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 space-y-3 transition-all hover:border-cyan-500/30 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono bg-white/5 text-slate-300">
                  {agent.model.split("/")[0].trim()}
                </Badge>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {agent.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{agent.role}</p>
              </div>

              {/* Tool calls chip list */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Autonomous Tools:
                </span>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-cyan-300/80 border border-white/5"
                    >
                      {t}()
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
