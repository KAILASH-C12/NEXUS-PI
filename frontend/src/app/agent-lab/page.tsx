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
    role: "Entity Normalizer & SI Unit Grounder",
    model: "OpenAI GPT-4o Omni",
    icon: Binary,
    defaultInput: {
      raw_snippet: "Controller supply 24Vdc, 14 inputs 24v, 10 transistor outs, 2 analog in 0-10V, 100kbyte memory, IP20 rated, Profinet port",
      target_standard: "ISO/IEC 80000-1 Metric",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 650));
      return {
        agent: "AnalysisAgent (GPT-4o)",
        normalized_attributes: [
          { attribute: "supply_voltage", normalized_val: "24", unit: "V DC", raw_match: "24Vdc", confidence: 0.98 },
          { attribute: "digital_inputs", normalized_val: "14", unit: "Channels (24V DC)", raw_match: "14 inputs 24v", confidence: 0.97 },
          { attribute: "digital_outputs", normalized_val: "10", unit: "Transistor (0.5A)", raw_match: "10 transistor outs", confidence: 0.96 },
          { attribute: "work_memory", normalized_val: "100", unit: "KB", raw_match: "100kbyte", confidence: 0.98 },
          { attribute: "protection_degree", normalized_val: "IP20", unit: null, raw_match: "IP20 rated", confidence: 0.99 },
        ],
        eclass_classification: "27-24-22-07 (PLC central processing unit)",
        unspsc_code: "32151705",
      };
    },
  },
  {
    id: "enrichment",
    name: "3. Enrichment Agent",
    role: "B2B Commerce Copywriter & Schema.org Gen",
    model: "Anthropic Claude 3.7 Sonnet",
    icon: PenTool,
    defaultInput: {
      brand: "Siemens",
      part_number: "6ES7214-1AG40-0XB0",
      category: "Industrial PLC Controllers",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        agent: "EnrichmentAgent (Claude 3.7)",
        seo_meta_title: "Siemens 6ES7214-1AG40-0XB0 SIMATIC S7-1200 CPU 1214C | Distributor Catalog",
        seo_meta_description: "Order genuine Siemens S7-1200 CPU 1214C 24V DC compact PLC controller with PROFINET. Verified specs & instant shipping.",
        bullet_features: [
          "100 KB integrated high-speed work memory",
          "14 Digital Inputs (24V DC) / 10 Transistor Outputs onboard",
          "Integrated PROFINET IO industrial real-time networking",
        ],
        json_ld_schema: {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "Siemens SIMATIC S7-1200 CPU 1214C",
          "mpn": "6ES7214-1AG40-0XB0",
          "brand": { "@type": "Brand", "name": "Siemens" },
        },
      };
    },
  },
  {
    id: "compliance",
    name: "4. Compliance & ESG Agent",
    role: "RoHS / REACH / CE / Carbon Auditor",
    model: "GPT-4o + Regulatory Graph",
    icon: Leaf,
    defaultInput: {
      part_number: "6ES7214-1AG40-0XB0",
      region_target: "EU 2026 Ecodesign / USA OSHA",
    },
    runSimulation: async (input) => {
      await new Promise((r) => setTimeout(r, 650));
      return {
        agent: "ComplianceAgent",
        rohs_status: "COMPLIANT (EU 2011/65/EU with amendment 2015/863)",
        reach_svhc: "No SVHCs > 0.1% w/w as per latest ECHA candidate list",
        ce_marking: "CONFORMANT (EMC Directive 2014/30/EU & LVD 2014/35/EU)",
        ul_listing: "UL 508 / cULus Listed (E116536)",
        estimated_carbon_footprint: "14.2 kg CO2e (Cradle-to-gate LCA)",
        circularity_score: "88.5% Recyclable Materials",
      };
    },
  },
  {
    id: "lifecycle",
    name: "5. Lifecycle Agent",
    role: "Obsolescence & MTBF Risk Predictor",
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
    name: "6. LLM Judge Validation",
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
    enrichment: JSON.stringify(AGENT_LABS[2].defaultInput, null, 2),
    compliance: JSON.stringify(AGENT_LABS[3].defaultInput, null, 2),
    lifecycle: JSON.stringify(AGENT_LABS[4].defaultInput, null, 2),
    validation: JSON.stringify(AGENT_LABS[5].defaultInput, null, 2),
  });

  const [outputs, setOutputs] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeAgent = AGENT_LABS.find((a) => a.id === activeTab) || AGENT_LABS[0];

  const handleRunAgent = async () => {
    setIsRunning(true);
    try {
      let parsedInput = {};
      try {
        parsedInput = JSON.parse(inputs[activeTab] || "{}");
      } catch {
        parsedInput = { raw: inputs[activeTab] };
      }

      const result = await activeAgent.runSimulation(parsedInput);
      setOutputs((prev) => ({ ...prev, [activeTab]: result }));
      toast.success(`${activeAgent.name} executed successfully`);
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
    <div className="space-y-8 max-w-6xl text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Agent Swarm Laboratory &amp; Playground
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              Interactive Sandbox
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Test and audit each specialized AI agent independently with custom inputs and inspect raw payloads
          </p>
        </div>
      </div>

      {/* Agents Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6 font-mono">
        <TabsList className="bg-white border-2 border-[#d4d4d8] p-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 rounded-2xl shadow-xs">
          {AGENT_LABS.map((a) => {
            const Icon = a.icon;
            return (
              <TabsTrigger key={a.id} value={a.id} className="text-xs flex items-center gap-1.5 py-2.5 font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl transition-all">
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
              <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-[#111113] flex items-center gap-2">
                    {agent.name}
                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                      {agent.model}
                    </Badge>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-semibold">{agent.role}</p>
                </div>

                <button
                  onClick={handleRunAgent}
                  disabled={isRunning}
                  className="h-10 px-6 gap-2 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center shrink-0"
                >
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  <span>Execute {agent.name.split(".")[1]}</span>
                </button>
              </div>

              {/* Grid: Input Left, Output Right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Editor */}
                <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#ff5500]" />
                      <span>Input Payload (JSON)</span>
                    </span>
                    <button
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          [agent.id]: JSON.stringify(agent.defaultInput, null, 2),
                        }))
                      }
                      className="text-[11px] text-[#ff5500] hover:underline font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset to Default
                    </button>
                  </div>

                  <Textarea
                    value={inputs[agent.id] || ""}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [agent.id]: e.target.value }))
                    }
                    className="flex-1 min-h-[300px] font-mono text-xs bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-4 leading-relaxed focus:border-[#ff5500]"
                  />
                </div>

                {/* Output Inspector */}
                <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>Agent Output Result</span>
                    </span>
                    {currentOutput && (
                      <button
                        onClick={() => copyOutput(currentOutput)}
                        className="text-[11px] text-slate-600 hover:text-[#ff5500] font-bold flex items-center gap-1"
                      >
                        {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        Copy JSON
                      </button>
                    )}
                  </div>

                  {currentOutput ? (
                    <div className="flex-1 min-h-[300px] rounded-xl bg-slate-900 border border-slate-700 p-4 font-mono text-xs overflow-x-auto text-slate-100 space-y-2">
                      <pre className="text-slate-100 leading-relaxed font-mono">
                        {JSON.stringify(currentOutput, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-[300px] rounded-xl bg-slate-50 border border-dashed border-[#d4d4d8] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                      <Terminal className="h-8 w-8 text-slate-400" />
                      <span className="text-xs font-bold">No execution output yet</span>
                      <span className="text-[11px]">Click &quot;Execute&quot; to test this agent with input payload</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
