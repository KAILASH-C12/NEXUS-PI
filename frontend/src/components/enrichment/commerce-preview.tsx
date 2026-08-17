"use client";

import { useState } from "react";
import { CommerceContent } from "@/lib/types";
import {
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CommercePreview({
  content,
  partNumber = "6ES7214-1AG40-0XB0",
  brand = "Siemens",
}: {
  content: CommerceContent;
  partNumber?: string;
  brand?: string;
}) {
  const [copied, setCopied] = useState(false);

  const jsonLdSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${brand} ${partNumber}`,
    description: content.long_description,
    mpn: partNumber,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };

  const copyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
    setCopied(true);
    toast.success("JSON-LD Schema copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Commerce & SEO Content Generation</h3>
            <p className="text-xs text-slate-400">B2B product descriptions, key selling points, and SEO metadata</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-pink-400 border-pink-500/30">
          Ready to Publish
        </Badge>
      </div>

      <Tabs defaultValue="copy" className="w-full">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1">
          <TabsTrigger value="copy" className="text-xs">Product Copy & Features</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs">SEO Meta & SERP</TabsTrigger>
          <TabsTrigger value="schema" className="text-xs">JSON-LD Schema</TabsTrigger>
        </TabsList>

        {/* Product Copy Tab */}
        <TabsContent value="copy" className="space-y-4 pt-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Long Description</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {content.long_description}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Key Value Highlights</h4>
            <ul className="space-y-2">
              {content.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* SEO Meta Tab */}
        <TabsContent value="seo" className="space-y-4 pt-3">
          {/* Simulated Google Search Result */}
          <div className="rounded-xl border border-white/10 bg-[#070b16] p-4 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Google SERP Preview</span>
            <div className="text-[11px] text-emerald-400">https://industry-catalog.com &gt; automation &gt; {partNumber}</div>
            <h4 className="text-sm font-medium text-cyan-400 hover:underline cursor-pointer">
              {content.seo_meta_title}
            </h4>
            <p className="text-xs text-slate-300 leading-normal">
              {content.seo_meta_description}
            </p>
          </div>

          {/* Keywords */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Extracted Semantic Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {content.keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-white/5 text-slate-300 border-white/10">
                  #{kw}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* JSON-LD Schema Tab */}
        <TabsContent value="schema" className="space-y-3 pt-3">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={copyJsonLd} className="h-7 text-xs border-white/10">
              {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1.5" /> : <Copy className="h-3 w-3 mr-1.5" />}
              <span>Copy Schema.org</span>
            </Button>
          </div>
          <pre className="rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {JSON.stringify(jsonLdSchema, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
