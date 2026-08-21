"use client";

import { useState, useRef } from "react";
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
  UploadCloud,
  Loader2,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NexusApiClient } from "@/lib/api-client";
import { toast } from "sonner";

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
    sourceDoc: "Siemens S7-1200 System Manual (A5E03103013).pdf",
    page: 142,
    section: "4.2.1 CPU 1214C Technical Specifications",
    similarityScore: 0.942,
    rawText: "The CPU 1214C provides 14 digital inputs (24V DC, sink/source type 1), 10 digital outputs (24V DC transistor, 0.5A per channel), and 2 analog inputs (0 to 10V DC, 10-bit resolution). Work memory: 100 KB non-volatile.",
    extractedEntities: ["supply_voltage: 24V DC", "digital_inputs: 14", "digital_outputs: 10", "analog_inputs: 2", "work_memory: 100 KB"],
  },
  {
    id: "chunk-02",
    sourceDoc: "Siemens S7-1200 Environmental Test Report.pdf",
    page: 28,
    section: "8.1 Operating Temperature & Climatic Conditions",
    similarityScore: 0.915,
    rawText: "Ambient operating temperature range: -20°C to +60°C for horizontal DIN-rail mounting; -20°C to +50°C for vertical mounting. Enclosure ingress protection rated at IP20 according to IEC 60529.",
    extractedEntities: ["operating_temp_min: -20°C", "operating_temp_max: 60°C", "ip_rating: IP20"],
  },
  {
    id: "chunk-03",
    sourceDoc: "PROFINET Network Integration Guide.pdf",
    page: 15,
    section: "2.4 Communication Interfaces & Protocols",
    similarityScore: 0.887,
    rawText: "Integrated PROFINET interface (1 x RJ45) supporting 10/100 Mbps auto-negotiation, Modbus TCP client/server, TCP/IP, ISO-on-TCP, and embedded Web Server diagnostics.",
    extractedEntities: ["communication_protocol: PROFINET IO, Modbus TCP", "port_count: 1 RJ45"],
  },
];

export function DocumentRagViewer() {
  const [chunks, setChunks] = useState<RAGChunk[]>(SAMPLE_CHUNKS);
  const [selectedChunk, setSelectedChunk] = useState<RAGChunk>(SAMPLE_CHUNKS[0]);
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocMeta, setUploadedDocMeta] = useState<{
    name: string;
    pages: number;
    characters: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a valid .PDF engineering manual or datasheet");
      return;
    }

    setIsUploading(true);
    try {
      const res = await NexusApiClient.uploadPdfDocument(file);
      if (res.chunks && res.chunks.length > 0) {
        const mappedChunks: RAGChunk[] = res.chunks.map((c: any) => ({
          id: c.id,
          sourceDoc: c.source_doc,
          page: c.page,
          section: c.section,
          similarityScore: c.similarity_score,
          rawText: c.raw_text,
          extractedEntities: c.extracted_entities || [],
        }));
        setChunks(mappedChunks);
        setSelectedChunk(mappedChunks[0]);
        setUploadedDocMeta({
          name: res.document_name,
          pages: res.total_pages,
          characters: res.total_characters,
        });
        toast.success(`Parsed ${res.total_pages} pages from "${file.name}" with ${mappedChunks.length} vector chunks`);
      }
    } catch (e: any) {
      toast.error(`PDF Ingestion error: ${e.message || "Failed to parse"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredChunks = chunks.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.section.toLowerCase().includes(q) ||
      c.rawText.toLowerCase().includes(q) ||
      c.extractedEntities.some((e) => e.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-mono text-[#111113]">
      {/* Real PDF Drag & Drop Ingestion Card */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="rounded-2xl border-2 border-dashed border-[#d4d4d8] hover:border-[#ff5500] bg-white p-6 shadow-sm transition-all text-center space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="h-12 w-12 rounded-xl bg-[#ff5500]/10 text-[#ff5500] flex items-center justify-center shrink-0">
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111113] uppercase">
                {uploadedDocMeta ? `Active PDF: ${uploadedDocMeta.name}` : "Upload Real OEM PDF Datasheet / Manual"}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {uploadedDocMeta
                  ? `${uploadedDocMeta.pages} pages • ${uploadedDocMeta.characters.toLocaleString()} characters indexed with text-embedding-3-small`
                  : "Drop any industrial equipment PDF to parse tables, electrical specifications, and optical citations"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-9 px-4 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center gap-2"
            >
              {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              <span>{isUploading ? "Parsing PDF..." : "Select PDF File"}</span>
            </button>

            {uploadedDocMeta && (
              <button
                onClick={() => {
                  setChunks(SAMPLE_CHUNKS);
                  setSelectedChunk(SAMPLE_CHUNKS[0]);
                  setUploadedDocMeta(null);
                  toast.info("Reset to standard Siemens S7-1200 manual sample");
                }}
                className="h-9 px-3 border border-[#d4d4d8] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Reset Sample
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Query Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#d4d4d8] p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Vector semantic search across PDF engineering manuals (e.g. voltage, pinout, IP rating, temperature)..."
            className="pl-9 h-10 text-xs bg-slate-50 border-[#d4d4d8] text-[#111113] rounded-xl focus:border-[#ff5500]"
          />
        </div>

        <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold shrink-0">
          {filteredChunks.length} Chunks Retrieved &bull; text-embedding-3-small
        </Badge>
      </div>

      {/* 2-Column Split: Retrieved Chunks & Document Chunk Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Semantic Chunks */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs uppercase text-slate-700 font-bold block">
            Top Retrieved Context Chunks ({filteredChunks.length})
          </span>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredChunks.map((chunk) => {
              const isSelected = selectedChunk?.id === chunk.id;
              return (
                <div
                  key={chunk.id}
                  onClick={() => setSelectedChunk(chunk)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "bg-white border-[#ff5500] shadow-md shadow-[#ff5500]/15 ring-1 ring-[#ff5500]/30"
                      : "bg-white border-[#d4d4d8] hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#ff5500] font-bold flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Page {chunk.page}
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                      {(chunk.similarityScore * 100).toFixed(1)}% Match
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-[#111113] mt-1.5 line-clamp-1">{chunk.section}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed font-semibold">{chunk.rawText}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chunk Inspector & Bounding Context */}
        <div className="lg:col-span-7 rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block font-bold">
                Source Document &bull; {selectedChunk?.sourceDoc}
              </span>
              <h3 className="text-sm font-bold text-[#111113] mt-0.5">{selectedChunk?.section}</h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold text-slate-700 border-slate-300 bg-slate-100">
              Page {selectedChunk?.page}
            </Badge>
          </div>

          {/* Raw Text Chunk Box with Optical Grounding Highlighter */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-xs text-white leading-relaxed shadow-md">
            <span className="text-slate-400 block text-[10px] uppercase mb-1 font-bold">Raw Semantic Passage:</span>
            <p className="text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
              &quot;{selectedChunk?.rawText}&quot;
            </p>
          </div>

          {/* Extracted Structured Entities */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase text-slate-700 block font-bold">
              Entities Extracted from this Chunk (Validated by Analysis Agent):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedChunk?.extractedEntities.map((ent, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-bold bg-slate-100 text-slate-900 border border-[#d4d4d8] py-1 px-2.5"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 mr-1.5" />
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
