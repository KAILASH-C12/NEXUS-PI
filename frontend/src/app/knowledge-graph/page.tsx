"use client";

import { Share2, Sparkles, Database, BadgeHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KnowledgeGraphViewer } from "@/components/graph/knowledge-graph-viewer";

export default function KnowledgeGraphPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Industrial Knowledge Graph &amp; Ontology Explorer
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/30">
              Neo4j / RDF Triplets
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore interconnected product families, electrical dependencies, compatible expansion modules, and global taxonomy nodes
          </p>
        </div>
      </div>

      <KnowledgeGraphViewer />
    </div>
  );
}
