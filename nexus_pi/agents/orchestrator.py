"""
Orchestrator Agent — Autonomous Multi-Agent Swarm Coordinator
Controls the flow of the entire NEXUS-PI agent graph:
  Discovery → Analysis → Enrichment → Compliance/ESG → Lifecycle/MTBF → Validation → Final Intelligence Output
"""

import logging
import time
import uuid
from typing import TypedDict, Optional, Dict, Any, List
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

    async def run(self, product_input: ProductInput) -> ProductOutput:
        start_time = time.time()
        product_id = f"NEXUS-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        logger.info(f"🎛️ Starting NEXUS-PI Agent Swarm for {product_input.brand} {product_input.part_number}")

        # 1. Discovery
        t0 = time.time()
        discovery_result = await self.discovery_agent.discover(product_input)
        d_time = round((time.time() - t0) * 1000, 1)

        # 2. Analysis
        t0 = time.time()
        analysis_result = await self.analysis_agent.analyze(
            discovery_result=discovery_result,
            part_number=product_input.part_number,
            brand=product_input.brand,
        )
        a_time = round((time.time() - t0) * 1000, 1)

        # 3. Enrichment
        t0 = time.time()
        enrichment_result = await self.enrichment_agent.enrich(
            analysis_result=analysis_result,
            part_number=product_input.part_number,
            brand=product_input.brand,
            description=product_input.description,
        )
        e_time = round((time.time() - t0) * 1000, 1)

        # 4. Compliance & ESG Audit
        t0 = time.time()
        compliance_report = await self.compliance_agent.audit(
            brand=product_input.brand,
            part_number=product_input.part_number,
            specs=analysis_result.specifications,
        )
        c_time = round((time.time() - t0) * 1000, 1)

        # 5. Lifecycle & Obsolescence Prediction
        t0 = time.time()
        lifecycle_report = await self.lifecycle_agent.evaluate(
            brand=product_input.brand,
            part_number=product_input.part_number,
        )
        l_time = round((time.time() - t0) * 1000, 1)

        # 6. Validation (LLM-as-Judge 4D Engine)
        t0 = time.time()
        validated_specs, quality_report = await self.validation_agent.validate(
            product_input=product_input,
            analysis_result=analysis_result,
            enrichment_result=enrichment_result,
        )
        v_time = round((time.time() - t0) * 1000, 1)

        total_time = round(time.time() - start_time, 2)
        quality_report.processing_time_seconds = total_time

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

        return output

    async def run_batch(self, products: list[ProductInput]) -> list[ProductOutput]:
        results = []
        for p in products:
            results.append(await self.run(p))
        return results
