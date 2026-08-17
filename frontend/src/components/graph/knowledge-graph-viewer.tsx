"use client";

import { useState } from "react";
import {
  Share2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  Maximize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GraphNode {
  id: string;
  label: string;
  category: "product" | "protocol" | "spec" | "accessory" | "standard" | "source";
  color: string;
  x: number;
  y: number;
  details: string;
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "root", label: "Siemens 6ES7214-1AG40-0XB0", category: "product", color: "#06b6d4", x: 400, y: 220, details: "SIMATIC S7-1200 CPU 1214C DC/DC/DC Controller" },
  { id: "volt", label: "24V DC Power Supply", category: "spec", color: "#3b82f6", x: 220, y: 120, details: "Operating voltage envelope: 20.4V to 28.8V DC" },
  { id: "profinet", label: "PROFINET IO Real-Time", category: "protocol", color: "#8b5cf6", x: 580, y: 110, details: "Industrial Ethernet 10/100 Mbps with Modbus TCP support" },
  { id: "sm1221", label: "SM 1221 Expansion Module", category: "accessory", color: "#10b981", x: 620, y: 310, details: "8-channel 24V DC Digital Input Signal Module" },
  { id: "sitop", label: "SITOP Power 24V/2.5A", category: "accessory", color: "#10b981", x: 210, y: 330, details: "Regulated DIN-rail mount switchmode power unit" },
  { id: "unspsc", label: "UNSPSC 32151705 (PLC)", category: "standard", color: "#f59e0b", x: 400, y: 60, details: "Global taxonomy classification for Programmable Logic Controllers" },
  { id: "rohs", label: "RoHS 2011/65/EU", category: "standard", color: "#ec4899", x: 400, y: 380, details: "European Restriction of Hazardous Substances certification" },
  { id: "iec", label: "IEC 61131-2 Standard", category: "standard", color: "#ec4899", x: 180, y: 220, details: "International standard for programmable controllers equipment requirements" },
  { id: "datasheet", label: "Siemens Industry Mall PDF", category: "source", color: "#64748b", x: 630, y: 210, details: "Official OEM verified technical document (Doc ID: A5E03103013)" },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: "root", to: "volt", relation: "OPERATES_ON" },
  { from: "root", to: "profinet", relation: "COMMUNICATES_VIA" },
  { from: "root", to: "sm1221", relation: "EXPANDS_WITH" },
  { from: "root", to: "sitop", relation: "POWERED_BY" },
  { from: "root", to: "unspsc", relation: "CLASSIFIED_UNDER" },
  { from: "root", to: "rohs", relation: "CERTIFIED_TO" },
  { from: "root", to: "iec", relation: "COMPLIES_WITH" },
  { from: "root", to: "datasheet", relation: "EXTRACTED_FROM" },
];

export function KnowledgeGraphViewer() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(INITIAL_NODES[0]);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNodes = INITIAL_NODES.filter((n) => {
    const matchesCat = filterCategory === "ALL" || n.category === filterCategory;
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ontology entities..."
              className="pl-8 h-9 text-xs bg-black/40 border-white/10 text-white rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            {["ALL", "product", "spec", "protocol", "accessory", "standard"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] capitalize transition-all ${
                  filterCategory === cat
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
          9 Nodes &bull; 8 Relational Edges
        </Badge>
      </div>

      {/* 2-Column Interactive Canvas & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 relative rounded-2xl border border-white/10 bg-[#060913] p-4 min-h-[460px] overflow-hidden shadow-2xl">
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

          <svg className="relative w-full h-[430px] select-none" viewBox="0 0 800 440">
            {/* Edges */}
            {INITIAL_EDEdges.map((e, idx) => {
              const src = INITIAL_NODES.find((n) => n.id === e.from);
              const dst = INITIAL_NODES.find((n) => n.id === e.to);
              if (!src || !dst) return null;

              const isConnected = selectedNode.id === src.id || selectedNode.id === dst.id;

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={dst.x}
                    y2={dst.y}
                    stroke={isConnected ? "#06b6d4" : "#334155"}
                    strokeWidth={isConnected ? 2 : 1}
                    strokeDasharray={isConnected ? "none" : "4,4"}
                    className="transition-all duration-300"
                  />
                  <text
                    x={(src.x + dst.x) / 2}
                    y={(src.y + dst.y) / 2 - 6}
                    fill={isConnected ? "#67e8f9" : "#64748b"}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {e.relation}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((n) => {
              const isSelected = selectedNode.id === n.id;
              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.id === "root" ? 28 : 18}
                    fill={n.color}
                    fillOpacity={isSelected ? 0.9 : 0.4}
                    stroke={n.color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all"
                  />
                  {isSelected && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.id === "root" ? 36 : 24}
                      fill="none"
                      stroke={n.color}
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                  )}
                  <text
                    x={n.x}
                    y={n.y + (n.id === "root" ? 44 : 32)}
                    fill={isSelected ? "#ffffff" : "#cbd5e1"}
                    fontSize={n.id === "root" ? "11" : "10"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {n.label.length > 22 ? n.label.slice(0, 20) + "..." : n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Entity Inspector */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              Ontology Entity Inspector
            </span>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-mono"
              style={{ borderColor: selectedNode.color, color: selectedNode.color }}
            >
              {selectedNode.category}
            </Badge>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-mono">{selectedNode.label}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedNode.details}</p>
          </div>

          {/* Relational Graph Links */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              Connected Ontological Triplets:
            </span>
            <div className="space-y-1.5">
              {INITIAL_EDGES.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((e, idx) => {
                const targetId = e.from === selectedNode.id ? e.to : e.from;
                const targetNode = INITIAL_NODES.find((n) => n.id === targetId);
                return (
                  <div
                    key={idx}
                    onClick={() => targetNode && setSelectedNode(targetNode)}
                    className="cursor-pointer p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <span className="text-cyan-400 text-[11px]">{e.relation}</span>
                    <span className="text-slate-200 text-[11px] truncate max-w-[140px]">
                      {targetNode?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_EDEdges = INITIAL_EDGES;
