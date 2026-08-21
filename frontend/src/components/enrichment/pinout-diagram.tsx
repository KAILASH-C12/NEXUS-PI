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
        return "bg-red-100 text-red-800 border-red-300";
      case "DIGITAL_IN":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "DIGITAL_OUT":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "ANALOG_IN":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "COMM":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4 font-mono text-[#111113]">
      <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111113] uppercase">Terminal Pinout &amp; Wiring Schematic</h3>
            <p className="text-xs text-slate-600">Autonomous I/O terminal mapping synthesized from engineering pinout drawings</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
          Interactive Pinout
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Blocks Visual */}
        <div className="lg:col-span-2 rounded-xl border border-[#d4d4d8] bg-slate-50 p-4 space-y-3">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
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
                      ? "bg-white border-[#ff5500] ring-2 ring-[#ff5500]/30 shadow-md text-[#111113]"
                      : "bg-white border-[#d4d4d8] hover:border-slate-400 text-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500">Pin {p.pin}</span>
                  <span className="text-xs font-extrabold text-[#111113] mt-0.5">{p.label}</span>
                  <Badge variant="outline" className={`text-[8px] font-bold px-1.5 py-0 mt-1 uppercase ${getTypeColor(p.type)}`}>
                    {p.type.replace("_", " ")}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Inspector */}
        <div className="rounded-xl border-2 border-[#d4d4d8] bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-2">
            <span className="text-xs font-bold text-[#ff5500]">
              Terminal Pin #{selectedPin.pin} Details
            </span>
            <Badge className="text-[10px] bg-slate-200 text-slate-800 font-bold">
              {selectedPin.label}
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-white border border-[#d4d4d8] p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Channel Type:</span>
              <span className="text-[#111113] font-extrabold">{selectedPin.type}</span>
            </div>

            <div className="bg-white border border-[#d4d4d8] p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Voltage &amp; Current Limits:</span>
              <span className="text-emerald-700 font-extrabold">{selectedPin.voltage}</span>
            </div>

            <div className="bg-white border border-[#d4d4d8] p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Function &amp; Schematic Description:</span>
              <p className="text-slate-800 font-sans text-xs mt-1 leading-relaxed font-semibold">
                {selectedPin.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
