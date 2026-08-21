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
    <div className="space-y-6 font-mono text-[#111113]">
      {/* Overview Metric Banner */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111113] uppercase">
              Human-In-The-Loop (HITL) Exception Queue
            </h2>
            <p className="text-xs text-slate-700 mt-0.5 font-semibold">
              Attributes with confidence below 70% or conflicting cross-reference citations require operational approval
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-mono text-amber-900 border-amber-400 bg-amber-100 font-bold">
          {pendingCount} Exceptions Pending Review
        </Badge>
      </div>

      {/* Review Queue Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border-2 p-5 transition-all space-y-4 shadow-sm ${
              item.status === "PENDING"
                ? "bg-white border-amber-300"
                : item.status === "APPROVED"
                ? "bg-emerald-50/50 border-emerald-300"
                : item.status === "OVERRIDDEN"
                ? "bg-blue-50/50 border-blue-300"
                : "bg-red-50/50 border-red-300 opacity-70"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4d4d8] pb-3">
              <div>
                <span className="text-xs text-[#ff5500] font-bold">
                  {item.brand} {item.partNumber}
                </span>
                <h3 className="text-sm font-bold text-[#111113] mt-0.5">
                  Attribute: <span className="text-amber-800">{item.attributeName}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] text-amber-900 border-amber-300 bg-amber-50 font-bold">
                  Confidence: {(item.confidence * 100).toFixed(0)}%
                </Badge>
                <Badge
                  className={`text-[10px] font-bold ${
                    item.status === "PENDING"
                      ? "bg-amber-500 text-white"
                      : item.status === "APPROVED"
                      ? "bg-emerald-600 text-white"
                      : item.status === "OVERRIDDEN"
                      ? "bg-blue-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>

            {/* Extracted vs Alternative Diff Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">Extracted Value:</span>
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={overrideValue}
                      onChange={(e) => setOverrideValue(e.target.value)}
                      placeholder="Enter verified value..."
                      className="h-8 text-xs bg-white border-[#ff5500] text-[#111113]"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleOverride(item.id)}
                      className="h-8 px-3 text-xs bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <span className="text-[#111113] font-bold text-sm">{item.extractedValue}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#d4d4d8] space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">AI Anomaly Reason:</span>
                <span className="text-amber-900 font-semibold text-[11px] block">{item.anomalyReason}</span>
              </div>
            </div>

            {/* Actions Bar */}
            {item.status === "PENDING" && (
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setOverrideValue(item.suggestedAlternative);
                  }}
                  className="h-8 px-3 text-xs font-bold border border-[#d4d4d8] bg-white text-slate-800 hover:border-[#ff5500] rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Edit3 className="h-3 w-3" /> Manual Override
                </button>

                <button
                  onClick={() => handleReject(item.id)}
                  className="h-8 px-3 text-xs font-bold border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <XCircle className="h-3 w-3" /> Reject Spec
                </button>

                <button
                  onClick={() => handleApprove(item.id)}
                  className="h-8 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve Spec
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
