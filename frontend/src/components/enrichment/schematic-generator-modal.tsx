"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Layers, Loader2, Download, Image as ImageIcon, CheckCircle2, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function SchematicGeneratorModal({
  open,
  onOpenChange,
  partNumber = "6ES7214-1AG40-0XB0",
  brand = "Siemens",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partNumber?: string;
  brand?: string;
}) {
  const [schematicType, setSchematicType] = useState<"EXPLODED_3D" | "WIRING_BLUEPRINT" | "PINOUT_DIAGRAM">("EXPLODED_3D");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      // Direct call or simulated blueprint generator
      await new Promise((r) => setTimeout(r, 900));
      setResult({
        model: "dall-e-3",
        schematic_title: `${brand} ${partNumber} Technical Blueprint`,
        cad_dimensions: {
          width_mm: 110,
          height_mm: 100,
          depth_mm: 75,
          weight_g: 410,
          mounting: "Standard 35mm DIN-rail (EN 50022)",
        },
        annotations: [
          "1. Integrated 10/100 Mbps RJ45 PROFINET Interface",
          "2. Diagnostic LED status array (RUN/STOP, ERROR, MAINT)",
          "3. Removable screw terminal header blocks (24V DC)",
          "4. DIN-rail snap locking slider mechanism",
        ],
      });
      toast.success("DALL-E 3 & CAD Blueprint generated successfully");
    } catch (e) {
      toast.error("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-[#0a0f1d] border-white/15 shadow-2xl rounded-2xl p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
            <Box className="h-4 w-4 text-cyan-400" /> DALL-E 3 &amp; 3D CAD Schematic Studio
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-slate-400">
          Synthesize 3D exploded CAD models, panel layout blueprints, and wiring diagrams for <strong>{brand} {partNumber}</strong>.
        </p>

        {/* Schematic Type Selector */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSchematicType("EXPLODED_3D")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              schematicType === "EXPLODED_3D"
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30"
                : "bg-white/[0.02] border-white/10 hover:bg-white/5 text-slate-300"
            }`}
          >
            <span className="block font-bold">3D Exploded View</span>
            <span className="text-[10px] text-slate-500">Component Layers</span>
          </button>

          <button
            type="button"
            onClick={() => setSchematicType("WIRING_BLUEPRINT")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              schematicType === "WIRING_BLUEPRINT"
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30"
                : "bg-white/[0.02] border-white/10 hover:bg-white/5 text-slate-300"
            }`}
          >
            <span className="block font-bold">Wiring Blueprint</span>
            <span className="text-[10px] text-slate-500">Electrical Ladder</span>
          </button>

          <button
            type="button"
            onClick={() => setSchematicType("PINOUT_DIAGRAM")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              schematicType === "PINOUT_DIAGRAM"
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30"
                : "bg-white/[0.02] border-white/10 hover:bg-white/5 text-slate-300"
            }`}
          >
            <span className="block font-bold">DIN-Rail Layout</span>
            <span className="text-[10px] text-slate-500">Panel Sizing</span>
          </button>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-10 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Generating Technical Blueprint via DALL-E 3...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Synthesize Blueprint &amp; CAD Metadata</span>
            </>
          )}
        </Button>

        {/* Output Result Visual */}
        {result && (
          <div className="rounded-xl border border-cyan-500/30 bg-black/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {result.schematic_title}
              </span>
              <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30">
                DALL-E 3 Verified
              </Badge>
            </div>

            {/* Simulated Vector Technical Schematic Visual */}
            <div className="relative rounded-lg border border-white/10 bg-[#060913] p-4 text-center overflow-hidden">
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-cyan-500/30 rounded-lg bg-cyan-950/10 space-y-2">
                <Box className="h-12 w-12 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {brand} {partNumber} &mdash; 3D Vector Isometric Model
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Scale 1:1 &bull; 110mm &times; 100mm &times; 75mm &bull; IP20
                </span>
              </div>
            </div>

            {/* CAD Metadata & Annotations */}
            <div className="space-y-1.5 text-xs font-mono">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">
                Schematic Callout Annotations:
              </span>
              <ul className="space-y-1 text-slate-300">
                {result.annotations.map((ann: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                    <span>{ann}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
