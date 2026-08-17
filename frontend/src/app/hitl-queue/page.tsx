"use client";

import { UserCheck, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HitlReviewQueue } from "@/components/hitl/hitl-review-queue";

export default function HitlQueuePage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Human-In-The-Loop (HITL) Review Queue
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/30">
              Autonomous Exception Handling
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review low-confidence parameters, resolve cross-source conflicting specifications, and audit human overrides
          </p>
        </div>
      </div>

      <HitlReviewQueue />
    </div>
  );
}
