"""
Lifecycle & Obsolescence Agent (Agent 5 of NEXUS-PI)
Predicts commercial lifecycle phases, obsolescence risk, Mean Time Between Failures (MTBF),
and recommends direct drop-in replacement successors.

Uses LLM to analyze product lifecycle status based on brand, part number, and market knowledge.
Falls back to deterministic defaults when no API key is available.
"""

import json
import logging
from typing import List, Optional
from pydantic import BaseModel, Field

from .llm_router import LLMRouter

logger = logging.getLogger(__name__)


LIFECYCLE_SYSTEM_PROMPT = """You are the Lifecycle & Obsolescence Agent in the NEXUS-PI industrial product intelligence system.
Analyze an industrial product's lifecycle status, obsolescence risk, and reliability metrics.
Return a JSON object with EXACTLY this structure:
{
  "lifecycle_status": "ACTIVE | MATURE | PHASE-OUT | OBSOLETE (with detail)",
  "risk_level": "LOW RISK | MEDIUM RISK | HIGH RISK | CRITICAL",
  "launch_year": 2021,
  "estimated_eol_year": 2034,
  "mtbf_hours": 500000,
  "estimated_availability_weeks": 1.5,
  "counterfeit_risk_score": 0.03,
  "repairability_index": 8.5,
  "recommended_successors": ["Successor 1 description"],
  "aftermarket_availability": "Availability description"
}
Base your assessment on your knowledge of the product, its brand's typical lifecycle, and the industrial automation market.
ONLY output valid JSON — no explanations."""


class LifecycleReport(BaseModel):
    lifecycle_status: str = Field(default="ACTIVE (Full Series Production)")
    risk_level: str = Field(default="LOW RISK")
    launch_year: int = Field(default=2021)
    estimated_eol_year: int = Field(default=2034)
    mtbf_hours: int = Field(default=450000, description="Mean Time Between Failures in operating hours")
    estimated_availability_weeks: float = Field(default=1.5)
    counterfeit_risk_score: float = Field(default=0.03, description="0.0 to 1.0 (Low to High)")
    repairability_index: float = Field(default=8.8, description="0.0 to 10.0")
    recommended_successors: List[str] = Field(default_factory=lambda: ["Direct OEM In-Line Replacement"])
    aftermarket_availability: str = Field(default="High Global Stock (Mouser, RS, DigiKey, Farnell)")


class LifecycleAgent:
    """Agent for autonomous industrial lifecycle, MTBF, and obsolescence risk auditing."""

    def __init__(self):
        pass

    async def evaluate(self, brand: str, part_number: str) -> LifecycleReport:
        logger.info(f"⏳ Lifecycle Agent: Evaluating supply chain risk & MTBF for {brand} {part_number}")

        user_prompt = f"""Analyze the lifecycle status and obsolescence risk for:
- Brand: {brand}
- Part Number: {part_number}

Determine:
1. Current lifecycle status (ACTIVE/MATURE/PHASE-OUT/OBSOLETE)
2. Risk level for procurement
3. Estimated launch year and end-of-life year
4. Mean Time Between Failures (MTBF) in operating hours
5. Estimated lead time in weeks
6. Counterfeit risk score (0.0 to 1.0)
7. Repairability index (0.0 to 10.0)
8. Recommended successor products if any
9. Aftermarket availability assessment"""

        parsed: dict = {}
        try:
            raw_json = await LLMRouter.generate_completion(
                prompt=user_prompt,
                system_prompt=LIFECYCLE_SYSTEM_PROMPT,
                preferred_model="gpt-4o",
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
                logger.info(f"✅ Lifecycle Agent: LLM evaluation completed for {brand} {part_number}")
        except Exception as e:
            logger.warning(f"Lifecycle LLM call error: {e}. Using deterministic fallback.")

        return LifecycleReport(
            lifecycle_status=parsed.get("lifecycle_status", "ACTIVE (Full Series Production)"),
            risk_level=parsed.get("risk_level", "LOW RISK"),
            launch_year=parsed.get("launch_year", 2021),
            estimated_eol_year=parsed.get("estimated_eol_year", 2034),
            mtbf_hours=parsed.get("mtbf_hours", 520000),
            estimated_availability_weeks=parsed.get("estimated_availability_weeks", 1.0),
            counterfeit_risk_score=parsed.get("counterfeit_risk_score", 0.02),
            repairability_index=parsed.get("repairability_index", 9.2),
            recommended_successors=parsed.get("recommended_successors", [
                f"{brand} Next-Gen Advanced Series Controller",
            ]),
            aftermarket_availability=parsed.get("aftermarket_availability", "High OEM & Authorized Distributor Stock"),
        )
