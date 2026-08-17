"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Sparkles, Cpu, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LogEntry {
  timestamp: string;
  agent: string;
  action: "THOUGHT" | "TOOL_CALL" | "TOOL_RESULT" | "EMIT_STATE";
  message: string;
  data?: any;
}

const DEFAULT_LOGS: LogEntry[] = [
  {
    timestamp: "10:14:22.104",
    agent: "DiscoveryAgent",
    action: "THOUGHT",
    message: "Received raw product input 'Siemens 6ES7214-1AG40-0XB0'. Identifying manufacturer catalog schemas.",
  },
  {
    timestamp: "10:14:22.250",
    agent: "DiscoveryAgent",
    action: "TOOL_CALL",
    message: "web_search(query='Siemens 6ES7214-1AG40-0XB0 technical data sheet manual pdf')",
  },
  {
    timestamp: "10:14:22.680",
    agent: "DiscoveryAgent",
    action: "TOOL_RESULT",
    message: "Retrieved 3 authoritative PDF specifications from Siemens Industry Mall & Mouser Electronics.",
  },
  {
    timestamp: "10:14:22.710",
    agent: "AnalysisAgent",
    action: "TOOL_CALL",
    message: "regex_unit_parser(text='Supply voltage 24 V DC, 14 digital inputs, 10 transistor outputs')",
  },
  {
    timestamp: "10:14:22.840",
    agent: "AnalysisAgent",
    action: "TOOL_CALL",
    message: "unspsc_classifier(product_family='SIMATIC S7-1200 CPU') -> '32151705'",
  },
  {
    timestamp: "10:14:22.950",
    agent: "ComplianceAgent",
    action: "TOOL_CALL",
    message: "rohs_reach_evaluator(materials=['Lead-free soldering', 'FR4 PCB', 'PBT Enclosure']) -> COMPLIANT",
  },
  {
    timestamp: "10:14:23.110",
    agent: "LifecycleAgent",
    action: "TOOL_CALL",
    message: "mtbf_estimator(series='S7-1200 G2', launch=2021) -> 520,000 hrs (EOL: 2034)",
  },
  {
    timestamp: "10:14:23.240",
    agent: "ValidationJudge",
    action: "TOOL_CALL",
    message: "compute_4d_vector(sources=6, agreement_score=0.965, anomaly_flags=[])",
  },
  {
    timestamp: "10:14:23.410",
    agent: "Orchestrator",
    action: "EMIT_STATE",
    message: "State payload successfully materialized with 0 HITL escalation triggers. 4D Score: 0.965",
  },
];

export function LiveAgentThoughtStream({ logs = DEFAULT_LOGS }: { logs?: LogEntry[] }) {
  const [copied, setCopied] = useState(false);

  const copyLogText = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.agent}] [${l.action}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Agent trace logs copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#070b16] p-5 font-mono shadow-2xl space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-cyan-400">
          <Terminal className="h-4 w-4" />
          <span className="font-bold text-white tracking-wider text-xs uppercase">
            Live Agent Execution Trace &amp; Tool Invocations
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
            Telemetry Stream Active
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={copyLogText}
            className="h-7 text-[11px] border-white/10 text-slate-300"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            <span>Copy Trace</span>
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 leading-relaxed">
        {logs.map((entry, idx) => {
          let actionColor = "text-slate-400";
          if (entry.action === "TOOL_CALL") actionColor = "text-cyan-400 font-bold";
          if (entry.action === "TOOL_RESULT") actionColor = "text-emerald-400";
          if (entry.action === "EMIT_STATE") actionColor = "text-pink-400 font-bold";

          return (
            <div key={idx} className="flex items-start gap-2 hover:bg-white/[0.02] p-1 rounded transition-colors">
              <span className="text-slate-600 select-none">[{entry.timestamp}]</span>
              <span className="text-indigo-400 font-semibold shrink-0">{entry.agent}:</span>
              <span className={`shrink-0 ${actionColor}`}>[{entry.action}]</span>
              <span className="text-slate-300 flex-1">{entry.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
