"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Cpu,
  Table,
  Eye,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RAGChunk {
  id: string;
  sourceDoc: string;
  page: number;
  section: string;
  similarityScore: number;
  rawText: string;
  extractedEntities: string[];
}

const SAMPLE_CHUNKS: RAGChunk[] = [
  {
    id: "chunk-01",
    sourceDoc: "Siemens S7-1200 System Manual (A5E03103013)",
    page: 142,
    section: "4.2.1 CPU 1214C Technical Specifications",
    similarityScore: 0.942,
    rawText: "The CPU 1214C provides 14 digital inputs (24V DC, sink/source type 1), 10 digital outputs (24V DC transistor, 0.5A per channel), and 2 analog inputs (0 to 10V DC, 10-bit resolution). Work memory: 100 KB non-volatile.",
    extractedEntities: ["supply_voltage: 24V DC", "digital_inputs: 14", "digital_outputs: 10", "analog_inputs: 2", "work_memory: 100 KB"],
  },
  {
    id: "chunk-02",
    sourceDoc: "Siemens S7-1200 Environmental Test Report",
    page: 28,
    section: "8.1 Operating Temperature & Climatic Conditions",
    similarityScore: 0.915,
    rawText: "Ambient operating temperature range: -20°C to +60°C for horizontal DIN-rail mounting; -20°C to +50°C for vertical mounting. Enclosure ingress protection rated at IP20 according to IEC 60529.",
    extractedEntities: ["operating_temp_min: -20°C", "operating_temp_max: 60°C", "ip_rating: IP20"],
  },
  {
    id: "chunk-03",
    sourceDoc: "PROFINET Network Integration Guide",
    page: 15,
    section: "2.4 Communication Interfaces & Protocols",
    similarityScore: 0.887,
    rawText: "Integrated PROFINET interface (1 x RJ45) supporting 10/100 Mbps auto-negotiation, Modbus TCP client/server, TCP/IP, ISO-on-TCP, and embedded Web Server diagnostics.",
    extractedEntities: ["communication_protocol: PROFINET IO, Modbus TCP", "port_count: 1 RJ45"],
  },
];

export function DocumentRagViewer() {
  const [selectedChunk, setSelectedChunk] = useState<RAGChunk>(SAMPLE_CHUNKS[0]);
  const [query, setQuery] = useState("supply voltage and digital inputs");

  return (
    <div className="space-y-6">
      {/* Search & Query Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Vector semantic search across PDF engineering manuals..."
            className="pl-9 h-10 text-xs bg-black/40 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
          />
        </div>

        <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
          Dense Vector Embeddings &bull; OpenAI text-embedding-3-small
        </Badge>
      </div>

      {/* 2-Column Split: Retrieved Chunks & Document Chunk Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Semantic Chunks */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Top Retrieved Context Chunks (by Cosine Similarity)
          </span>

          <div className="space-y-2.5">
            {SAMPLE_CHUNKS.map((chunk) => {
              const isSelected = selectedChunk.id === chunk.id;
              return (
                <div
                  key={chunk.id}
                  onClick={() => setSelectedChunk(chunk)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-cyan-950/20 border-cyan-400 ring-1 ring-cyan-400/20 shadow-lg"
                      : "bg-[#0c1222]/80 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Page {chunk.page}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {(chunk.similarityScore * 100).toFixed(1)}% Match
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{chunk.section}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{chunk.rawText}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chunk Inspector & Bounding Context */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Source Document &bull; {selectedChunk.sourceDoc}
              </span>
              <h3 className="text-sm font-bold text-white font-mono mt-0.5">{selectedChunk.section}</h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
              Page {selectedChunk.page}
            </Badge>
          </div>

          {/* Raw Text Chunk Box with Optical Grounding Highlighter */}
          <div className="rounded-xl bg-black/60 border border-cyan-500/20 p-4 font-mono text-xs text-slate-200 leading-relaxed">
            <span className="text-slate-500 block text-[10px] uppercase mb-1">Raw Semantic Passage:</span>
            <p className="text-cyan-100 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
              &quot;{selectedChunk.rawText}&quot;
            </p>
          </div>

          {/* Extracted Structured Entities */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              Entities Extracted from this Chunk (Validated by Analysis Agent):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedChunk.extractedEntities.map((ent, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-mono bg-white/5 text-slate-200 border border-white/10 py-1 px-2.5"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 mr-1.5" />
                  {ent}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
