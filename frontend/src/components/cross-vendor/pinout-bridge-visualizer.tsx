"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Zap,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface PinMapping {
  sourcePin: string;
  sourceFunction: string;
  targetPin: string;
  targetFunction: string;
  status: "DIRECT_MATCH" | "VOLTAGE_MATCH" | "ATTENTION_REQUIRED";
  note: string;
}

const SAMPLE_PIN_MAPPINGS: PinMapping[] = [
  { sourcePin: "TB1-1", sourceFunction: "+24V DC Power (V+)", targetPin: "1L+", targetFunction: "+24V DC Sensor Supply", status: "DIRECT_MATCH", note: "1:1 Direct DC polarity match" },
  { sourcePin: "TB1-2", sourceFunction: "24V Return (COM)", targetPin: "1M", targetFunction: "Common Ground (0V DC)", status: "DIRECT_MATCH", note: "Direct common ground return" },
  { sourcePin: "TB1-3", sourceFunction: "DI.0 (High Speed Counter 1)", targetPin: "DI a.0", targetFunction: "HSC 1 (Up to 100 kHz)", status: "DIRECT_MATCH", note: "Phase A quadrature pulse input" },
  { sourcePin: "TB1-4", sourceFunction: "DI.1 (High Speed Counter 2)", targetPin: "DI a.1", targetFunction: "HSC 2 (Up to 100 kHz)", status: "DIRECT_MATCH", note: "Phase B quadrature pulse input" },
  { sourcePin: "TB1-5", sourceFunction: "DI.2 (Emergency Stop Ch A)", targetPin: "DI a.2", targetFunction: "Digital Input 2 (Safety SIL2)", status: "DIRECT_MATCH", note: "NC contact loop" },
  { sourcePin: "TB2-1", sourceFunction: "DO.0 (Relay 2A 240VAC)", targetPin: "DQ a.0", targetFunction: "24V Transistor 0.5A (MOSFET)", status: "ATTENTION_REQUIRED", note: "Source is relay, target is transistor. Interposing relay required for AC loads" },
  { sourcePin: "TB2-2", sourceFunction: "DO.1 (Relay 2A 240VAC)", targetPin: "DQ a.1", targetFunction: "24V Transistor 0.5A (MOSFET)", status: "ATTENTION_REQUIRED", note: "Interposing relay required for 120V/240V AC coils" },
  { sourcePin: "ETH-1", sourceFunction: "EtherNet/IP (CIP Protocol)", targetPin: "X1 P1", targetFunction: "PROFINET IO / Modbus TCP", status: "VOLTAGE_MATCH", note: "Requires EDS to GSDML gateway configuration in TIA Portal" },
];

export function PinoutBridgeVisualizer({
  sourceBrand = "Rockwell Allen-Bradley",
  sourcePart = "1769-L33ER CompactLogix",
  targetBrand = "Siemens",
  targetPart = "6ES7214-1AG40-0XB0 (S7-1200)",
}: {
  sourceBrand?: string;
  sourcePart?: string;
  targetBrand?: string;
  targetPart?: string;
}) {
  const [selectedPin, setSelectedPin] = useState<PinMapping | null>(SAMPLE_PIN_MAPPINGS[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleSCL = `// Auto-Generated NEXUS-PI Migration Bridge: Rockwell Studio 5000 -> Siemens TIA Portal SCL
FUNCTION_BLOCK "FB_RockwellToSiemensBridge"
{ S7_Optimized_Access := 'TRUE' }
VERSION : 0.1
VAR_INPUT
    bStartPushbutton : Bool; // Mapped from AB Local:1:I.Data.0
    bEmergencyStop : Bool;   // Mapped from AB Local:1:I.Data.2
    nEncoderRawCount : DInt; // Mapped from AB HSC.Accumulator
END_VAR
VAR_OUTPUT
    bMainContactor : Bool;  // Mapped to Siemens %Q0.0 (DQ a.0)
    bSystemReady : Bool;    // Mapped to Siemens %Q0.1 (DQ a.1)
END_VAR

BEGIN
    // Automated IEC 61131-3 Transpilation:
    IF #bEmergencyStop AND #bStartPushbutton THEN
        #bMainContactor := TRUE;
        #bSystemReady := TRUE;
    ELSE
        #bMainContactor := FALSE;
        #bSystemReady := FALSE;
    END_IF;
END_FUNCTION_BLOCK`;

  const copySCL = () => {
    navigator.clipboard.writeText(sampleSCL);
    setCopiedCode(true);
    toast.success("TIA Portal SCL migration function block copied");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Terminal Bridge Comparison */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-6 backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Interactive Physical Terminal Wiring Bridge</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any pin row to inspect voltage levels, galvanic isolation requirements, and interposing circuitry
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              6 Direct 1:1 Pins
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/30">
              2 Interposing Relays
            </Badge>
          </div>
        </div>

        {/* Side by Side Terminal Headers */}
        <div className="grid grid-cols-12 gap-3 text-xs font-mono uppercase font-bold text-slate-400 border-b border-white/5 pb-2">
          <div className="col-span-5 text-pink-300">
            Source: {sourceBrand} ({sourcePart})
          </div>
          <div className="col-span-2 text-center text-slate-500">
            Bridge
          </div>
          <div className="col-span-5 text-right text-cyan-300">
            Target: {targetBrand} ({targetPart})
          </div>
        </div>

        {/* Pin Mapping Rows */}
        <div className="space-y-2">
          {SAMPLE_PIN_MAPPINGS.map((pin, idx) => {
            const isSelected = selectedPin === pin;
            return (
              <div
                key={idx}
                onClick={() => setSelectedPin(pin)}
                className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/20"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {/* Source Pin */}
                <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                  <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold shrink-0">
                    {pin.sourcePin}
                  </span>
                  <span className="truncate text-slate-300 font-sans">{pin.sourceFunction}</span>
                </div>

                {/* Bridge Arrow */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-6 bg-cyan-400/40" />
                    <ArrowRight className="h-3 w-3 text-cyan-400 shrink-0" />
                  </div>
                </div>

                {/* Target Pin */}
                <div className="col-span-5 flex items-center justify-end gap-2 overflow-hidden">
                  <span className="truncate text-slate-300 font-sans text-right">{pin.targetFunction}</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shrink-0">
                    {pin.targetPin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Deep-Dive Details */}
        {selectedPin && (
          <div className="rounded-xl bg-black/60 border border-cyan-500/30 p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                {selectedPin.status === "DIRECT_MATCH" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                Wiring Protocol &amp; Engineering Guideline
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  selectedPin.status === "DIRECT_MATCH"
                    ? "text-emerald-400 border-emerald-500/30"
                    : "text-amber-400 border-amber-500/30"
                }`}
              >
                {selectedPin.status}
              </Badge>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {selectedPin.note}
            </p>
          </div>
        )}
      </div>

      {/* SCL / IEC 61131-3 Code Transpiler Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              <span>Automated PLC Ladder / SCL Transpiler</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auto-transpiled Siemens TIA Portal Structured Control Language (SCL) equivalent
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={copySCL}
            className="h-7 text-xs border-white/10 text-slate-300 hover:bg-white/5"
          >
            {copiedCode ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            <span>Copy SCL Block</span>
          </Button>
        </div>

        <div className="rounded-xl bg-black/60 border border-white/5 p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-emerald-300 leading-relaxed">{sampleSCL}</pre>
        </div>
      </div>
    </div>
  );
}
