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
  Loader2,
  WifiOff,
  Database,
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
import { NexusApiClient } from "@/lib/api-client";
import { ProductOutput } from "@/lib/types";
import { toast } from "sonner";

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { history, activeProduct, setActiveProduct, addToCompare } = useEnrichmentStore();

  const [product, setProduct] = useState<ProductOutput | null>(null);
  const [schematicOpen, setSchematicOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);

      // 1. Check local store / mock data first (instant)
      const localMatch =
        history.find((p) => p.product_id === resolvedParams.id) ||
        SAMPLE_PRODUCTS.find((p) => p.product_id === resolvedParams.id) ||
        activeProduct;

      if (localMatch && localMatch.product_id === resolvedParams.id) {
        setProduct(localMatch);
        setActiveProduct(localMatch);
        setLoading(false);
        return;
      }

      // 2. Try loading from database
      try {
        const dbProduct = await NexusApiClient.getProduct(resolvedParams.id);
        setProduct(dbProduct);
        setActiveProduct(dbProduct);
      } catch (e: any) {
        // 3. Fall back to active product if available
        if (activeProduct) {
          setProduct(activeProduct);
        } else {
          setError("Product not found in database. Backend may be unreachable.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 font-mono">
        <Loader2 className="h-6 w-6 animate-spin text-[#ff5500]" />
        <span className="text-sm text-slate-700 font-bold">Loading product dossier from database...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 space-y-4 font-mono">
        <WifiOff className="h-10 w-10 text-slate-400 mx-auto" />
        <p className="text-sm font-bold text-slate-700">{error || "Product not found"}</p>
        <Link href="/history">
          <button className="h-9 px-4 rounded-xl bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs">
            Browse Product History
          </button>
        </Link>
      </div>
    );
  }

  const confScore = Math.round((product.quality_report?.overall_confidence || 0.95) * 100);

  const handleAddToCompare = () => {
    addToCompare(product);
    toast.success(`Added ${product.input.part_number} to Differential Comparison Matrix`);
    router.push("/compare");
  };

  const handleExportJson = async () => {
    try {
      await NexusApiClient.exportProduct(product.product_id);
      toast.success("Product Intelligence Dossier downloaded as JSON");
    } catch {
      // Fallback to client-side export
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product, null, 2));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `${product.input.part_number}_dossier.json`);
      dlAnchor.click();
      toast.success("Product Intelligence Dossier downloaded as JSON");
    }
  };

  const handlePrintSpecSheet = () => {
    toast.info("Generating official engineering datasheet — select 'Save as PDF'");
    window.print();
  };

  return (
    <div className="space-y-8 text-[#111113]">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div className="space-y-2">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-xs text-[#ff5500] hover:underline font-mono font-bold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Product History
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111113] font-mono tracking-tight">
              {product.input.brand} {product.input.part_number}
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-mono font-bold">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {confScore}% Verified
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs font-mono font-bold">
              <Database className="h-3 w-3 mr-1" />
              Persisted
            </Badge>
          </div>

          <p className="text-xs font-mono text-slate-600 font-semibold max-w-2xl">
            {product.input.description} &bull; ID: <code className="text-[#ff5500] font-bold">{product.product_id}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={handlePrintSpecSheet}
            className="h-9 px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] text-xs font-bold text-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-[#ff5500]" />
            <span>Print / PDF Datasheet</span>
          </button>

          <button
            onClick={() => setSchematicOpen(true)}
            className="h-9 px-3 border border-[#d4d4d8] bg-white hover:border-amber-400 text-xs font-bold text-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Box className="h-3.5 w-3.5 text-amber-500" />
            <span>3D CAD Blueprint</span>
          </button>

          <button
            onClick={handleAddToCompare}
            className="h-9 px-3 border border-[#d4d4d8] bg-white hover:border-[#ff5500] text-xs font-bold text-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <GitCompare className="h-3.5 w-3.5 text-[#ff5500]" />
            <span>Compare SKU</span>
          </button>

          <button
            onClick={handleExportJson}
            className="h-9 px-4 bg-[#ff5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#ff5500]/25 transition-all flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 4D Confidence & Taxonomy Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm">
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
      <Tabs defaultValue="specs" className="w-full space-y-4 font-mono">
        <TabsList className="bg-white border-2 border-[#d4d4d8] p-1 flex flex-wrap gap-1 rounded-2xl shadow-xs">
          <TabsTrigger value="specs" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
            Technical Specs ({product.specifications.length})
          </TabsTrigger>
          <TabsTrigger value="provenance" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
            4D Provenance Lineage
          </TabsTrigger>
          <TabsTrigger value="pinout" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
            Pinout &amp; Wiring
          </TabsTrigger>
          <TabsTrigger value="esg" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
            ESG &amp; Lifecycle
          </TabsTrigger>
          <TabsTrigger value="commerce" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
            Commerce Content &amp; SEO
          </TabsTrigger>
          <TabsTrigger value="related" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-xl">
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
                className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-mono font-bold ${
                      rp.relationship_type === "COMPATIBLE"
                        ? "bg-blue-50 text-blue-800 border-blue-300"
                        : rp.relationship_type === "ACCESSORY"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-indigo-50 text-indigo-800 border-indigo-300"
                    }`}
                  >
                    {rp.relationship_type}
                  </Badge>
                  <span className="text-[11px] font-mono font-bold text-emerald-700">
                    {Math.round(rp.confidence * 100)}% Match
                  </span>
                </div>

                <h3 className="font-mono text-sm font-bold text-[#111113]">{rp.part_number}</h3>
                <p className="text-xs text-slate-600 font-semibold">{rp.name}</p>

                <Link href={`/enrich?q=${encodeURIComponent(rp.part_number)}`}>
                  <button className="w-full h-8 text-xs border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] text-slate-800 font-bold rounded-lg mt-2 transition-all flex items-center justify-center gap-1">
                    <span>Enrich This SKU</span>
                    <Sparkles className="h-3 w-3" />
                  </button>
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
