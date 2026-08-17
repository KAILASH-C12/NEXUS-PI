"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Sparkles,
  Command,
  Activity,
  Layers,
  Zap,
  Camera,
  Mic,
  FileText,
  Share2,
  Box,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { useRouter } from "next/navigation";

export function Navbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  const router = useRouter();
  const { isStreaming, setIsVisionModalOpen, setIsVoiceModalOpen } = useEnrichmentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/enrich?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#d4d4d8] bg-[#f8f8fa]/95 px-4 sm:px-6 backdrop-blur-2xl text-[#111113]">
      {/* Search & Command Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <form onSubmit={handleQuickSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search SKU, brand, or spec (e.g. 6ES7214, Modicon, 24V DC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#d4d4d8] bg-white pl-9 pr-10 text-xs text-[#111113] placeholder:text-slate-400 focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] focus:outline-none transition-all shadow-sm"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-slate-100 px-1.5 font-mono text-[10px] text-slate-500">
            ↵
          </kbd>
        </form>

        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 h-9 px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:text-[#ff5500] text-xs font-mono text-slate-700 rounded-xl transition-all shadow-sm"
        >
          <Command className="h-3.5 w-3.5 text-[#ff5500]" />
          <span>Quick Actions</span>
          <kbd className="ml-1 text-[10px] text-slate-500 font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Global Quick-Action Multi-Modal Hub */}
      <div className="flex items-center gap-2">
        {/* 1. Camera / Computer Vision Scanner Button */}
        <button
          onClick={() => setIsVisionModalOpen(true)}
          className="h-9 px-3 gap-1.5 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center"
          title="Launch Google Gemini 2.5 Flash Vision OCR"
        >
          <Camera className="h-3.5 w-3.5 text-[#ff5500]" />
          <span className="hidden lg:inline">Vision OCR</span>
        </button>

        {/* 2. Whisper Voice Dictation Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="h-9 px-3 gap-1.5 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center"
          title="Launch OpenAI Whisper v3 Voice Dictation"
        >
          <Mic className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden lg:inline">Voice Dictation</span>
        </button>

        {/* 3. 3D Digital Twin Quick Link */}
        <Link href="/digital-twin" className="hidden sm:inline-block">
          <button
            className="h-9 px-3 gap-1.5 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center"
            title="3D Digital Twin & Stress Shader"
          >
            <Box className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden xl:inline">3D Twin</span>
          </button>
        </Link>

        {/* 4. Vector Document RAG */}
        <Link href="/document-rag" className="hidden md:inline-block">
          <button
            className="h-9 px-3 gap-1.5 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center"
            title="Docling PDF Vector RAG"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden xl:inline">Vector RAG</span>
          </button>
        </Link>

        {/* 5. Primary Orange Enrich SKU CTA Button */}
        <Link href="/enrich">
          <button
            className="h-9 px-4 gap-1.5 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-[#ff5500]/25 transition-all flex items-center transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Enrich SKU</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
