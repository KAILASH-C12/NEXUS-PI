"use client";

import { Leaf, Clock, ShieldCheck, AlertCircle, CheckCircle2, Zap, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LifecycleEsgCard({
  brand = "Siemens",
  partNumber = "6ES7214-1AG40-0XB0",
}: {
  brand?: string;
  partNumber?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ESG & Environmental Directives Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">ESG &amp; Regulatory Compliance</h3>
              <p className="text-xs text-slate-400">RoHS 2011/65/EU, REACH SVHC, &amp; Carbon Footprint</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
            98.5% Score
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">RoHS 3 (EU 2015/863):</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Fully Compliant
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">REACH SVHC Candidate:</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> No SVHC &gt; 0.1% w/w
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Estimated Embodied Carbon:</span>
            <span className="text-cyan-300 font-mono font-bold">12.8 kg CO₂e</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Material Recyclability:</span>
            <span className="text-cyan-300 font-mono font-bold">91.0% Circular Class</span>
          </div>
        </div>
      </div>

      {/* Lifecycle & Obsolescence Risk Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Lifecycle &amp; Obsolescence Risk</h3>
              <p className="text-xs text-slate-400">Mean Time Between Failures &amp; Active Production</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
            LOW RISK
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Commercial Lifecycle Phase:</span>
            <span className="text-emerald-400 font-mono font-bold">ACTIVE (Series Production)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Estimated MTBF (Operating Hrs):</span>
            <span className="text-cyan-300 font-mono font-bold">520,000 Hours (~59 yrs)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Estimated End-Of-Life (EOL):</span>
            <span className="text-white font-mono font-bold">Year 2034+</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-300">Counterfeit Supply Risk:</span>
            <span className="text-emerald-400 font-mono font-bold">Very Low (0.02)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
