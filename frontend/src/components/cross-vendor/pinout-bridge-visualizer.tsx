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
    <div className="space-y-6 font-mono text-[#111113]">
      {/* Visual Terminal Bridge Comparison */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4d4d8] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#111113] flex items-center gap-2 uppercase">
              <Zap className="h-4 w-4 text-[#ff5500]" />
              <span>Interactive Physical Terminal Wiring Bridge</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Click any pin row to inspect voltage levels, galvanic isolation requirements, and interposing circuitry
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono text-emerald-800 border-emerald-300 bg-emerald-50 font-bold">
              6 Direct 1:1 Pins
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-amber-800 border-amber-300 bg-amber-50 font-bold">
              2 Interposing Relays
            </Badge>
          </div>
        </div>

        {/* Side by Side Terminal Headers */}
        <div className="grid grid-cols-12 gap-3 text-xs font-mono uppercase font-bold text-slate-600 border-b border-[#d4d4d8] pb-2">
          <div className="col-span-5 text-red-700 font-bold">
            Source: {sourceBrand} ({sourcePart})
          </div>
          <div className="col-span-2 text-center text-slate-400 font-bold">
            Wiring Map
          </div>
          <div className="col-span-5 text-right text-emerald-800 font-bold">
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
                className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl border-2 text-xs font-mono cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#ff5500]/10 border-[#ff5500] shadow-sm font-bold"
                    : "bg-slate-50 border-[#d4d4d8] hover:border-slate-400"
                }`}
              >
                {/* Source Pin */}
                <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200 font-bold shrink-0">
                    {pin.sourcePin}
                  </span>
                  <span className="truncate text-slate-800 font-semibold">{pin.sourceFunction}</span>
                </div>

                {/* Bridge Arrow */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-6 bg-[#ff5500]" />
                    <ArrowRight className="h-3.5 w-3.5 text-[#ff5500] shrink-0 font-bold" />
                  </div>
                </div>

                {/* Target Pin */}
                <div className="col-span-5 flex items-center justify-end gap-2 overflow-hidden">
                  <span className="truncate text-slate-800 font-semibold text-right">{pin.targetFunction}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                    {pin.targetPin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Deep-Dive Details */}
        {selectedPin && (
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 font-mono text-xs space-y-2 text-white shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-[#ff5500] font-bold flex items-center gap-1.5">
                {selectedPin.status === "DIRECT_MATCH" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                Wiring Protocol &amp; Engineering Guideline: {selectedPin.sourcePin} &rarr; {selectedPin.targetPin}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold ${
                  selectedPin.status === "DIRECT_MATCH"
                    ? "text-emerald-400 border-emerald-500/50 bg-emerald-950/40"
                    : "text-amber-400 border-amber-500/50 bg-amber-950/40"
                }`}
              >
                {selectedPin.status}
              </Badge>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs font-medium">
              {selectedPin.note}
            </p>
          </div>
        )}
      </div>

      {/* SCL / IEC 61131-3 Code Transpiler Box */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#111113] flex items-center gap-2 uppercase">
              <Code2 className="h-4 w-4 text-[#ff5500]" />
              <span>Automated PLC Ladder / SCL Transpiler</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Auto-transpiled Siemens TIA Portal Structured Control Language (SCL) equivalent
            </p>
          </div>

          <button
            onClick={copySCL}
            className="h-8 px-3 text-xs font-bold border border-[#d4d4d8] bg-slate-50 text-slate-800 hover:border-[#ff5500] hover:text-[#ff5500] rounded-lg transition-all flex items-center gap-1"
          >
            {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            <span>Copy SCL Block</span>
          </button>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 font-mono text-xs overflow-x-auto text-emerald-400">
          <pre className="leading-relaxed">{sampleSCL}</pre>
        </div>
      </div>
    </div>
  );
}
