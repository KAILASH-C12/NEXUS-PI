"use client";

import { useState } from "react";
import { Cpu, Zap, Activity, ShieldCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TerminalPin {
  pin: string;
  label: string;
  type: "POWER" | "DIGITAL_IN" | "DIGITAL_OUT" | "ANALOG_IN" | "COMM";
  voltage: string;
  description: string;
}

const SAMPLE_PINS: TerminalPin[] = [
  { pin: "1", label: "L+", type: "POWER", voltage: "24V DC (+)", description: "Main 24V DC positive power rail" },
  { pin: "2", label: "M", type: "POWER", voltage: "0V GND (-)", description: "Chassis and signal ground reference" },
  { pin: "3", label: "DI a.0", type: "DIGITAL_IN", voltage: "24V DC", description: "High-speed input channel 0 (100kHz counter)" },
  { pin: "4", label: "DI a.1", type: "DIGITAL_IN", voltage: "24V DC", description: "Digital input channel 1 (100kHz counter)" },
  { pin: "5", label: "DI a.2", type: "DIGITAL_IN", voltage: "24V DC", description: "Digital input channel 2 (sink/source)" },
  { pin: "6", label: "DI a.3", type: "DIGITAL_IN", voltage: "24V DC", description: "Digital input channel 3 (sink/source)" },
  { pin: "7", label: "2M", type: "POWER", voltage: "0V GND", description: "Digital input common reference terminal" },
  { pin: "8", label: "DQ a.0", type: "DIGITAL_OUT", voltage: "24V DC (0.5A)", description: "Transistor output 0 (Pulse frequency output)" },
  { pin: "9", label: "DQ a.1", type: "DIGITAL_OUT", voltage: "24V DC (0.5A)", description: "Transistor output 1 (Pulse frequency output)" },
  { pin: "10", label: "3L+", type: "POWER", voltage: "24V DC", description: "Transistor output supply voltage rail" },
  { pin: "11", label: "AI 0", type: "ANALOG_IN", voltage: "0-10V DC", description: "10-bit resolution differential analog input" },
  { pin: "12", label: "AI 1", type: "ANALOG_IN", voltage: "0-10V DC", description: "10-bit resolution differential analog input" },
  { pin: "13", label: "RJ45-1", type: "COMM", voltage: "100 Mbit/s", description: "PROFINET IO Real-Time Ethernet port" },
];

export function PinoutDiagram({
  brand = "Siemens",
  partNumber = "6ES7214-1AG40-0XB0",
}: {
  brand?: string;
  partNumber?: string;
}) {
  const [selectedPin, setSelectedPin] = useState<TerminalPin>(SAMPLE_PINS[0]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "POWER":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "DIGITAL_IN":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "DIGITAL_OUT":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "ANALOG_IN":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "COMM":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Terminal Pinout &amp; Wiring Schematic</h3>
            <p className="text-xs text-slate-400">Autonomous I/O terminal mapping synthesized from engineering pinout drawings</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
          Interactive Pinout
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Blocks Visual */}
        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-black/40 p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Click any terminal pin to inspect electrical limits:
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {SAMPLE_PINS.map((p) => {
              const isSelected = selectedPin.pin === p.pin;
              return (
                <button
                  key={p.pin}
                  onClick={() => setSelectedPin(p)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/30 text-white"
                      : "bg-white/[0.03] border-white/10 hover:border-cyan-500/40 text-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500">Pin {p.pin}</span>
                  <span className="text-xs font-mono font-bold mt-0.5">{p.label}</span>
                  <Badge variant="outline" className={`text-[8px] px-1 py-0 mt-1 uppercase ${getTypeColor(p.type)}`}>
                    {p.type.replace("_", " ")}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Inspector */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300">
              Terminal Pin #{selectedPin.pin} Details
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
              {selectedPin.label}
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-black/30 p-2.5 rounded-lg">
              <span className="text-slate-500 text-[10px] block">Channel Type:</span>
              <span className="text-white font-bold">{selectedPin.type}</span>
            </div>

            <div className="bg-black/30 p-2.5 rounded-lg">
              <span className="text-slate-500 text-[10px] block">Voltage &amp; Current Limits:</span>
              <span className="text-cyan-300 font-bold">{selectedPin.voltage}</span>
            </div>

            <div className="bg-black/30 p-2.5 rounded-lg">
              <span className="text-slate-500 text-[10px] block">Function &amp; Schematic Description:</span>
              <p className="text-slate-200 font-sans text-xs mt-1 leading-relaxed">
                {selectedPin.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
