"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  History,
  Check,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface HITLItem {
  id: string;
  partNumber: string;
  brand: string;
  attributeName: string;
  extractedValue: string;
  confidence: number;
  anomalyReason: string;
  suggestedAlternative: string;
  source: string;
  status: "PENDING" | "APPROVED" | "OVERRIDDEN" | "REJECTED";
}

const INITIAL_HITL_ITEMS: HITLItem[] = [
  {
    id: "hitl-01",
    partNumber: "6ES7214-1AG40-0XB0",
    brand: "Siemens",
    attributeName: "analog_input_range",
    extractedValue: "0 - 10V DC (10-bit)",
    confidence: 0.68,
    anomalyReason: "Secondary distributor catalog lists 0-20mA; OEM manual specifies 0-10V DC.",
    suggestedAlternative: "0 - 10V DC (Standard Voltage Mode)",
    source: "RS Components vs Siemens Manual",
    status: "PENDING",
  },
  {
    id: "hitl-02",
    partNumber: "ATV320U15N4B",
    brand: "Schneider Electric",
    attributeName: "overload_capacity",
    extractedValue: "170% for 60 seconds",
    confidence: 0.64,
    anomalyReason: "Discrepancy between Heavy Duty (170% 60s) and Normal Duty (110% 60s) ratings.",
    suggestedAlternative: "170% for 60s (Heavy Duty)",
    source: "Altivar 320 Catalog",
    status: "PENDING",
  },
  {
    id: "hitl-03",
    partNumber: "ACS580-01-018A-4",
    brand: "ABB",
    attributeName: "short_circuit_rating_sccr",
    extractedValue: "100 kA with fuses",
    confidence: 0.69,
    anomalyReason: "Requires specific UL Class T or J fuse coordination to achieve 100 kA SCCR.",
    suggestedAlternative: "100 kA (with Class T/J Fuses)",
    source: "ABB Installation Manual",
    status: "PENDING",
  },
];

export function HitlReviewQueue() {
  const [items, setItems] = useState<HITLItem[]>(INITIAL_HITL_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [overrideValue, setOverrideValue] = useState<string>("");

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "APPROVED" } : i))
    );
    toast.success("Attribute approved by human operator and published to master catalog");
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "REJECTED" } : i))
    );
    toast.error("Attribute rejected from catalog output");
  };

  const handleOverride = (id: string) => {
    if (!overrideValue.trim()) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, extractedValue: overrideValue, status: "OVERRIDDEN" } : i
      )
    );
    setEditingId(null);
    setOverrideValue("");
    toast.success("Manual override saved and logged to audit trail");
  };

  const pendingCount = items.filter((i) => i.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">
              Human-In-The-Loop (HITL) Exception Queue
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Attributes with confidence below 70% or conflicting cross-reference citations require operational approval
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/30">
          {pendingCount} Exceptions Pending Review
        </Badge>
      </div>

      {/* Review Queue Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-5 backdrop-blur-xl transition-all space-y-4 ${
              item.status === "PENDING"
                ? "bg-[#0c1222]/80 border-amber-500/30"
                : item.status === "APPROVED"
                ? "bg-emerald-950/10 border-emerald-500/30 opacity-75"
                : item.status === "OVERRIDDEN"
                ? "bg-cyan-950/10 border-cyan-500/30 opacity-75"
                : "bg-red-950/10 border-red-500/30 opacity-60"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {item.brand} {item.partNumber}
                </span>
                <h3 className="text-sm font-bold text-white font-mono mt-0.5">
                  Attribute: <span className="text-amber-300">{item.attributeName}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono text-amber-400 border-amber-500/30">
                  Confidence: {(item.confidence * 100).toFixed(0)}%
                </Badge>
                <Badge
                  className={`text-[10px] font-mono font-bold ${
                    item.status === "PENDING"
                      ? "bg-amber-500 text-black"
                      : item.status === "APPROVED"
                      ? "bg-emerald-500 text-black"
                      : item.status === "OVERRIDDEN"
                      ? "bg-cyan-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>

            {/* Extracted vs Alternative Diff Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">Extracted Value:</span>
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={overrideValue}
                      onChange={(e) => setOverrideValue(e.target.value)}
                      placeholder="Enter verified value..."
                      className="h-8 text-xs bg-black border-cyan-500/50 text-white"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleOverride(item.id)}
                      className="h-8 px-3 text-xs bg-cyan-500 hover:bg-cyan-400 text-black"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <span className="text-white font-bold">{item.extractedValue}</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">AI Anomaly Reason:</span>
                <span className="text-amber-200/90 text-[11px] block">{item.anomalyReason}</span>
              </div>
            </div>

            {/* Actions Bar */}
            {item.status === "PENDING" && (
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(item.id);
                    setOverrideValue(item.suggestedAlternative);
                  }}
                  className="h-8 text-xs border-white/10 text-cyan-300 hover:bg-cyan-500/10"
                >
                  <Edit3 className="h-3 w-3 mr-1.5" /> Manual Override
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item.id)}
                  className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="h-3 w-3 mr-1.5" /> Reject Spec
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="h-8 text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1.5" /> Approve Extracted Spec
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
