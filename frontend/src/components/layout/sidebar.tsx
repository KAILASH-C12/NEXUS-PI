"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Cpu,
  Layers,
  GitCompare,
  MessageSquareCode,
  Settings,
  Share2,
  FileText,
  UserCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Database,
  Box,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { Badge } from "@/components/ui/badge";

const PRIMARY_NAV = [
  { name: "Overview", href: "/", icon: Sparkles },
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Enrichment Studio", href: "/enrich", icon: Cpu, badge: "Live" },
  { name: "Batch Pipeline", href: "/batch", icon: Layers },
  { name: "Differential Matrix", href: "/compare", icon: GitCompare },
  { name: "AI Copilot", href: "/chat", icon: MessageSquareCode },
];

const INNOVATION_NAV = [
  { name: "3D Digital Twin", href: "/digital-twin", icon: Box, badge: "Shader" },
  { name: "Cross-Vendor Bridge", href: "/cross-vendor", icon: GitCompare, badge: "Drop-in" },
  { name: "BOM Swarm Optimizer", href: "/bom-optimizer", icon: Layers, badge: "Bulk" },
  { name: "EU DPP Passports", href: "/dpp-passports", icon: ShieldCheck, badge: "2026" },
  { name: "5-Model AI Mesh", href: "/ai-mesh", icon: Sparkles },
  { name: "Agent Swarm Lab", href: "/agent-lab", icon: Cpu },
];

const INTELLIGENCE_NAV = [
  { name: "Knowledge Graph", href: "/knowledge-graph", icon: Share2 },
  { name: "Document RAG", href: "/document-rag", icon: FileText },
  { name: "HITL Queue", href: "/hitl-queue", icon: UserCheck, badge: "3" },
  { name: "ROI Business Case", href: "/business-case", icon: TrendingUp },
  { name: "Model Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { history, activeProduct, setActiveProduct } = useEnrichmentStore();

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-[#d4d4d8] bg-[#f8f8fa] text-[#111113] backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? "w-16 sm:w-18" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`flex h-16 items-center border-b border-[#d4d4d8] bg-white/60 transition-all ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 overflow-hidden shrink-0"
          title="NEXUS LABS"
        >
          {/* ChainGPT Labs style Robot Head Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border-2 border-[#111113] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 border border-[#ff5500] rounded-lg m-0.5" />
            <span className="font-mono text-xs font-black text-[#111113] z-10">[•_•]</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm font-mono tracking-wider text-[#111113] flex items-center gap-1">
                NEXUS <span className="text-[#ff5500]">LABS</span>
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-semibold">
                Product Intelligence
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-[#111113] transition-colors shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dedicated Expand Button Strip when Collapsed */}
      {collapsed && (
        <div className="flex justify-center py-1.5 border-b border-[#d4d4d8] bg-slate-100/60">
          <button
            onClick={() => setCollapsed(false)}
            className="rounded-lg p-1 text-slate-600 hover:bg-white hover:text-[#ff5500] transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <div className={`flex-1 overflow-y-auto py-4 space-y-6 ${collapsed ? "px-2" : "px-3"}`}>
        {/* Core Workspace Section */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
              Workspace
            </span>
          )}
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center rounded-xl text-xs font-mono font-semibold transition-all ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isActive
                    ? "bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25"
                    : "text-slate-700 hover:bg-white hover:text-[#111113] hover:shadow-sm"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-600"}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-mono ${
                          isActive
                            ? "bg-white/20 text-white border-transparent"
                            : "bg-slate-200/80 text-slate-700 border-slate-300"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* AI & Innovations Section */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
              AI &amp; Innovations
            </span>
          )}
          {INNOVATION_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center rounded-xl text-xs font-mono font-semibold transition-all ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isActive
                    ? "bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25"
                    : "text-slate-700 hover:bg-white hover:text-[#111113] hover:shadow-sm"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-600"}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-mono ${
                          isActive
                            ? "bg-white/20 text-white border-transparent"
                            : "bg-[#ff5500]/10 text-[#ff5500] border-[#ff5500]/20"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Intelligence Mesh Section */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
              Intelligence Mesh
            </span>
          )}
          {INTELLIGENCE_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center rounded-xl text-xs font-mono font-semibold transition-all ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isActive
                    ? "bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25"
                    : "text-slate-700 hover:bg-white hover:text-[#111113] hover:shadow-sm"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-600"}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-mono ${
                          isActive
                            ? "bg-white/20 text-white border-transparent"
                            : "bg-slate-200/80 text-slate-700 border-slate-300"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#d4d4d8] bg-white/40">
        {!collapsed ? (
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white border border-[#d4d4d8] text-[10px] font-mono">
            <span className="text-slate-600 font-bold">STATUS:</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              SWARM ACTIVE
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Swarm Active">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </div>
        )}
      </div>
    </aside>
  );
}
