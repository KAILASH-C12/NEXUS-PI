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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[#111113]">
      {/* ESG & Environmental Directives Card */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111113] uppercase">ESG &amp; Regulatory Compliance</h3>
              <p className="text-xs text-slate-600">RoHS 2011/65/EU, REACH SVHC, &amp; Carbon Footprint</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold">
            98.5% Score
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">RoHS 3 (EU 2015/863):</span>
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Fully Compliant
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">REACH SVHC Candidate:</span>
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> No SVHC &gt; 0.1% w/w
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Estimated Embodied Carbon:</span>
            <span className="text-emerald-800 font-bold">12.8 kg CO₂e</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Material Recyclability:</span>
            <span className="text-blue-800 font-bold">91.0% Circular Class</span>
          </div>
        </div>
      </div>

      {/* Lifecycle & Obsolescence Risk Card */}
      <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111113] uppercase">Lifecycle &amp; Obsolescence Risk</h3>
              <p className="text-xs text-slate-600">Mean Time Between Failures &amp; Active Production</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold">
            LOW RISK
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Commercial Lifecycle Phase:</span>
            <span className="text-emerald-800 font-bold">ACTIVE (Series Production)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Estimated MTBF (Operating Hrs):</span>
            <span className="text-indigo-800 font-bold">520,000 Hours (~59 yrs)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Estimated End-Of-Life (EOL):</span>
            <span className="text-[#111113] font-bold">Year 2034+</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#d4d4d8]">
            <span className="text-slate-700 font-bold">Counterfeit Supply Risk:</span>
            <span className="text-emerald-800 font-bold">Very Low (0.02)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
