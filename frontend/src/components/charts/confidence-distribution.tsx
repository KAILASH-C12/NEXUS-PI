"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export function ConfidenceDistributionChart() {
  const data = [
    { range: "95-100%", count: 184, color: "#10b981" },
    { range: "90-94%", count: 112, color: "#06b6d4" },
    { range: "85-89%", count: 58, color: "#3b82f6" },
    { range: "80-84%", count: 24, color: "#8b5cf6" },
    { range: "70-79%", count: 11, color: "#f59e0b" },
    { range: "<70% (HITL)", count: 3, color: "#ef4444" },
  ];

  return (
    <div className="flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
            Confidence Distribution
          </span>
          <p className="text-[11px] text-slate-400">Total 392 validated SKU specs</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          96.4% Avg
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="range" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0c1222",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
