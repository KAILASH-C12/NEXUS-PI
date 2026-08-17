"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Search,
  Sparkles,
  LayoutDashboard,
  Cpu,
  Layers,
  GitCompare,
  MessageSquareCode,
  Settings,
  ShieldCheck,
  Box,
  Share2,
  FileText,
  UserCheck,
  TrendingUp,
  Database,
  ArrowRight,
} from "lucide-react";
import { useEnrichmentStore } from "@/stores/enrichment-store";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { history, setActiveProduct } = useEnrichmentStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (action: () => void) => {
    onOpenChange(false);
    setQuery("");
    action();
  };

  const navActions = [
    { title: "Landing Overview", href: "/", icon: Sparkles },
    { title: "Command Center Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Enrichment Studio", href: "/enrich", icon: Cpu },
    { title: "3D Digital Twin & Thermal AI Simulator", href: "/digital-twin", icon: Box },
    { title: "Cross-Vendor Drop-In Matcher & Pinout Bridge", href: "/cross-vendor", icon: GitCompare },
    { title: "Autonomous Industrial BOM Swarm Optimizer", href: "/bom-optimizer", icon: Layers },
    { title: "EU Digital Product Passport (DPP) & ESG", href: "/dpp-passports", icon: ShieldCheck },
    { title: "5-Model AI Mesh Studio", href: "/ai-mesh", icon: Sparkles },
    { title: "Agent Swarm Laboratory", href: "/agent-lab", icon: Cpu },
    { title: "Industrial Knowledge Graph", href: "/knowledge-graph", icon: Share2 },
    { title: "Document Intelligence & Vector RAG", href: "/document-rag", icon: FileText },
    { title: "HITL Exception Review Queue", href: "/hitl-queue", icon: UserCheck },
    { title: "Batch Processing Pipeline", href: "/batch", icon: Layers },
    { title: "Differential Comparison Matrix", href: "/compare", icon: GitCompare },
    { title: "AI Copilot Studio", href: "/chat", icon: MessageSquareCode },
    { title: "Enterprise Problem & ROI Case", href: "/business-case", icon: TrendingUp },
    { title: "Model Orchestration & Settings", href: "/settings", icon: Settings },
  ];

  const filteredNav = navActions.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHistory = history.filter(
    (h) =>
      h.input.part_number.toLowerCase().includes(query.toLowerCase()) ||
      h.input.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-[#0a0f1d] border-white/15 shadow-2xl rounded-2xl">
        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-white/[0.02]">
          <Search className="h-4 w-4 text-cyan-400 mr-3 shrink-0" />
          <input
            placeholder="Type a command, route, or part number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-3 space-y-4">
          {/* Routes */}
          {filteredNav.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                Navigation
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => runCommand(() => router.push(item.href))}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        <span>{item.title}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enriched Products */}
          {filteredHistory.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                Enriched Products
              </p>
              <div className="space-y-0.5">
                {filteredHistory.slice(0, 4).map((p) => (
                  <button
                    key={p.product_id}
                    onClick={() =>
                      runCommand(() => {
                        setActiveProduct(p);
                        router.push(`/results/${p.product_id}`);
                      })
                    }
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Database className="h-4 w-4 text-slate-500" />
                      <span className="font-mono font-medium text-white">{p.input.part_number}</span>
                      <span className="text-slate-500 text-[11px]">({p.input.brand})</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {Math.round((p.quality_report?.overall_confidence || 0.95) * 100)}% Conf
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
