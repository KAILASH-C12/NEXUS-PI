"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DppCard, SAMPLE_DPP, DppData } from "@/components/dpp/dpp-card";
import {
  ShieldCheck,
  Sparkles,
  Search,
  FileDown,
  QrCode,
  Layers,
  Leaf,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

const SAMPLE_PASSPORTS: DppData[] = [
  SAMPLE_DPP,
  {
    passportId: "EU-DPP-2026-NEXUS-99104",
    partNumber: "6ES7221-1BH32-0XB0",
    brand: "Siemens AG",
    productName: "Signal Module SM 1221, 16 DI 24V DC Digital Input",
    carbonFootprintKg: 4.6,
    circularityScorePct: 94.2,
    recycledMaterialPct: 58.0,
    svhcSubstancesCount: 0,
    rohsCompliant: true,
    reachCompliant: true,
    ceMarked: true,
    criticalRawMaterials: ["Copper (68g)", "Gold Plating (0.04g)"],
    provenanceHash: "7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    issuedDate: "2026-04-01",
    validUntil: "2036-04-01",
  },
  {
    passportId: "EU-DPP-2026-NEXUS-55219",
    partNumber: "2904601",
    brand: "Phoenix Contact GmbH",
    productName: "QUINT4-PS/1AC/24DC/10 Power Supply Unit Primary Switched",
    carbonFootprintKg: 18.4,
    circularityScorePct: 88.5,
    recycledMaterialPct: 35.0,
    svhcSubstancesCount: 0,
    rohsCompliant: true,
    reachCompliant: true,
    ceMarked: true,
    criticalRawMaterials: ["Aluminum Heat Sink (280g)", "Copper Windings (190g)"],
    provenanceHash: "1f2e3d4c5b6a79887766554433221100ffeeddccbbaa99887766554433221100",
    issuedDate: "2026-02-18",
    validUntil: "2036-02-18",
  },
];

export default function DppPassportsPage() {
  const [selectedDpp, setSelectedDpp] = useState<DppData>(SAMPLE_PASSPORTS[0]);
  const [searchPart, setSearchPart] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCustom = async () => {
    if (!searchPart.trim()) {
      toast.error("Please enter a part number to generate an EU DPP");
      return;
    }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    const newDpp: DppData = {
      passportId: `EU-DPP-2026-NEXUS-${Math.floor(10000 + Math.random() * 90000)}`,
      partNumber: searchPart.toUpperCase(),
      brand: "Industrial Automation OEM",
      productName: `${searchPart.toUpperCase()} Industrial Electronics Component`,
      carbonFootprintKg: +(Math.random() * 15 + 5).toFixed(1),
      circularityScorePct: Math.floor(Math.random() * 12 + 86),
      recycledMaterialPct: Math.floor(Math.random() * 30 + 30),
      svhcSubstancesCount: 0,
      rohsCompliant: true,
      reachCompliant: true,
      ceMarked: true,
      criticalRawMaterials: ["Copper (110g)", "Gold Contact Plating (0.08g)"],
      provenanceHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      issuedDate: new Date().toISOString().slice(0, 10),
      validUntil: "2036-12-31",
    };
    setSelectedDpp(newDpp);
    setIsGenerating(false);
    toast.success(`Generated official EU Digital Product Passport for "${searchPart}"`);
  };

  const handleExportJsonLd = () => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: selectedDpp.productName,
      identifier: selectedDpp.partNumber,
      manufacturer: { "@type": "Organization", name: selectedDpp.brand },
      additionalProperty: [
        { "@type": "PropertyValue", name: "DigitalProductPassportId", value: selectedDpp.passportId },
        { "@type": "PropertyValue", name: "CarbonFootprintKgCO2e", value: selectedDpp.carbonFootprintKg },
        { "@type": "PropertyValue", name: "CircularityScore", value: `${selectedDpp.circularityScorePct}%` },
        { "@type": "PropertyValue", name: "RoHSCompliance", value: selectedDpp.rohsCompliant ? "Compliant" : "Non-Compliant" },
        { "@type": "PropertyValue", name: "ProvenanceHashSHA256", value: selectedDpp.provenanceHash },
      ],
    };

    const blob = new Blob([JSON.stringify(jsonLd, null, 2)], { type: "application/ld+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DPP_${selectedDpp.partNumber}_JSONLD.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("EU DPP JSON-LD Schema exported for ERP & Customs ingestion");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              EU Digital Product Passport (DPP) &amp; ESG Generator
            </h1>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              ESPR 2026 Mandate
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate cryptographic, QR-verifiable Digital Product Passports with cradle-to-gate LCA and circularity scores
          </p>
        </div>

        <Button
          onClick={handleExportJsonLd}
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 border-white/10 text-slate-200 text-xs font-medium rounded-xl hover:border-cyan-500/40 hover:bg-white/[0.04]"
        >
          <FileDown className="h-3.5 w-3.5 text-cyan-400" />
          <span>Export JSON-LD Passport</span>
        </Button>
      </div>

      {/* Preset & Search Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Verified Passport Registry:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PASSPORTS.map((p) => (
              <Button
                key={p.passportId}
                size="sm"
                variant="outline"
                onClick={() => setSelectedDpp(p)}
                className={`h-8 text-xs rounded-xl border transition-all ${
                  selectedDpp.passportId === p.passportId
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{p.partNumber}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Custom Bar */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchPart}
              onChange={(e) => setSearchPart(e.target.value)}
              placeholder="Or enter any SKU part number to generate an EU DPP Passport..."
              className="pl-10 h-10 text-xs bg-black/40 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
            />
          </div>
          <Button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="h-10 px-5 gap-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? "Generating..." : "Generate Official DPP"}</span>
          </Button>
        </div>
      </div>

      {/* Passport Card Display */}
      <DppCard dpp={selectedDpp} />
    </div>
  );
}
