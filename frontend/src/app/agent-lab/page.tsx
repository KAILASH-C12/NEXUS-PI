"use client";

import { useState } from "react";
import {
  Cpu,
  Play,
  Loader2,
  Sparkles,
  Globe,
  Binary,
  PenTool,
  Leaf,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AgentDef {
  id: string;
  name: string;
  role: string;
  model: string;
  icon: any;
  defaultInput: Record<string, any>;
  runSimulation: (input: any) => Promise<any>;
}

const AGENT_LABS: AgentDef[] = [
  {
    id: "discovery",
    name: "1. Discovery Agent",
    role: "Multimodal Web Search & PDF Ingestion",
    model: "Google Gemini 2.5 Flash / SerpAPI",
    icon: Globe,
    defaultInput: {
      part_number: "6ES7214-1AG40-0XB0",
      brand: "Siemens",
      search_depth: "DEEP_CRAWL_WITH_PDFS",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 700));
      return {
        agent: "DiscoveryAgent (Gemini 2.5 Flash)",
        crawled_sources: [
          { name: "Siemens Industry Mall Catalog", url: "https://mall.industry.siemens.com", status: 200, confidence: 0.99 },
          { name: "RS Components Engineering Datasheet", url: "https://rs-online.com", status: 200, confidence: 0.95 },
          { name: "Mouser Electronics Technical Document", url: "https://mouser.com", status: 200, confidence: 0.94 },
        ],
        raw_token_count: 3840,
        extracted_sections: ["Electrical Power Supply", "I/O Digital & Analog Terminals", "PROFINET Network Topology", "Environmental Standards"],
      };
    },
  },
  {
    id: "analysis",
    name: "2. Analysis Agent",
    role: "SI Units & Taxonomy Parser",
    model: "OpenAI GPT-4o",
    icon: Binary,
    defaultInput: {
      raw_snippet: "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC, 14 DI 24V DC, 10 DO 24V DC 0.5A, 2 AI 0-10V DC, 100 KB work memory, IP20, -20...+60 deg C",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 700));
      return {
        agent: "AnalysisAgent (GPT-4o)",
        normalized_specifications: [
          { key: "supply_voltage", value: "24", unit: "V DC", std_si: "24.0 V" },
          { key: "work_memory", value: "100", unit: "KB", std_si: "102400 Bytes" },
          { key: "digital_inputs", value: "14", unit: "channels", std_si: "14 Channels (24V DC)" },
          { key: "digital_outputs", value: "10", unit: "channels", std_si: "10 Channels (Transistor)" },
          { key: "operating_temp_min", value: "-20", unit: "°C", std_si: "253.15 K" },
          { key: "operating_temp_max", value: "60", unit: "°C", std_si: "333.15 K" },
        ],
        taxonomy_assignment: {
          unspsc: { code: "32151705", title: "Programmable logic controllers PLC", match_score: 0.98 },
          eclass_14: { code: "27-24-22-07", title: "PLC central processing unit", match_score: 0.96 },
        },
      };
    },
  },
  {
    id: "compliance",
    name: "3. Compliance & ESG Agent",
    role: "RoHS / REACH / CE & Carbon Auditor",
    model: "Deterministic + DeepSeek R1",
    icon: Leaf,
    defaultInput: {
      part_number: "6ES7214-1AG40-0XB0",
      brand: "Siemens",
      standards: ["RoHS 2011/65/EU", "REACH SVHC", "UL 508", "CE Marking"],
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 600));
      return {
        agent: "ComplianceAgent",
        rohs_status: "COMPLIANT (Directive 2011/65/EU with amendment 2015/863/EU)",
        reach_status: "COMPLIANT (0 SVHC substances above 0.1% threshold)",
        ce_declaration: "Conformity Certificate Verified (Doc ID: A5E03103013)",
        ul_listing: "UL 508 / cULus E148414",
        embodied_carbon_footprint: "12.8 kg CO2e",
        circularity_recyclability_rate: "91.0%",
      };
    },
  },
  {
    id: "lifecycle",
    name: "4. Lifecycle & MTBF Agent",
    role: "Obsolescence & Actuarial Forecaster",
    model: "GPT-4o + Actuarial DB",
    icon: Clock,
    defaultInput: {
      part_number: "6ES7214-1AG40-0XB0",
      launch_date: "2021-04-15",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 600));
      return {
        agent: "LifecycleAgent",
        commercial_phase: "ACTIVE (Series Mass Production)",
        mtbf_hours: 520000,
        estimated_eol_date: "2034-Q4",
        counterfeit_risk: "0.02 (Very Low)",
        successor_drop_in: "SIMATIC S7-1200 G2 Next-Gen",
      };
    },
  },
  {
    id: "validation",
    name: "5. LLM-as-Judge Validation",
    role: "4D Confidence Vector QA Auditor",
    model: "Anthropic Claude 3.7 / GPT-4o",
    icon: ShieldCheck,
    defaultInput: {
      part_number: "6ES7214-1AG40-0XB0",
      extracted_specs_count: 8,
      independent_sources: 6,
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 700));
      return {
        agent: "ValidationJudge (LLM-as-Judge 4D Engine)",
        composite_confidence_score: 0.965,
        vector: {
          source_reliability: 0.98,
          cross_reference_consensus: 0.95,
          ontology_consistency: 0.97,
          temporal_freshness: 0.92,
        },
        anomaly_flags: [],
        hitl_escalation_required: false,
        audit_verdict: "PASSED (Autonomous Catalog Ingestion Approved)",
      };
    },
  },
];

