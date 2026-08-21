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
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onToggleMobileMenu?: () => void;
}

export function Navbar({ onOpenCommandPalette, onToggleMobileMenu }: NavbarProps) {
  const router = useRouter();
  const { isStreaming, setIsVisionModalOpen, setIsVoiceModalOpen } = useEnrichmentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/enrich?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#d4d4d8] bg-[#f8f8fa]/95 px-3 sm:px-6 backdrop-blur-2xl text-[#111113]">
      {/* Mobile Hamburger Button + Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onToggleMobileMenu}
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-xl border border-[#d4d4d8] bg-white text-slate-800 hover:border-[#ff5500] hover:text-[#ff5500] shrink-0 transition-colors shadow-xs"
          title="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleQuickSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search SKU or spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#d4d4d8] bg-white pl-8 sm:pl-9 pr-3 text-xs text-[#111113] placeholder:text-slate-400 focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] focus:outline-none transition-all shadow-sm"
          />
        </form>

        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 h-9 px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:text-[#ff5500] text-xs font-mono text-slate-700 rounded-xl transition-all shadow-sm shrink-0"
        >
          <Command className="h-3.5 w-3.5 text-[#ff5500]" />
          <span>Quick Actions</span>
          <kbd className="ml-1 text-[10px] text-slate-500 font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Global Quick-Action Multi-Modal Hub */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
        {/* 1. Camera / Computer Vision Scanner Button */}
        <button
          onClick={() => setIsVisionModalOpen(true)}
          className="h-9 w-9 sm:w-auto sm:px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          title="Launch Google Gemini Vision OCR"
        >
          <Camera className="h-3.5 w-3.5 text-[#ff5500]" />
          <span className="hidden lg:inline">Vision OCR</span>
        </button>

        {/* 2. Whisper Voice Dictation Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="h-9 w-9 sm:w-auto sm:px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] hover:bg-[#ff5500]/5 text-slate-800 hover:text-[#ff5500] rounded-xl text-xs font-mono font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          title="Launch Whisper Voice Dictation"
        >
          <Mic className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden lg:inline">Voice Dictation</span>
        </button>

        {/* 3. Primary Orange Enrich SKU CTA Button */}
        <Link href="/enrich">
          <button
            className="h-9 px-3 sm:px-4 gap-1.5 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-[#ff5500]/25 transition-all flex items-center shrink-0"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Enrich SKU</span>
            <span className="sm:hidden">Enrich</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
