"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigitalTwinCanvas } from "@/components/digital-twin/digital-twin-canvas";
import { StressSimulationControls } from "@/components/digital-twin/stress-simulation-controls";
import {
  Activity,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  ShieldCheck,
  Flame,
  Radio,
  FileDown,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export default function DigitalTwinPage() {
  const [temperature, setTemperature] = useState(28); // Nominal 28°C
  const [dutyCycle, setDutyCycle] = useState(45); // 45% scan load
  const [voltageRipple, setVoltageRipple] = useState(24.0); // 24.0V DC
  const [activeProbe, setActiveProbe] = useState<string | null>("DI.0");
  const [isSimulating, setIsSimulating] = useState(true);

  const handleReset = () => {
    setTemperature(28);
    setDutyCycle(45);
    setVoltageRipple(24.0);
    setActiveProbe("DI.0");
    setIsSimulating(true);
    toast.info("Stress simulation reset to nominal factory defaults (28°C, 24V DC, 45% Duty Cycle)");
  };

  const handleExportTelemetry = () => {
    const data = {
      device: "Siemens S7-1200 CPU 1214C",
      timestamp: new Date().toISOString(),
      stress_vector: {
        ambient_temperature_c: temperature,
        duty_cycle_percent: dutyCycle,
        supply_voltage_v: voltageRipple,
        active_pin_probe: activeProbe,
      },
      computed_hotspots: {
        mcu_core_c: Math.round(temperature + dutyCycle * 0.35 + Math.abs(voltageRipple - 24) * 1.8),
        power_regulator_c: Math.round(temperature + dutyCycle * 0.22 + Math.abs(voltageRipple - 24) * 2.5),
        opto_isolators_c: Math.round(temperature + dutyCycle * 0.15),
      },
      status: "TELEMETRY_EXPORTED",
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Simulation telemetry JSON copied to clipboard");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              3D AI Digital Twin &amp; Multi-Physics Stress Simulator
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              FEM Real-Time Shader
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate operational environmental stresses, Arrhenius degradation, and probe electrical I/O signal waveforms
          </p>
        </div>

        <Button
          onClick={handleExportTelemetry}
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 border-white/10 text-slate-200 text-xs font-medium rounded-xl hover:border-cyan-500/40 hover:bg-white/[0.04]"
        >
          <FileDown className="h-3.5 w-3.5 text-cyan-400" />
          <span>Export Physics Log</span>
        </Button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Digital Twin Canvas & Live Waveform */}
        <div className="lg:col-span-7 space-y-6">
          <DigitalTwinCanvas
            temperature={temperature}
            dutyCycle={dutyCycle}
            voltageRipple={voltageRipple}
            activeProbe={activeProbe}
            onSelectProbe={setActiveProbe}
            isSimulating={isSimulating}
          />

          {/* Real-Time Oscillogram Signal Viewer */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Live Signal Waveform Probe &mdash; [{activeProbe || "DI.0"}]</span>
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300">
                10 kHz Sampling
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 pb-2">
                <span>Signal Type: <strong>24V DC Discrete Digital Pulse</strong></span>
                <span>Propagation Delay: <strong className="text-emerald-400">0.2 μs</strong></span>
                <span>Optical Isolation: <strong className="text-cyan-400">500V AC RMS</strong></span>
              </div>

              {/* Animated CSS Oscilloscope Waveform */}
              <div className="h-16 flex items-center justify-center relative overflow-hidden bg-cyan-950/20 rounded-lg border border-cyan-500/20">
                <div className="absolute inset-0 flex items-center justify-around opacity-60">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400/80 rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.max(15, Math.sin((i + Date.now() * 0.005) * 0.8) * 45 + 30)}%`,
                      }}
                    />
                  ))}
                </div>
                <span className="relative z-10 text-[11px] font-bold text-cyan-300 tracking-wider bg-black/60 px-3 py-1 rounded-md border border-cyan-500/30">
                  {voltageRipple.toFixed(1)}V PEAK-TO-PEAK • SINK/SOURCE EN 61131-2 TYPE 1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Multi-Physics Controls */}
        <div className="lg:col-span-5">
          <StressSimulationControls
            temperature={temperature}
            setTemperature={setTemperature}
            dutyCycle={dutyCycle}
            setDutyCycle={setDutyCycle}
            voltageRipple={voltageRipple}
            setVoltageRipple={setVoltageRipple}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
