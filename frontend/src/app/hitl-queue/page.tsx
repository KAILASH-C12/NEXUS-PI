"use client";

import { UserCheck, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HitlReviewQueue } from "@/components/hitl/hitl-review-queue";

export default function HitlQueuePage() {
  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Human-In-The-Loop (HITL) Review Queue
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-amber-800 border-amber-300 bg-amber-50 font-bold">
              Autonomous Exception Handling
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Review low-confidence parameters, resolve cross-source conflicting specifications, and audit human overrides
          </p>
        </div>
      </div>

      <HitlReviewQueue />
    </div>
  );
}
