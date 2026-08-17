"use client";

import { FileText, Sparkles, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentRagViewer } from "@/components/rag/document-rag-viewer";

export default function DocumentRagPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Document Intelligence &amp; Vector RAG Studio
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              PDF Ingestion &amp; Chunking
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Semantic vector search, technical PDF chunking, table extraction, and optical citation grounding
          </p>
        </div>
      </div>

      <DocumentRagViewer />
    </div>
  );
}
