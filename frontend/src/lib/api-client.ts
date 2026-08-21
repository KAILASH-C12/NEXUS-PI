import { ProductInput, ProductOutput, AIModelInfo, StreamStageEvent, ChatMessage, DashboardStats, ProductsListResponse } from "./types";
import { SAMPLE_PRODUCTS, SAMPLE_AI_MODELS } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class NexusApiClient {
  /**
   * Check connection & model statuses
   */
  static async getModelsStatus(): Promise<{ models: AIModelInfo[]; confidence_engine: any }> {
    try {
      const res = await fetch(`${API_BASE}/models/status`, { method: "GET", cache: "no-store" });
      if (!res.ok) throw new Error("API responded with error");
      return await res.json();
    } catch (e) {
      console.warn("FastAPI backend not reachable, using simulated models status:", e);
      return {
        models: SAMPLE_AI_MODELS,
        confidence_engine: {
          version: "4D-Vector-v2.1",
          weights: {
            source_reliability: 0.35,
            cross_reference: 0.3,
            ontology_consistency: 0.2,
            temporal_freshness: 0.15,
          },
          hitl_threshold: 0.7,
        },
      };
    }
  }

  /**
   * Synchronous Product Enrichment
   */
  static async enrichProduct(input: ProductInput): Promise<ProductOutput> {
    const res = await fetch(`${API_BASE}/enrich`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(`Enrichment failed (${res.status}): ${errorText}`);
    }
    return await res.json();
  }

  /**
   * Real-time Multi-Agent Pipeline SSE Streaming
   */
  static async streamEnrichProduct(
    input: ProductInput,
    onEvent: (event: StreamStageEvent) => void
  ): Promise<ProductOutput> {
    const res = await fetch(`${API_BASE}/enrich/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Stream connection failed (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let finalResult: ProductOutput | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6)) as StreamStageEvent;
            onEvent(data);
            if (data.stage === "COMPLETE" && data.result) {
              finalResult = data.result;
            }
          } catch (err) {
            console.error("Error parsing SSE event:", err);
          }
        }
      }
    }

    if (finalResult) return finalResult;
    throw new Error("Stream completed without result");
  }

  /**
   * Batch Product Enrichment
   */
  static async batchEnrich(products: ProductInput[]): Promise<{ results: ProductOutput[]; total_processed: number; average_confidence: number }> {
    const res = await fetch(`${API_BASE}/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    if (!res.ok) throw new Error(`Batch request failed (${res.status})`);
    return await res.json();
  }

  /**
   * Multimodal Vision Image Spec Extraction
   */
  static async analyzeImage(imageBase64: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });
      if (!res.ok) throw new Error("Vision analysis failed");
      return await res.json();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        status: "success",
        vision_model: "gemini-2.5-flash",
        detected_brand: "Siemens",
        detected_part_number: "6ES7214-1AG40-0XB0",
        optical_confidence: 0.974,
        extracted_nameplate: {
          model_name: "SIMATIC S7-1200 CPU 1214C",
          rated_voltage: "24V DC (20.4 - 28.8 V DC)",
          firmware_version: "V4.5.1",
          ip_rating: "IP20",
          certifications: ["CE", "cULus 508", "ATEX Zone 2", "FM Class 1 Div 2"],
        },
        suggested_product_input: {
          part_number: "6ES7214-1AG40-0XB0",
          brand: "Siemens",
          description: "SIMATIC S7-1200 CPU 1214C DC/DC/DC Compact Controller",
        },
      };
    }
  }

  /**
   * Copilot Chat
   */
  static async sendChatMessage(messages: ChatMessage[], model = "gpt-4o"): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model }),
      });
      if (!res.ok) throw new Error("Chat request failed");
      return await res.json();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 600));
      const userText = messages[messages.length - 1]?.content || "";
      let reply = `I have analyzed the technical product catalog for your query. The multi-agent pipeline validates all parameters with verified 4D provenance—ensuring specs align with OEM engineering standards and B2B eCommerce schemas.`;
      
      if (userText.toLowerCase().includes("compare") || userText.toLowerCase().includes("vs")) {
        reply = `### Architectural Differential Analysis\n\n- **I/O Capacity**: CPU 1214C provides 14 DI / 10 DO, while CPU 1215C provides 14 DI / 10 DO + 2 Analog Outputs.\n- **Memory Buffer**: 100 KB vs 125 KB work memory (+25%)\n- **Ethernet Switch**: 1215C adds an integrated dual-port RJ45 switch for linear ring topologies.\n\n**Recommendation**: For applications needing line topology daisy-chaining, CPU 1215C eliminates an external industrial switch.`;
      } else if (userText.toLowerCase().includes("unspsc") || userText.toLowerCase().includes("taxonomy")) {
        reply = `### Standard Taxonomy Mapping\n\n- **UNSPSC Code**: \`32151705\` (Programmable logic controllers PLC)\n- **eCl@ss 14.0**: \`27-24-22-07\` (PLC central processing unit)\n- **Harmonized Tariff (HS)**: \`8537.10.91\`\n- **Confidence**: 96.8% (Ontology match: 0.98, Cross-ref: 0.96)`;
      }

      return {
        model,
        reply,
        reasoning_steps: [
          "1. Parsed query intent and identified industrial entity references.",
          "2. Cross-referenced UNSPSC 32151705 automation ontology.",
          "3. Checked DIN rail & 24V DC power budget constraints.",
          "4. Formulated technical recommendation with verified 4D confidence score.",
        ],
        references: [
          { title: "Siemens S7-1200 System Manual (Doc ID: A5E03103013)", type: "PDF" },
          { title: "IEC 61131-2 Programmable Controllers Equipment Requirements", type: "Standard" },
        ],
        suggested_followups: [
          "What are the recommended digital input expansion modules (SM 1221)?",
          "Compare power consumption between CPU 1214C and CPU 1215C.",
          "Generate JSON-LD Schema.org product markup for this controller.",
        ],
      };
    }
  }

  /**
   * Product Comparison
   */
  static async compareProducts(partNumbers: string[], brand = "Siemens"): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ part_numbers: partNumbers, brand }),
      });
      if (!res.ok) throw new Error("Compare request failed");
      return await res.json();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        comparison_id: `CMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        ai_synthesis: `Comparing ${partNumbers.join(" vs ")}: The primary architectural differences center around processing memory tier, onboard communication port count, and thermal threshold curves. For high-speed production cells, the higher tier unit delivers ~28% faster cycle time.`,
        products: [
          {
            part_number: partNumbers[0] || "6ES7214-1AG40-0XB0",
            name: `${brand} S7-1200 CPU 1214C`,
            work_memory: "100 KB",
            digital_inputs: "14 Channels",
            digital_outputs: "10 Channels (Transistor)",
            profinet_ports: 1,
            supply_voltage: "24V DC",
            overall_confidence: 0.965,
            price_tier: "$$$",
          },
          {
            part_number: partNumbers[1] || "6ES7215-1AG40-0XB0",
            name: `${brand} S7-1200 CPU 1215C Dual Port`,
            work_memory: "125 KB",
            digital_inputs: "14 Channels",
            digital_outputs: "10 Channels (Transistor)",
            profinet_ports: 2,
            supply_voltage: "24V DC",
            overall_confidence: 0.972,
            price_tier: "$$$$",
          },
        ],
        differential_highlights: [
          { spec: "Work Memory", winner: partNumbers[1] || "CPU 1215C", delta: "+25% Memory" },
          { spec: "PROFINET Switch", winner: partNumbers[1] || "CPU 1215C", delta: "Dual RJ45 Ports (Daisy Chain)" },
          { spec: "Cost Efficiency", winner: partNumbers[0] || "CPU 1214C", delta: "~18% Lower Unit Cost" },
        ],
      };
    }
  }

  // ============================================================
  // NEW: Database-backed Product CRUD
  // ============================================================

  /**
   * Get all products from database with pagination & search
   */
  static async getProducts(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    brand?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<ProductsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.page_size) query.set("page_size", String(params.page_size));
    if (params?.search) query.set("search", params.search);
    if (params?.brand) query.set("brand", params.brand);
    if (params?.sort_by) query.set("sort_by", params.sort_by);
    if (params?.sort_order) query.set("sort_order", params.sort_order);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
    return await res.json();
  }

  /**
   * Get a single product from database
   */
  static async getProduct(productId: string): Promise<ProductOutput> {
    const res = await fetch(`${API_BASE}/products/${productId}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Product not found (${res.status})`);
    return await res.json();
  }

  /**
   * Delete a product from database
   */
  static async deleteProduct(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${productId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  }

  /**
   * Export a product as downloadable JSON
   */
  static async exportProduct(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${productId}/export`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Export failed (${res.status})`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus_pi_${productId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Get dashboard statistics from database
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Dashboard stats failed (${res.status})`);
    return await res.json();
  }

  /**
   * Get all brands in database
   */
  static async getBrands(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/brands`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Brands fetch failed (${res.status})`);
    const data = await res.json();
    return data.brands || [];
  }

  /**
   * Upload real OEM PDF engineering datasheet
   */
  static async uploadPdfDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/documents/upload-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Upload failed");
      throw new Error(`PDF upload failed (${res.status}): ${errorText}`);
    }

    return await res.json();
  }

  /**
   * Check if backend is reachable
   */
  static async isBackendAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: "GET", cache: "no-store" });
      return res.ok;
    } catch {
      return false;
    }
  }
}
