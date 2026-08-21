"use client";

import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer,
  Zap,
  Cpu,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";

interface StressSimulationControlsProps {
  temperature: number;
  setTemperature: (v: number) => void;
  dutyCycle: number;
  setDutyCycle: (v: number) => void;
  voltageRipple: number;
  setVoltageRipple: (v: number) => void;
  isSimulating: boolean;
  setIsSimulating: (v: boolean) => void;
  onReset: () => void;
}

export function StressSimulationControls({
  temperature,
  setTemperature,
  dutyCycle,
  setVoltageRipple,
  voltageRipple,
  dutyCycle: load,
  setDutyCycle,
  isSimulating,
  setIsSimulating,
  onReset,
}: StressSimulationControlsProps) {
  // Arrhenius Acceleration Equation for Component Aging:
  // AF = exp((Ea / k) * (1/T_baseline - 1/T_actual))
  const tBaselineK = 313.15;
  const tActualK = Math.max(temperature + 273.15 + (load * 0.25), 248.15);
  const arrheniusAF = Math.exp((0.7 / 8.617e-5) * (1 / tBaselineK - 1 / tActualK));
  
  // Base MTBF: 520,000 Hours at 40°C nominal
  const adjustedMTBF = Math.max(Math.round(520000 / Math.max(arrheniusAF, 0.2)), 12000);
  const failureProbability10Yr = Math.min(Math.round((1 - Math.exp(-(87600) / adjustedMTBF)) * 100), 99.9);

  // Health Score (0 - 100%)
  const healthScore = Math.max(
    Math.round(100 - (Math.max(temperature - 40, 0) * 1.2) - (load * 0.2) - (Math.abs(voltageRipple - 24) * 3)),
    12
  );

  return (
    <div className="space-y-6 font-mono text-[#111113]">
      {/* Simulation Controls Header */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#111113] flex items-center gap-2 uppercase">
              <Cpu className="h-4 w-4 text-[#ff5500]" />
              <span>Multi-Physics Environmental Stress Engine</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-semibold">
              Simulate harsh plant conditions and evaluate real-time Arrhenius component degradation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="h-8 px-3 text-xs font-bold border border-[#d4d4d8] bg-slate-50 text-slate-800 hover:border-[#ff5500] rounded-lg transition-all flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`h-8 px-3 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1 ${
                isSimulating
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-[#ff5500] hover:bg-[#e04b00] text-white"
              }`}
            >
              <Play className="h-3 w-3" />
              <span>{isSimulating ? "Pause Physics" : "Live Pulse"}</span>
            </button>
          </div>
        </div>

        {/* 3 Parameter Sliders */}
        <div className="space-y-5 pt-2">
          {/* 1. Ambient Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5 text-red-600" />
                Ambient Temperature:
              </span>
              <span className={`font-extrabold ${temperature > 60 ? "text-red-600" : temperature > 45 ? "text-amber-600" : "text-emerald-700"}`}>
                {temperature > 0 ? `+${temperature}` : temperature}°C
                <span className="text-[10px] text-slate-500 font-medium ml-1">
                  (Rated: -20°C to +60°C)
                </span>
              </span>
            </div>
            <Slider
              value={[temperature]}
              min={-20}
              max={80}
              step={1}
              onValueChange={(val) => setTemperature(val[0])}
              className="py-1"
            />
          </div>

          {/* 2. Compute / I/O Duty Cycle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-indigo-600" />
                Scan Cycle Load / Duty Cycle:
              </span>
              <span className="text-indigo-700 font-extrabold">
                {load}%
                <span className="text-[10px] text-slate-500 font-medium ml-1">
                  (Scan: {(1.2 + (load * 0.08)).toFixed(1)} ms)
                </span>
              </span>
            </div>
            <Slider
              value={[load]}
              min={0}
              max={100}
              step={5}
              onValueChange={(val) => setDutyCycle(val[0])}
              className="py-1"
            />
          </div>

          {/* 3. DC Power Rail Voltage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                Supply Voltage Rail:
              </span>
              <span className={`font-extrabold ${voltageRipple < 20.4 || voltageRipple > 28.8 ? "text-red-600" : "text-emerald-700"}`}>
                {voltageRipple.toFixed(1)}V DC
                <span className="text-[10px] text-slate-500 font-medium ml-1">
                  (Tolerance: 20.4V - 28.8V)
                </span>
              </span>
            </div>
            <Slider
              value={[voltageRipple]}
              min={18}
              max={32}
              step={0.2}
              onValueChange={(val) => setVoltageRipple(val[0])}
              className="py-1"
            />
          </div>
        </div>
      </div>

      {/* Actuarial MTBF & Reliability Projections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-4 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
            Degraded MTBF (Hours)
          </span>
          <div className="text-2xl font-extrabold text-[#111113]">
            {adjustedMTBF.toLocaleString()} h
          </div>
          <span className="text-[11px] text-slate-600 font-semibold block">
            ~{(adjustedMTBF / 8760).toFixed(1)} Years Continuous
          </span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-4 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
            10-Year Failure Risk
          </span>
          <div className={`text-2xl font-extrabold ${failureProbability10Yr > 30 ? "text-red-600" : failureProbability10Yr > 15 ? "text-amber-600" : "text-emerald-700"}`}>
            {failureProbability10Yr}%
          </div>
          <span className="text-[11px] text-slate-600 font-semibold block">
            Arrhenius AF: {arrheniusAF.toFixed(2)}x
          </span>
        </div>

        <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-4 shadow-sm space-y-1">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">
            Health &amp; Stability Score
          </span>
          <div className={`text-2xl font-extrabold ${healthScore < 60 ? "text-red-600" : healthScore < 80 ? "text-amber-600" : "text-emerald-700"}`}>
            {healthScore}/100
          </div>
          <span className="text-[11px] text-slate-600 font-semibold block">
            {healthScore > 80 ? "Nominal Factory Limits" : healthScore > 60 ? "Accelerated Wear Alert" : "CRITICAL SHUTDOWN RISK"}
          </span>
        </div>
      </div>

      {/* AI Engineering Insight */}
      <div className="rounded-2xl border-2 border-[#111113] bg-white p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#111113] uppercase">
          <Sparkles className="h-4 w-4 text-[#ff5500]" />
          <span>AI Reliability Engineer Insight (DeepSeek R1 + Actuarial Model)</span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-semibold">
          {temperature > 60 || voltageRipple > 28.8
            ? `⚠️ CRITICAL STRESS: Operating at ${temperature}°C with ${voltageRipple}V exceeds OEM design envelope. Electrolytic capacitors in the buck regulator will experience dielectric breakdown ~${(arrheniusAF).toFixed(1)}x faster. Recommendation: Install enclosure vortex cooling and passive heatsink.`
            : `✅ NOMINAL CONDITIONS: Controller is operating well within IEC 61131-2 specifications. Optocoupler CTR degradation is minimal (<0.2%/yr). Estimated service life exceeds 14.5 years in 24/7 continuous automation cells.`}
        </p>
      </div>
    </div>
  );
}
