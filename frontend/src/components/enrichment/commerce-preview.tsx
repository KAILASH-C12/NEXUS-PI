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
    <div className="rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm space-y-4 font-mono text-[#111113]">
      <div className="flex items-center justify-between border-b border-[#d4d4d8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-700 border border-pink-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111113] uppercase">Commerce &amp; SEO Content Generation</h3>
            <p className="text-xs text-slate-600">B2B product descriptions, key selling points, and SEO metadata</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-pink-700 border-pink-300 bg-pink-50 font-bold">
          Ready to Publish
        </Badge>
      </div>

      <Tabs defaultValue="copy" className="w-full">
        <TabsList className="bg-slate-50 border border-[#d4d4d8] p-1 flex gap-1 rounded-xl">
          <TabsTrigger value="copy" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-lg">Product Copy &amp; Features</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-lg">SEO Meta &amp; SERP</TabsTrigger>
          <TabsTrigger value="schema" className="text-xs font-bold data-[state=active]:bg-[#ff5500] data-[state=active]:text-white rounded-lg">JSON-LD Schema</TabsTrigger>
        </TabsList>

        {/* Product Copy Tab */}
        <TabsContent value="copy" className="space-y-4 pt-3">
          <div className="rounded-xl border border-[#d4d4d8] bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Long Description</h4>
            <p className="text-xs text-slate-900 leading-relaxed font-sans font-medium">
              {content.long_description}
            </p>
          </div>

          <div className="rounded-xl border border-[#d4d4d8] bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Key Value Highlights</h4>
            <ul className="space-y-2">
              {content.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-800 font-sans font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* SEO Meta Tab */}
        <TabsContent value="seo" className="space-y-4 pt-3">
          {/* Simulated Google Search Result */}
          <div className="rounded-xl border-2 border-[#d4d4d8] bg-white p-4 space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Google SERP Preview</span>
            <div className="text-[11px] text-emerald-700 font-bold">https://industry-catalog.com &gt; automation &gt; {partNumber}</div>
            <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
              {content.seo_meta_title}
            </h4>
            <p className="text-xs text-slate-700 font-sans leading-normal">
              {content.seo_meta_description}
            </p>
          </div>

          {/* Keywords */}
          <div className="rounded-xl border border-[#d4d4d8] bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Extracted Semantic Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {content.keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-white text-slate-800 border border-[#d4d4d8] font-bold">
                  #{kw}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* JSON-LD Schema Tab */}
        <TabsContent value="schema" className="space-y-3 pt-3">
          <div className="flex justify-end">
            <button
              onClick={copyJsonLd}
              className="h-8 px-3 border border-[#d4d4d8] bg-slate-50 hover:bg-[#ff5500] hover:text-white text-xs font-bold text-slate-800 rounded-lg transition-all flex items-center gap-1"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              <span>Copy Schema.org</span>
            </button>
          </div>
          <pre className="rounded-xl bg-slate-900 border border-slate-700 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
            {JSON.stringify(jsonLdSchema, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
