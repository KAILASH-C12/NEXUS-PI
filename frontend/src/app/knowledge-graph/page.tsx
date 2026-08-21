"use client";

import { Share2, Sparkles, Database, BadgeHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KnowledgeGraphViewer } from "@/components/graph/knowledge-graph-viewer";

export default function KnowledgeGraphPage() {
  return (
    <div className="space-y-8 max-w-6xl text-[#111113]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Industrial Knowledge Graph &amp; Ontology Explorer
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
              Neo4j / RDF Triplets
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Explore interconnected product families, electrical dependencies, compatible expansion modules, and global taxonomy nodes
          </p>
        </div>
      </div>

      <KnowledgeGraphViewer />
    </div>
  );
}
