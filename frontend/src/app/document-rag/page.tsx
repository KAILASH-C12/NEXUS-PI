"use client";

import { FileText, Sparkles, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentRagViewer } from "@/components/rag/document-rag-viewer";

export default function DocumentRagPage() {
  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Document Intelligence &amp; Vector RAG Studio
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              PDF Ingestion &amp; Chunking
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Semantic vector search, technical PDF chunking, table extraction, and optical citation grounding
          </p>
        </div>
      </div>

      <DocumentRagViewer />
    </div>
  );
}
