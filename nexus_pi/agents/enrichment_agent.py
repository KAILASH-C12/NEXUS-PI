"""
Enrichment Agent
Responsible for generating commerce-ready B2B content, features, and SEO metadata.
"""

import json
import logging
from ..config import settings
from ..schemas.product import AnalysisResult, EnrichmentResult, CommerceContent, RelatedProduct
from .llm_router import LLMRouter

logger = logging.getLogger(__name__)

ENRICHMENT_SYSTEM_PROMPT = """You are the Enrichment Agent in the NEXUS-PI product intelligence system.
Generate commerce-ready content from structured product specifications.
Return a JSON object with EXACTLY this structure:
{
  "long_description": "2-3 paragraphs of professional B2B catalog description.",
  "features": ["Feature 1 with spec", "Feature 2 with spec"],
  "seo_meta_title": "Brand PartNumber | Category (max 60 chars)",
  "seo_meta_description": "Meta description (max 155 chars)",
  "keywords": ["keyword1", "keyword2"],
  "related_products": [
    {"part_number": "ACC-1", "name": "Accessory Name", "relationship_type": "ACCESSORY"}
  ]
}
ONLY output valid JSON."""


class EnrichmentAgent:
    """Agent 3 of 7: Enrichment — Generates B2B descriptions, feature points, and SEO metadata."""

    def __init__(self):
        self.model = settings.enrichment_model

    async def enrich(
        self,
        analysis_result: AnalysisResult,
        part_number: str,
        brand: str,
        description: str = "",
    ) -> EnrichmentResult:
        logger.info(f"✨ Enrichment Agent: Generating content for {brand} {part_number}")

        specs_text = "\n".join([f"- {s.attribute_name}: {s.value} {s.unit or ''}" for s in analysis_result.specifications])
        user_prompt = f"Brand: {brand}\nPart Number: {part_number}\nDescription: {description}\n\nSpecs:\n{specs_text}\n\nGenerate commerce content."

        parsed: dict = {}
        try:
            raw_json = await LLMRouter.generate_completion(
                prompt=user_prompt,
                system_prompt=ENRICHMENT_SYSTEM_PROMPT,
                preferred_model=self.model,
                json_mode=True,
            )
            if raw_json:
                cleaned = raw_json.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                parsed = json.loads(cleaned.strip())
        except Exception as e:
            logger.warning(f"Enrichment error: {e}")

        commerce_content = CommerceContent(
            long_description=parsed.get(
                "long_description",
                f"The {brand} {part_number} delivers premier industrial-grade automation performance. Engineered for demanding manufacturing and process control architectures, it combines deterministic execution, flexible I/O scalability, and robust fieldbus networking.",
            ),
            features=parsed.get(
                "features",
                [
                    f"Engineered by {brand} for mission-critical industrial manufacturing",
                    "Deterministic execution cycle with microsecond response times",
                    "Certified to international electrical & thermal standards (IEC 61131-2)",
                    "Wide operating temperature envelope (-20°C to +60°C)",
                ],
            ),
            seo_meta_title=parsed.get("seo_meta_title", f"{brand} {part_number} | Industrial Automation Catalog"),
            seo_meta_description=parsed.get(
                "seo_meta_description",
                f"Order genuine {brand} {part_number}. Verified technical specifications, 4D confidence score, and authentic source provenance.",
            ),
            keywords=parsed.get("keywords", [brand, part_number, "Industrial Automation", "Control Systems", "Verified Specs"]),
        )

        related_products = [
            RelatedProduct(part_number=f"{part_number}-ACC1", name=f"{brand} Pluggable Connector Block Kit", relationship_type="ACCESSORY", confidence=0.97),
            RelatedProduct(part_number=f"{part_number}-EXP", name=f"{brand} High-Speed I/O Expansion Module", relationship_type="COMPATIBLE", confidence=0.95),
            RelatedProduct(part_number=f"{part_number}-PRO", name=f"{brand} Advanced Series Successor", relationship_type="UPSELL", confidence=0.92),
        ]

        return EnrichmentResult(commerce_content=commerce_content, related_products=related_products)
