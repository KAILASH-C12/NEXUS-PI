"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Radio, Eye, Activity } from "lucide-react";

export function NexusBotTerminal({ onInteract }: { onInteract?: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [statusText, setStatusText] = useState("6-MODEL SYNCHRONIZED SWARM");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse tracking for eyes
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Periodic subtle eye blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    setStatusText("ANALYZING MESH... 96.5% TRUST");
    setTimeout(() => setStatusText("6-MODEL SYNCHRONIZED SWARM"), 2500);
    if (onInteract) onInteract();
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[420px] mx-auto group">
      {/* ── MAIN INDUSTRIAL CHASSIS ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative w-full rounded-[28px] bg-[#fafafa] border-2 border-[#d0d0d4] p-5 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(255,85,0,0.15)] cursor-pointer overflow-hidden"
        style={{
          clipPath:
            "polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)",
        }}
      >
        {/* Top/Side Orange Structural Accents */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-[#ff5500]" />
        <div className="absolute top-6 left-0 w-1 h-16 bg-[#ff5500]" />
        <div className="absolute top-6 right-0 w-1 h-16 bg-[#ff5500]" />
        <div className="absolute bottom-6 left-0 w-1 h-16 bg-[#ff5500]" />
        <div className="absolute bottom-6 right-0 w-1 h-16 bg-[#ff5500]" />

        {/* ── TOP HEADER BAR ── */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e6] text-[11px] font-mono">
          {/* Top Left: NEXUS-AI BOT */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block rounded-xs" />
            <span className="font-bold text-[#ff5500] tracking-widest uppercase">NEXUS-AI BOT</span>
          </div>

          {/* Top Center: Orange Speed Notches */}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-3 bg-[#ff5500] transform -skew-x-20 rounded-xs" />
            <div className="w-1.5 h-3 bg-[#ff5500] transform -skew-x-20 rounded-xs" />
            <div className="w-1.5 h-3 bg-[#ff5500] transform -skew-x-20 rounded-xs" />
            <div className="w-1.5 h-3 bg-[#ff5500] transform -skew-x-20 rounded-xs" />
          </div>

          {/* Top Right: Status Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-emerald-500/40 text-emerald-600 font-bold text-[10px] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
            {/* Dotted Grid Vent */}
            <div className="hidden sm:grid grid-cols-2 gap-0.5 text-slate-300">
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="h-1 w-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>

        {/* ── CENTER DISPLAY: RADIANT AMBER/ORANGE INNER BEZEL ── */}
        <div className="my-4 p-1.5 rounded-2xl bg-gradient-to-b from-[#ff8800] via-[#ff5500] to-[#e04400] shadow-[0_0_25px_rgba(255,85,0,0.35)] relative">
          {/* Inner Dark Screen */}
          <div className="relative w-full aspect-[16/10] rounded-xl bg-[#0a0a0c] border border-black overflow-hidden flex items-center justify-center">
            {/* Coordinate Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff550012_1px,transparent_1px),linear-gradient(to_bottom,#ff550012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Corner Bracket Reticles */}
            <span className="absolute top-2.5 left-2.5 text-[#ff5500] font-mono text-xs font-bold leading-none select-none">
              ⌜
            </span>
            <span className="absolute top-2.5 right-2.5 text-[#ff5500] font-mono text-xs font-bold leading-none select-none">
              ⌝
            </span>
            <span className="absolute bottom-2.5 left-2.5 text-[#ff5500] font-mono text-xs font-bold leading-none select-none">
              ⌞
            </span>
            <span className="absolute bottom-2.5 right-2.5 text-[#ff5500] font-mono text-xs font-bold leading-none select-none">
              ⌟
            </span>

            {/* Side Center Tick Markers */}
            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[#ff5500] font-mono text-[9px] font-bold">
              <span className="h-3 w-1 bg-[#ff5500] rounded-xs" />
              <span className="h-1.5 w-1 bg-[#ff5500]/60 rounded-xs" />
            </div>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[#ff5500] font-mono text-[9px] font-bold">
              <span className="h-3 w-1 bg-[#ff5500] rounded-xs" />
              <span className="h-1.5 w-1 bg-[#ff5500]/60 rounded-xs" />
            </div>

            {/* ── DUAL GLOWING WHITE OPTICAL SENSOR EYES ── */}
            <div
              className="flex items-center gap-16 transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              }}
            >
              {/* Left Eye */}
              <motion.div
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                }}
                transition={{ duration: 0.1 }}
                className="relative flex items-center justify-center"
              >
                {/* Warm Amber Outer Halo */}
                <div className="absolute w-12 h-12 rounded-full bg-[#ff7700]/30 blur-[10px]" />
                {/* Pure White Core Orb */}
                <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_18px_#ffffff,0_0_35px_#ff6600]" />
              </motion.div>

              {/* Right Eye */}
              <motion.div
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                }}
                transition={{ duration: 0.1 }}
                className="relative flex items-center justify-center"
              >
                {/* Warm Amber Outer Halo */}
                <div className="absolute w-12 h-12 rounded-full bg-[#ff7700]/30 blur-[10px]" />
                {/* Pure White Core Orb */}
                <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_18px_#ffffff,0_0_35px_#ff6600]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEGEND FOOTER ── */}
        <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-slate-700 font-bold tracking-widest uppercase">
          <div className="flex items-center gap-1.5 text-[#ff5500]">
            <span>—</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500]" />
            <span>—</span>
          </div>
          <span className="text-[#111113] group-hover:text-[#ff5500] transition-colors">
            {statusText}
          </span>
          <div className="flex items-center gap-1.5 text-[#ff5500]">
            <span>—</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500]" />
            <span>—</span>
          </div>
        </div>
      </div>

      {/* ── INDUSTRIAL PEDESTAL BASE WITH WARM ORANGE UNDERGLOW ── */}
      <div className="relative w-48 h-5 -mt-1 bg-[#dcdce2] border-2 border-t-0 border-[#b8b8be] rounded-b-xl shadow-lg flex items-center justify-center">
        <div className="absolute inset-x-4 bottom-0 h-2 bg-[#ff5500]/60 blur-[6px] rounded-full" />
      </div>
    </div>
  );
}
