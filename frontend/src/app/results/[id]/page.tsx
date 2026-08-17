"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Download,
  Copy,
  GitCompare,
  Sparkles,
  Layers,
  FileText,
  Calendar,
  ExternalLink,
  Cpu,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidenceRadarChart } from "@/components/charts/confidence-radar";
import { SpecsTable } from "@/components/enrichment/specs-table";
import { TaxonomyCard } from "@/components/enrichment/taxonomy-card";
import { CommercePreview } from "@/components/enrichment/commerce-preview";
import { ProvenanceTree } from "@/components/enrichment/provenance-tree";
import { LifecycleEsgCard } from "@/components/enrichment/lifecycle-esg-card";
import { PinoutDiagram } from "@/components/enrichment/pinout-diagram";
import { SchematicGeneratorModal } from "@/components/enrichment/schematic-generator-modal";
import { useEnrichmentStore } from "@/stores/enrichment-store";
import { SAMPLE_PRODUCTS } from "@/lib/mock-data";
import { ProductOutput } from "@/lib/types";
import { toast } from "sonner";

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { history, activeProduct, setActiveProduct, addToCompare } = useEnrichmentStore();

  const [product, setProduct] = useState<ProductOutput | null>(null);
  const [schematicOpen, setSchematicOpen] = useState(false);

  useEffect(() => {
    // Look up product by ID from history or mock data
    const match =
      history.find((p) => p.product_id === resolvedParams.id) ||
      SAMPLE_PRODUCTS.find((p) => p.product_id === resolvedParams.id) ||
      activeProduct;

    if (match) {
      setProduct(match);
      setActiveProduct(match);
    }
  }, [resolvedParams.id, history, activeProduct, setActiveProduct]);

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400">Loading product dossier...</p>
      </div>
    );
  }

  const confScore = Math.round((product.quality_report?.overall_confidence || 0.95) * 100);

  const handleAddToCompare = () => {
    addToCompare(product);
    toast.success(`Added ${product.input.part_number} to Differential Comparison Matrix`);
    router.push("/compare");
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${product.input.part_number}_dossier.json`);
    dlAnchor.click();
    toast.success("Product Intelligence Dossier downloaded as JSON");
  };

  return (
    <div className="space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Command Center
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {product.input.brand} {product.input.part_number}
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {confScore}% Verified
            </Badge>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl">
            {product.input.description} &bull; ID: <code className="text-cyan-300 font-mono">{product.product_id}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSchematicOpen(true)}
            className="border-white/10 text-xs text-amber-300 hover:border-amber-500/40 rounded-xl"
          >
            <Box className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            <span>3D CAD Blueprint</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCompare}
            className="border-white/10 text-xs text-slate-300 rounded-xl"
          >
            <GitCompare className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
            <span>Compare SKU</span>
          </Button>

          <Button
            size="sm"
            onClick={handleExportJson}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            <span>Export Dossier</span>
          </Button>
        </div>
      </div>

      {/* 4D Confidence & Taxonomy Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ConfidenceRadarChart
            vector={product.taxonomy?.confidence || {
              overall: 0.965,
              source_reliability: 0.98,
              cross_reference: 0.95,
              ontology_consistency: 0.97,
              temporal_freshness: 0.92,
            }}
            title="Product 4D Confidence Vector"
          />
        </div>

        <div className="lg:col-span-2">
          <TaxonomyCard taxonomy={product.taxonomy} />
        </div>
      </div>

      {/* Deep Tabs (Specs, Lineage, Commerce, Related) */}
      <Tabs defaultValue="specs" className="w-full space-y-4">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1">
          <TabsTrigger value="specs" className="text-xs">
            Technical Specs ({product.specifications.length})
          </TabsTrigger>
          <TabsTrigger value="provenance" className="text-xs">
            4D Provenance Lineage
          </TabsTrigger>
          <TabsTrigger value="pinout" className="text-xs">
            Pinout &amp; Wiring
          </TabsTrigger>
          <TabsTrigger value="esg" className="text-xs">
            ESG &amp; Lifecycle
          </TabsTrigger>
          <TabsTrigger value="commerce" className="text-xs">
            Commerce Content &amp; SEO
          </TabsTrigger>
          <TabsTrigger value="related" className="text-xs">
            Related SKUs ({product.related_products?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specs">
          <SpecsTable
            specifications={product.specifications}
            partNumber={product.input.part_number}
          />
        </TabsContent>

        {/* Provenance Tab */}
        <TabsContent value="provenance">
          <ProvenanceTree specifications={product.specifications} />
        </TabsContent>

        {/* Pinout Tab */}
        <TabsContent value="pinout">
          <PinoutDiagram
            brand={product.input.brand}
            partNumber={product.input.part_number}
          />
        </TabsContent>

        {/* ESG & Lifecycle Tab */}
        <TabsContent value="esg">
          <LifecycleEsgCard
            brand={product.input.brand}
            partNumber={product.input.part_number}
          />
        </TabsContent>

        {/* Commerce Tab */}
        <TabsContent value="commerce">
          <CommercePreview
            content={product.commerce_content}
            partNumber={product.input.part_number}
            brand={product.input.brand}
          />
        </TabsContent>

        {/* Related Products Tab */}
        <TabsContent value="related">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.related_products?.map((rp, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-mono ${
                      rp.relationship_type === "COMPATIBLE"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : rp.relationship_type === "ACCESSORY"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                    }`}
                  >
                    {rp.relationship_type}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400">
                    {Math.round(rp.confidence * 100)}% Match
                  </span>
                </div>

                <h3 className="font-mono text-sm font-bold text-white">{rp.part_number}</h3>
                <p className="text-xs text-slate-300">{rp.name}</p>

                <Link href={`/enrich?q=${encodeURIComponent(rp.part_number)}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs border-white/10 hover:border-cyan-500/40 text-cyan-300 mt-2"
                  >
                    <span>Enrich This SKU</span>
                    <Sparkles className="h-3 w-3 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 3D CAD Schematic Modal */}
      <SchematicGeneratorModal
        open={schematicOpen}
        onOpenChange={setSchematicOpen}
        brand={product.input.brand}
        partNumber={product.input.part_number}
      />
    </div>
  );
}
