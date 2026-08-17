"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { ConfidenceVector } from "@/lib/types";

export function ConfidenceRadarChart({
  vector,
  title = "4D Confidence Vector",
}: {
  vector?: ConfidenceVector;
  title?: string;
}) {
  const data = [
    {
      dimension: "Source Reliability",
      score: Math.round(((vector?.source_reliability ?? 0.95) * 100)),
      fullMark: 100,
    },
    {
      dimension: "Cross-Reference",
      score: Math.round(((vector?.cross_reference ?? 0.92) * 100)),
      fullMark: 100,
    },
    {
      dimension: "Ontology Match",
      score: Math.round(((vector?.ontology_consistency ?? 0.96) * 100)),
      fullMark: 100,
    },
    {
      dimension: "Temporal Freshness",
      score: Math.round(((vector?.temporal_freshness ?? 0.89) * 100)),
      fullMark: 100,
    },
  ];

  const overall = vector?.overall
    ? Math.round(vector.overall * 100)
    : Math.round(
        (data[0].score * 0.35 +
          data[1].score * 0.3 +
          data[2].score * 0.2 +
          data[3].score * 0.15)
      );

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          <span className="text-[11px] font-mono text-cyan-400 font-bold">{overall}%</span>
          <span className="text-[10px] text-slate-400">Composite</span>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="dimension"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Radar
              name="Confidence Score"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full mt-2 pt-2 border-t border-white/5 text-[11px] font-mono">
        <div className="flex justify-between text-slate-400">
          <span>Source Rel:</span>
          <span className="text-cyan-300 font-bold">{data[0].score}%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Cross-Ref:</span>
          <span className="text-cyan-300 font-bold">{data[1].score}%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Ontology:</span>
          <span className="text-cyan-300 font-bold">{data[2].score}%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Freshness:</span>
          <span className="text-cyan-300 font-bold">{data[3].score}%</span>
        </div>
      </div>
    </div>
  );
}
