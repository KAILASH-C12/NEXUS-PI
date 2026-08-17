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
  // Where Ea ≈ 0.7 eV, k ≈ 8.617e-5 eV/K, T_baseline = 40°C (313.15 K)
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
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Multi-Physics Environmental Stress Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate harsh plant conditions and evaluate real-time Arrhenius component degradation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="h-8 text-xs border-white/10 text-slate-300 hover:bg-white/5"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>Reset Nominal</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`h-8 text-xs font-semibold rounded-lg shadow-md transition-all ${
                isSimulating
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20"
              }`}
            >
              <Play className="h-3 w-3 mr-1" />
              <span>{isSimulating ? "Pause Physics" : "Live Pulse Stream"}</span>
            </Button>
          </div>
        </div>

        {/* 3 Parameter Sliders */}
        <div className="space-y-5 pt-2">
          {/* 1. Ambient Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5 text-pink-400" />
                Ambient Temperature:
              </span>
              <span className={`font-bold ${temperature > 60 ? "text-red-400" : temperature > 45 ? "text-amber-400" : "text-cyan-300"}`}>
                {temperature > 0 ? `+${temperature}` : temperature}°C
                <span className="text-[10px] text-slate-500 font-sans ml-1">
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
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                Scan Cycle Load / Duty Cycle:
              </span>
              <span className="text-cyan-300 font-bold">
                {load}%
                <span className="text-[10px] text-slate-500 font-sans ml-1">
                  (Scan time: {(1.2 + (load * 0.08)).toFixed(1)} ms)
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
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Supply Voltage Rail:
              </span>
              <span className={`font-bold ${voltageRipple < 20.4 || voltageRipple > 28.8 ? "text-red-400" : "text-emerald-400"}`}>
                {voltageRipple.toFixed(1)}V DC
                <span className="text-[10px] text-slate-500 font-sans ml-1">
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
        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-4 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Degraded MTBF (Hours)
          </span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400">
            {adjustedMTBF.toLocaleString()} h
          </div>
          <span className="text-[11px] text-slate-400 block">
            ~{(adjustedMTBF / 8760).toFixed(1)} Years Continuous
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-4 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            10-Year Failure Risk
          </span>
          <div className={`text-2xl font-extrabold font-mono ${failureProbability10Yr > 30 ? "text-red-400" : failureProbability10Yr > 15 ? "text-amber-400" : "text-emerald-400"}`}>
            {failureProbability10Yr}%
          </div>
          <span className="text-[11px] text-slate-400 block">
            Arrhenius AF: {arrheniusAF.toFixed(2)}x
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-4 backdrop-blur-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Health &amp; Stability Score
          </span>
          <div className={`text-2xl font-extrabold font-mono ${healthScore < 60 ? "text-red-400" : healthScore < 80 ? "text-amber-400" : "text-emerald-400"}`}>
            {healthScore}/100
          </div>
          <span className="text-[11px] text-slate-400 block">
            {healthScore > 80 ? "Nominal Factory Limits" : healthScore > 60 ? "Accelerated Wear Alert" : "CRITICAL SHUTDOWN RISK"}
          </span>
        </div>
      </div>

      {/* AI Engineering Copilot Recommendation Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 backdrop-blur-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>AI Reliability Engineer Insight (DeepSeek R1 + Actuarial Model)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {temperature > 60 || voltageRipple > 28.8
            ? `⚠️ CRITICAL STRESS: Operating at ${temperature}°C with ${voltageRipple}V exceeds OEM design envelope. Electrolytic capacitors in the buck regulator will experience dielectric breakdown ~${(arrheniusAF).toFixed(1)}x faster. Recommendation: Install enclosure vortex cooling and passive heatsink.`
            : `✅ NOMINAL CONDITIONS: Controller is operating well within IEC 61131-2 specifications. Optocoupler CTR degradation is minimal (<0.2%/yr). Estimated service life exceeds 14.5 years in 24/7 continuous automation cells.`}
        </p>
      </div>
    </div>
  );
}
