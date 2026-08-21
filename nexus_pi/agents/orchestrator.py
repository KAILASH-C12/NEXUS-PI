"""
Orchestrator Agent — Autonomous Multi-Agent Swarm Coordinator
Controls the flow of the entire NEXUS-PI agent graph:
  Discovery → Analysis → Enrichment → Compliance/ESG → Lifecycle/MTBF → Validation → Final Intelligence Output

Supports real-time progress callbacks for SSE streaming and auto-saves to SQLite.
"""

import logging
import time
import uuid
from typing import TypedDict, Optional, Dict, Any, List, Callable, Awaitable
from datetime import datetime

from ..schemas.product import (
    ProductInput,
    ProductOutput,
    DiscoveryResult,
    AnalysisResult,
    EnrichmentResult,
    QualityReport,
)
from ..schemas.confidence import ScoredAttribute
from .discovery_agent import DiscoveryAgent
from .analysis_agent import AnalysisAgent
from .enrichment_agent import EnrichmentAgent
from .validation_agent import ValidationAgent
from .compliance_agent import ComplianceAgent, ComplianceReport
from .lifecycle_agent import LifecycleAgent, LifecycleReport

logger = logging.getLogger(__name__)

# Type for progress callback: (stage, progress%, message, extra_data)
ProgressCallback = Callable[[str, int, str, Dict[str, Any]], Awaitable[None]]


class AgentExecutionStep(TypedDict):
    agent_name: str
    stage: str
    status: str
    duration_ms: float
    tool_calls: List[Dict[str, Any]]
    output_summary: str


