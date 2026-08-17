"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Flame, Zap, Cpu, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface DigitalTwinCanvasProps {
  temperature: number; // in Celsius (-25 to 85)
  dutyCycle: number; // 0 to 100%
  voltageRipple: number; // 18 to 32V DC
  activeProbe: string | null;
  onSelectProbe: (probe: string) => void;
  isSimulating: boolean;
}

export function DigitalTwinCanvas({
  temperature,
  dutyCycle,
  voltageRipple,
  activeProbe,
  onSelectProbe,
  isSimulating,
}: DigitalTwinCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Compute thermal hotspots based on stress inputs
  const coreTemp = Math.round(temperature + (dutyCycle * 0.35) + (Math.abs(voltageRipple - 24) * 1.8));
  const powerRegTemp = Math.round(temperature + (dutyCycle * 0.22) + (Math.abs(voltageRipple - 24) * 2.5));
  const optoTemp = Math.round(temperature + (dutyCycle * 0.15));

  // Determine color hue based on temperature
  const getTempColor = (t: number) => {
    if (t < 40) return { fill: "rgba(6, 182, 212, 0.25)", stroke: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)" }; // Cyan Cool
    if (t < 60) return { fill: "rgba(16, 185, 129, 0.25)", stroke: "#10b981", glow: "rgba(16, 185, 129, 0.4)" }; // Green Nominal
    if (t < 75) return { fill: "rgba(245, 158, 11, 0.35)", stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.6)" }; // Amber Warm
    return { fill: "rgba(239, 68, 68, 0.45)", stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.8)" }; // Red Hotspot
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center coordinates
      const cx = w / 2;
      const cy = h / 2 - 10;

      // ── Draw DIN Rail Mounting Base ──
      ctx.fillStyle = "#111827";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 190, cy - 130, 380, 260, 16);
      ctx.fill();
      ctx.stroke();

      // Top Terminal Strip (Inputs DI 0..13 & 24V DC)
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(cx - 170, cy - 120, 340, 36, 6);
      ctx.fill();
      ctx.stroke();

      // Draw Top Input Pins
      const pinCount = 14;
      const pinSpacing = 320 / pinCount;
      for (let i = 0; i < pinCount; i++) {
        const px = cx - 160 + i * pinSpacing + 8;
        const py = cy - 102;
        const isProbeActive = activeProbe === `DI.${i}`;

        ctx.fillStyle = isProbeActive ? "#22d3ee" : (dutyCycle > 0 && Math.sin(frame * 0.1 + i) > 0 ? "#10b981" : "#475569");
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pin Label
        ctx.fillStyle = isProbeActive ? "#38bdf8" : "#94a3b8";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`.${i}`, px, py - 8);
      }

      // Bottom Terminal Strip (Outputs DO 0..9)
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(cx - 170, cy + 84, 340, 36, 6);
      ctx.fill();
      ctx.stroke();

      // Draw Bottom Output Pins
      const outPinCount = 10;
      const outPinSpacing = 320 / outPinCount;
      for (let i = 0; i < outPinCount; i++) {
        const px = cx - 160 + i * outPinSpacing + 12;
        const py = cy + 102;
        const isProbeActive = activeProbe === `DO.${i}`;

        ctx.fillStyle = isProbeActive ? "#f43f5e" : (dutyCycle > 30 && Math.cos(frame * 0.08 + i) > 0 ? "#38bdf8" : "#475569");
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isProbeActive ? "#fda4af" : "#94a3b8";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`Q${i}`, px, py + 14);
      }

      // ── Main Chassis Enclosure ──
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - 160, cy - 70, 320, 140, 10);
      ctx.fill();
      ctx.stroke();

      // ── Internal Subsystems & Thermal Zones ──
      
      // 1. Central MCU (Microcontroller Core)
      const mcuColor = getTempColor(coreTemp);
      const pulse = isSimulating ? Math.sin(frame * 0.08) * 4 : 0;
      
      ctx.save();
      ctx.shadowColor = mcuColor.glow;
      ctx.shadowBlur = 12 + Math.abs(pulse);
      ctx.fillStyle = mcuColor.fill;
      ctx.strokeStyle = mcuColor.stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 45, cy - 35, 90, 70, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ARM Cortex-M", cx, cy - 10);
      ctx.fillStyle = mcuColor.stroke;
      ctx.font = "bold 11px monospace";
      ctx.fillText(`${coreTemp}°C`, cx, cy + 8);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "8px monospace";
      ctx.fillText(`${Math.round(dutyCycle)}% Load`, cx, cy + 22);

      // 2. Power Supply & 24V DC DC-DC Step-Down Regulator (Left)
      const pwrColor = getTempColor(powerRegTemp);
      ctx.save();
      ctx.shadowColor = pwrColor.glow;
      ctx.shadowBlur = 10;
      ctx.fillStyle = pwrColor.fill;
      ctx.strokeStyle = pwrColor.stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 145, cy - 50, 75, 100, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Power Rail", cx - 107, cy - 25);
      ctx.fillStyle = pwrColor.stroke;
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${powerRegTemp}°C`, cx - 107, cy - 8);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px monospace";
      ctx.fillText(`${voltageRipple.toFixed(1)}V DC`, cx - 107, cy + 12);
      ctx.fillStyle = "#64748b";
      ctx.font = "8px monospace";
      ctx.fillText("Buck-Boost", cx - 107, cy + 28);

      // 3. Isolated High-Speed Optocouplers & PROFINET Transceiver (Right)
      const optoColor = getTempColor(optoTemp);
      ctx.save();
      ctx.shadowColor = optoColor.glow;
      ctx.shadowBlur = 8;
      ctx.fillStyle = optoColor.fill;
      ctx.strokeStyle = optoColor.stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx + 70, cy - 50, 75, 100, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PROFINET IO", cx + 107, cy - 25);
      ctx.fillStyle = optoColor.stroke;
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${optoTemp}°C`, cx + 107, cy - 8);
      ctx.fillStyle = "#10b981";
      ctx.font = "9px monospace";
      ctx.fillText("100 Mbps", cx + 107, cy + 12);
      ctx.fillStyle = "#64748b";
      ctx.font = "8px monospace";
      ctx.fillText("Galvanic Iso", cx + 107, cy + 28);

      // Data Bus traces connecting blocks
      ctx.strokeStyle = isSimulating ? "rgba(56, 189, 248, 0.7)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -frame * 0.8;

      // Power -> MCU
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy);
      ctx.lineTo(cx - 45, cy);
      ctx.stroke();

      // MCU -> PROFINET
      ctx.beginPath();
      ctx.moveTo(cx + 45, cy);
      ctx.lineTo(cx + 70, cy);
      ctx.stroke();

      ctx.setLineDash([]); // Reset line dash

      // Live Telemetry Watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`DIGITAL TWIN: SIEMENS S7-1200 CPU 1214C [24V DC DC/DC/DC]`, 20, 25);
      ctx.fillText(`SIMULATION CLOCK: ${(frame * 16.6).toFixed(0)} ms | SAMPLES: ${frame * 12}`, 20, 42);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [temperature, dutyCycle, voltageRipple, activeProbe, isSimulating, coreTemp, powerRegTemp, optoTemp]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#070b16] overflow-hidden shadow-2xl">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-white">Live Micro-Physics Shader</span>
          <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
            FEM Heatmap
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Core Junction Temp:</span>
          <span className={`font-bold ${coreTemp > 75 ? "text-red-400 animate-pulse" : coreTemp > 60 ? "text-amber-400" : "text-emerald-400"}`}>
            {coreTemp}°C
          </span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={780}
        height={380}
        className="w-full h-auto cursor-crosshair block"
      />

      {/* Interactive Quick-Probe Selector */}
      <div className="p-3 border-t border-white/10 bg-[#0c1222]/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Interactive Pin Probe:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["DI.0 (Start Btn)", "DI.1 (Limit Sw)", "DI.4 (Encoder)", "DO.0 (Contactor)", "DO.2 (Valve)", "PROFINET"].map((p) => {
            const probeKey = p.split(" ")[0];
            const isSelected = activeProbe === probeKey;
            return (
              <Button
                key={p}
                size="sm"
                variant="outline"
                onClick={() => onSelectProbe(isSelected ? "" : probeKey)}
                className={`h-6 text-[11px] px-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30"
                    : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {p}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
