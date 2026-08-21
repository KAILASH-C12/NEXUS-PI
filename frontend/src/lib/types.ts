export type ExtractionMethod =
  | "WEB_SCRAPE"
  | "PDF_PARSE"
  | "VLM_EXTRACTION"
  | "API_LOOKUP"
  | "KNOWLEDGE_GRAPH"
  | "LLM_INFERENCE"
  | "MANUAL_INPUT";

export interface ProvenanceRecord {
  source_name: string;
  source_url?: string;
  extracted_text?: string;
  raw_snippet?: string;
  extraction_method: ExtractionMethod;
  timestamp: string;
  reliability_score: number;
}

export interface ConfidenceVector {
  overall?: number;
  source_reliability: number;
  cross_reference: number;
  ontology_consistency: number;
  temporal_freshness: number;
}

export interface ScoredAttribute {
  attribute_name: string;
  value: string;
  unit?: string | null;
  confidence: ConfidenceVector;
  provenance: ProvenanceRecord[];
  requires_human_review?: boolean;
}

export interface TaxonomyClassification {
  unspsc_code?: string | null;
  unspsc_description?: string | null;
  eclass_code?: string | null;
  eclass_description?: string | null;
  product_category: string;
  confidence?: ConfidenceVector;
}

export interface RelatedProduct {
  part_number: string;
  name: string;
  relationship_type: "COMPATIBLE" | "REPLACEMENT" | "ACCESSORY" | "UPSELL";
  confidence: number;
}

export interface CommerceContent {
  long_description: string;
  features: string[];
  seo_meta_title: string;
  seo_meta_description: string;
  keywords: string[];
}

export interface QualityReport {
  overall_confidence: number;
  attributes_validated: number;
  attributes_high_confidence: number;
  attributes_medium_confidence: number;
  attributes_low_confidence: number;
  human_review_required: boolean;
  flags: string[];
  sources_consulted: number;
  processing_time_seconds: number;
}

export interface ProductInput {
  part_number: string;
  brand: string;
  description?: string;
  additional_context?: string | null;
  target_model?: string;
}

export interface ProductOutput {
  product_id: string;
  timestamp: string;
  input: ProductInput;
  taxonomy: TaxonomyClassification;
  specifications: ScoredAttribute[];
  commerce_content: CommerceContent;
  related_products: RelatedProduct[];
  quality_report: QualityReport;
  specifications_map?: Record<string, any>;
}

export interface AIModelInfo {
  id: string;
  name: string;
  provider: string;
  role: string;
  status: "online" | "simulated" | "offline";
  latency_ms: number;
  success_rate?: number;
  context_window: string;
  capabilities: string[];
}

export interface StreamStageEvent {
  stage: "INIT" | "DISCOVERY" | "ANALYSIS" | "ENRICHMENT" | "VALIDATION" | "COMPLETE" | "ERROR";
  progress: number;
  agent?: string;
  message: string;
  sources_found?: number;
  specs_count?: number;
  features_generated?: number;
  overall_confidence?: number;
  product_id?: string;
  result?: ProductOutput;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  model?: string;
  reasoning_steps?: string[];
  references?: Array<{ title: string; type: string; url?: string }>;
  suggested_followups?: string[];
}

export interface DashboardStats {
  total_products: number;
  average_confidence: number;
  review_required_count: number;
  average_processing_time: number;
  total_processing_time: number;
  brand_distribution: Array<{ brand: string; count: number }>;
  confidence_distribution: { high: number; medium: number; low: number };
  recent_enrichments: Array<{
    product_id: string;
    part_number: string;
    brand: string;
    description: string;
    overall_confidence: number;
    processing_time_seconds: number;
    created_at: string;
  }>;
}

export interface ProductsListResponse {
  products: ProductOutput[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