class Orchestrator:
    """
    LangGraph-inspired State Coordinator that orchestrates the 7-agent swarm:
      1. Discovery Agent (Gemini 2.5 Flash / Web Crawlers)
      2. Analysis Agent (GPT-4o Entity & SI Unit Normalizer)
      3. Enrichment Agent (Claude 3.7 B2B Commerce Copywriter)
      4. Compliance & ESG Agent (RoHS / REACH / CE / Carbon Auditor)
      5. Lifecycle & Obsolescence Agent (MTBF & Successor Predictor)
      6. Validation Agent (LLM-as-Judge 4D Confidence Auditor)
      7. Orchestrator State Manager
    """

    def __init__(self):
        self.discovery_agent = DiscoveryAgent()
        self.analysis_agent = AnalysisAgent()
        self.enrichment_agent = EnrichmentAgent()
        self.validation_agent = ValidationAgent()
        self.compliance_agent = ComplianceAgent()
        self.lifecycle_agent = LifecycleAgent()

    async def run(
        self,
        product_input: ProductInput,
        progress_callback: Optional[ProgressCallback] = None,
    ) -> ProductOutput:
        start_time = time.time()
        product_id = f"NEXUS-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        logger.info(f"🎛️ Starting NEXUS-PI Agent Swarm for {product_input.brand} {product_input.part_number}")

        # Notify: INIT
        if progress_callback:
            await progress_callback("INIT", 5, f"Initializing Multi-Agent Pipeline for {product_input.brand} {product_input.part_number}", {"product_id": product_id})

        # 1. Discovery
        t0 = time.time()
        if progress_callback:
            await progress_callback("DISCOVERY", 10, f"Discovery Agent crawling OEM data for {product_input.part_number}...", {"agent": "Discovery Agent (Gemini 2.5 / SerpAPI)"})
        discovery_result = await self.discovery_agent.discover(product_input)
        d_time = round((time.time() - t0) * 1000, 1)
        if progress_callback:
            await progress_callback("DISCOVERY", 25, f"Discovery complete — found {len(discovery_result.source_urls)} sources in {d_time}ms", {"sources_found": len(discovery_result.source_urls), "duration_ms": d_time})

        # 2. Analysis
        t0 = time.time()
        if progress_callback:
            await progress_callback("ANALYSIS", 30, "Analysis Agent parsing specs, standardizing SI units, classifying taxonomies...", {"agent": "Analysis Agent (GPT-4o)"})
        analysis_result = await self.analysis_agent.analyze(
            discovery_result=discovery_result,
            part_number=product_input.part_number,
            brand=product_input.brand,
        )
        a_time = round((time.time() - t0) * 1000, 1)
        if progress_callback:
            await progress_callback("ANALYSIS", 45, f"Analysis complete — extracted {len(analysis_result.specifications)} specifications in {a_time}ms", {"specs_count": len(analysis_result.specifications), "duration_ms": a_time})

        # 3. Enrichment
        t0 = time.time()
        if progress_callback:
            await progress_callback("ENRICHMENT", 50, "Enrichment Agent generating SEO descriptions, features, and commerce content...", {"agent": "Enrichment Agent (Claude 3.7)"})
        enrichment_result = await self.enrichment_agent.enrich(
            analysis_result=analysis_result,
            part_number=product_input.part_number,
            brand=product_input.brand,
            description=product_input.description,
        )
        e_time = round((time.time() - t0) * 1000, 1)
        if progress_callback:
            await progress_callback("ENRICHMENT", 65, f"Enrichment complete — generated {len(enrichment_result.commerce_content.features)} features in {e_time}ms", {"features_generated": len(enrichment_result.commerce_content.features), "duration_ms": e_time})

        # 4. Compliance & ESG Audit
        t0 = time.time()
        if progress_callback:
            await progress_callback("COMPLIANCE", 70, "Compliance Agent auditing RoHS/REACH/CE/UL certifications...", {"agent": "Compliance Agent (ESG Auditor)"})
        compliance_report = await self.compliance_agent.audit(
            brand=product_input.brand,
            part_number=product_input.part_number,
            specs=analysis_result.specifications,
        )
        c_time = round((time.time() - t0) * 1000, 1)
        if progress_callback:
            await progress_callback("COMPLIANCE", 78, f"Compliance audit complete — score: {compliance_report.compliance_score} in {c_time}ms", {"compliance_score": compliance_report.compliance_score, "duration_ms": c_time})

        # 5. Lifecycle & Obsolescence Prediction
        t0 = time.time()
        if progress_callback:
            await progress_callback("LIFECYCLE", 82, "Lifecycle Agent evaluating obsolescence risk and MTBF...", {"agent": "Lifecycle Agent (MTBF Predictor)"})
        lifecycle_report = await self.lifecycle_agent.evaluate(
            brand=product_input.brand,
            part_number=product_input.part_number,
        )
        l_time = round((time.time() - t0) * 1000, 1)
        if progress_callback:
            await progress_callback("LIFECYCLE", 88, f"Lifecycle evaluation complete — status: {lifecycle_report.lifecycle_status} in {l_time}ms", {"lifecycle_status": lifecycle_report.lifecycle_status, "duration_ms": l_time})

        # 6. Validation (LLM-as-Judge 4D Engine)
        t0 = time.time()
        if progress_callback:
            await progress_callback("VALIDATION", 90, "Validation Agent executing 4D confidence scoring and anomaly detection...", {"agent": "Validation Agent (LLM-as-Judge)"})
        validated_specs, quality_report = await self.validation_agent.validate(
            product_input=product_input,
            analysis_result=analysis_result,
            enrichment_result=enrichment_result,
        )
        v_time = round((time.time() - t0) * 1000, 1)

        total_time = round(time.time() - start_time, 2)
        quality_report.processing_time_seconds = total_time

        if progress_callback:
            await progress_callback("VALIDATION", 95, f"Validation complete — overall confidence: {quality_report.overall_confidence:.3f} in {v_time}ms", {"overall_confidence": quality_report.overall_confidence, "duration_ms": v_time})

        output = ProductOutput(
            product_id=product_id,
            timestamp=datetime.utcnow(),
            input=product_input,
            taxonomy=analysis_result.taxonomy,
            specifications=validated_specs,
            commerce_content=enrichment_result.commerce_content,
            related_products=enrichment_result.related_products,
            quality_report=quality_report,
        )

        # Auto-save to SQLite
        try:
            from ..database import save_product
            export_data = output.to_export_dict()
            # Attach compliance and lifecycle data
            export_data["compliance"] = compliance_report.model_dump()
            export_data["lifecycle"] = lifecycle_report.model_dump()
            await save_product(export_data)
            logger.info(f"💾 Product {product_id} auto-saved to database")
        except Exception as e:
            logger.warning(f"Database save error (non-fatal): {e}")

        if progress_callback:
            await progress_callback("COMPLETE", 100, f"Pipeline completed in {total_time}s — {len(validated_specs)} specs validated, {quality_report.attributes_high_confidence} high confidence", {})

        logger.info(f"✅ Pipeline completed for {product_input.brand} {product_input.part_number} in {total_time}s")
        return output

    async def run_batch(self, products: list[ProductInput]) -> list[ProductOutput]:
        results = []
        for p in products:
            results.append(await self.run(p))
        return results
