"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { CommandPalette } from "./command-palette";
import { ParticleBackground } from "@/components/effects/particle-background";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { PageTransition } from "@/components/effects/page-transition";
import { Toaster } from "@/components/ui/sonner";
import { ImageUploadModal } from "@/components/enrichment/image-upload-modal";
import { VoiceInputModal } from "@/components/enrichment/voice-input-modal";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { useRouter } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const { isVisionModalOpen, setIsVisionModalOpen, isVoiceModalOpen, setIsVoiceModalOpen } = useEnrichmentStore();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen flex w-full bg-[#ececee] text-[#111113] selection:bg-[#ff5500] selection:text-white">
        <ParticleBackground />
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col min-w-0 z-10">
          <Navbar onOpenCommandPalette={() => setCommandOpen(true)} />
          <main className="flex-1 flex flex-col p-6 md:p-8 max-w-7xl w-full mx-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>

        {/* Global Keyboard Command Palette */}
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

        {/* Global Vision Nameplate Scanner Modal */}
        <ImageUploadModal
          open={isVisionModalOpen}
          onOpenChange={setIsVisionModalOpen}
          onImageExtracted={(data) => {
            if (data?.partNumber) {
              router.push(`/enrich?q=${encodeURIComponent(data.partNumber)}`);
            }
          }}
        />

        {/* Global Whisper Voice Dictation Modal */}
        <VoiceInputModal
          open={isVoiceModalOpen}
          onOpenChange={setIsVoiceModalOpen}
          onTranscriptionComplete={(data) => {
            if (data?.partNumber) {
              router.push(`/enrich?q=${encodeURIComponent(data.partNumber)}`);
            }
          }}
        />

        {/* Rich Sonner Toasts */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0c1222",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              color: "#f8fafc",
            },
          }}
        />
      </div>
    </SmoothScroll>
  );
}