export default function AgentLabPage() {
  const [activeTab, setActiveTab] = useState("discovery");
  const [inputs, setInputs] = useState<Record<string, string>>({
    discovery: JSON.stringify(AGENT_LABS[0].defaultInput, null, 2),
    analysis: JSON.stringify(AGENT_LABS[1].defaultInput, null, 2),
    compliance: JSON.stringify(AGENT_LABS[2].defaultInput, null, 2),
    lifecycle: JSON.stringify(AGENT_LABS[3].defaultInput, null, 2),
    validation: JSON.stringify(AGENT_LABS[4].defaultInput, null, 2),
  });

  const [outputs, setOutputs] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunAgent = async (agentDef: AgentDef) => {
    setIsRunning(true);
    try {
      const parsedInput = JSON.parse(inputs[agentDef.id] || "{}");
      const res = await agentDef.runSimulation(parsedInput);
      setOutputs((prev) => ({ ...prev, [agentDef.id]: res }));
      toast.success(`${agentDef.name} executed successfully`);
    } catch (e: any) {
      toast.error(`Execution error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyOutput = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success("Output JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Agent Swarm Laboratory &amp; Playground
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              Interactive Sandbox
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test and audit each specialized AI agent independently with custom inputs and inspect raw payloads
          </p>
        </div>
      </div>

      {/* Agents Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
          {AGENT_LABS.map((a) => {
            const Icon = a.icon;
            return (
              <TabsTrigger key={a.id} value={a.id} className="text-xs flex items-center gap-1.5 py-2">
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{a.name.split(".")[1]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {AGENT_LABS.map((agent) => {
          const currentOutput = outputs[agent.id];
          return (
            <TabsContent key={agent.id} value={agent.id} className="space-y-6">
              {/* Agent Overview Banner */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {agent.name}
                    <Badge variant="secondary" className="text-[10px] font-mono bg-white/5 text-slate-300">
                      {agent.model}
                    </Badge>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
                </div>

                <Button
                  onClick={() => handleRunAgent(agent)}
                  disabled={isRunning}
                  className="h-10 px-6 gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Executing Agent...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Execute Agent Isolated Unit Test</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Input / Output 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Payload Editor */}
                <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Agent Input Payload (JSON)
                    </span>
                    <button
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          [agent.id]: JSON.stringify(agent.defaultInput, null, 2),
                        }))
                      }
                      className="text-[10px] text-cyan-400 hover:underline font-mono"
                    >
                      Reset Default
                    </button>
                  </div>

                  <Textarea
                    value={inputs[agent.id]}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [agent.id]: e.target.value }))
                    }
                    className="min-h-64 font-mono text-xs bg-black/40 border-white/10 text-cyan-300 rounded-xl focus:border-cyan-500/50"
                  />
                </div>

                {/* Output Inspection Box */}
                <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Agent Response Telemetry
                    </span>
                    {currentOutput && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyOutput(currentOutput)}
                        className="h-7 text-[11px] border-white/10"
                      >
                        {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        <span>Copy JSON</span>
                      </Button>
                    )}
                  </div>

                  <div className="min-h-64 rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-xs overflow-x-auto">
                    {currentOutput ? (
                      <pre className="text-emerald-300 leading-relaxed">
                        {JSON.stringify(currentOutput, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic py-16">
                        <Sparkles className="h-6 w-6 mb-2 opacity-40 text-cyan-400" />
                        Click &quot;Execute Agent Isolated Unit Test&quot; to inspect real-time outputs
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
