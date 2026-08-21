"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Database,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Filter,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NexusApiClient } from "@/lib/api-client";
import { ProductOutput, ProductsListResponse } from "@/lib/types";
import { toast } from "sonner";

export default function ProductHistoryPage() {
  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await NexusApiClient.getProducts({
        page,
        page_size: 15,
        search: searchQuery || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setData(result);
    } catch (e: any) {
      setError(e.message || "Failed to load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this enriched product permanently?")) return;
    setDeletingId(productId);
    try {
      await NexusApiClient.deleteProduct(productId);
      toast.success("Product deleted from database");
      fetchProducts();
    } catch (e: any) {
      toast.error(`Delete failed: ${e.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async (productId: string) => {
    try {
      await NexusApiClient.exportProduct(productId);
      toast.success("Product exported as JSON");
    } catch (e: any) {
      toast.error(`Export failed: ${e.message}`);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6 text-[#111113]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d4d8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ff5500] inline-block" />
            <h1 className="text-2xl font-black font-mono text-[#111113] tracking-tight uppercase">
              Product History
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-blue-700 border-blue-400/50 bg-blue-50 font-bold">
              <Database className="h-3 w-3 mr-1" />
              SQLite
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-600 mt-1">
            All enriched products are persistently stored &mdash; search, filter, export, or re-inspect any dossier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="h-9 px-3 rounded-lg border border-[#d4d4d8] bg-white hover:border-[#ff5500] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all text-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <Link href="/enrich">
            <button className="h-9 px-4 rounded-lg bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Enrichment</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 font-mono">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by part number, brand, description, or specification..."
            className="pl-10 bg-white border-[#d4d4d8] text-sm h-10 rounded-xl"
          />
        </div>
        <Button type="submit" className="bg-[#111113] hover:bg-[#222228] text-white rounded-xl text-xs font-mono font-bold px-5">
          Search
        </Button>
      </form>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 flex items-center gap-4">
          <WifiOff className="h-8 w-8 text-red-500 shrink-0" />
          <div>
            <h3 className="font-mono font-bold text-red-800 text-sm">Backend Unreachable</h3>
            <p className="text-xs text-red-700 font-mono mt-1">{error}</p>
            <p className="text-xs text-red-600 font-mono mt-2">
              Start the backend: <code className="bg-red-100 px-1.5 py-0.5 rounded">uvicorn nexus_pi.api.main:app --reload --port 8000</code>
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff5500]" />
          <span className="ml-3 text-sm font-mono text-slate-600">Loading products from database...</span>
        </div>
      )}

      {/* Products Table */}
      {data && !loading && (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-600">
            <span>
              Showing <strong className="text-[#111113]">{data.products.length}</strong> of{" "}
              <strong className="text-[#111113]">{data.total}</strong> products
              {searchQuery && <span className="text-[#ff5500]"> matching &ldquo;{searchQuery}&rdquo;</span>}
            </span>
            <span>Page {data.page} of {data.total_pages}</span>
          </div>

          {data.products.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#d4d4d8] bg-slate-50 p-12 text-center space-y-3">
              <Database className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-mono font-bold text-slate-700">No Enriched Products Yet</h3>
              <p className="text-xs font-mono text-slate-500">
                Run your first enrichment to start building your product intelligence database
              </p>
              <Link href="/enrich">
                <button className="mt-2 h-9 px-5 rounded-lg bg-[#ff5500] hover:bg-[#e04b00] text-white font-mono font-bold text-xs">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1.5" />
                  Enrich First Product
                </button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#d4d4d8] bg-slate-50 text-left text-slate-500 uppercase">
                      <th className="p-3 font-bold cursor-pointer hover:text-[#ff5500]" onClick={() => toggleSort("part_number")}>
                        <span className="flex items-center gap-1">Part Number <ArrowUpDown className="h-3 w-3" /></span>
                      </th>
                      <th className="p-3 font-bold cursor-pointer hover:text-[#ff5500]" onClick={() => toggleSort("brand")}>
                        <span className="flex items-center gap-1">Brand <ArrowUpDown className="h-3 w-3" /></span>
                      </th>
                      <th className="p-3 font-bold">Description</th>
                      <th className="p-3 font-bold cursor-pointer hover:text-[#ff5500]" onClick={() => toggleSort("overall_confidence")}>
                        <span className="flex items-center gap-1">Confidence <ArrowUpDown className="h-3 w-3" /></span>
                      </th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold cursor-pointer hover:text-[#ff5500]" onClick={() => toggleSort("created_at")}>
                        <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                      </th>
                      <th className="p-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.products.map((prod) => {
                      const conf = prod.quality_report?.overall_confidence || 0;
                      const confPct = Math.round(conf * 100);
                      const needsReview = prod.quality_report?.human_review_required;

                      return (
                        <tr key={prod.product_id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3">
                            <Link
                              href={`/results/${prod.product_id}`}
                              className="font-bold text-[#111113] hover:text-[#ff5500] transition-colors"
                            >
                              {prod.input.part_number}
                            </Link>
                          </td>
                          <td className="p-3 text-slate-700">{prod.input.brand}</td>
                          <td className="p-3 text-slate-600 max-w-[200px] truncate">{prod.input.description}</td>
                          <td className="p-3">
                            <span className={`font-bold ${confPct >= 85 ? "text-emerald-700" : confPct >= 70 ? "text-amber-600" : "text-red-600"}`}>
                              {confPct}%
                            </span>
                          </td>
                          <td className="p-3">
                            {needsReview ? (
                              <Badge variant="outline" className="text-[9px] text-amber-700 border-amber-300 bg-amber-50 font-bold">
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" /> REVIEW
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 bg-emerald-50 font-bold">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> APPROVED
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 text-slate-500">
                            {new Date(prod.timestamp).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleExport(prod.product_id)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                title="Export JSON"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(prod.product_id)}
                                disabled={deletingId === prod.product_id}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === prod.product_id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-8 px-3 rounded-lg border border-[#d4d4d8] bg-white text-xs font-mono font-bold text-slate-700 hover:border-[#ff5500] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </button>

              {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(data.total_pages - 4, page - 2)) + i;
                if (pageNum > data.total_pages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-mono font-bold transition-all ${
                      pageNum === page
                        ? "bg-[#ff5500] text-white shadow-md"
                        : "border border-[#d4d4d8] bg-white text-slate-700 hover:border-[#ff5500]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(Math.min(data.total_pages, page + 1))}
                disabled={page === data.total_pages}
                className="h-8 px-3 rounded-lg border border-[#d4d4d8] bg-white text-xs font-mono font-bold text-slate-700 hover:border-[#ff5500] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
