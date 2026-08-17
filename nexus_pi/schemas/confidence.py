"""
Confidence Scoring Schema
Implements the novel 4-Dimensional Confidence Vector — a core IP differentiator of NEXUS-PI.

Each generated attribute carries:
  1. source_reliability    — Was the source authoritative? (0.0–1.0)
  2. cross_reference       — Do multiple independent sources agree? (0.0–1.0)
  3. ontology_consistency  — Does the value match known product category norms? (0.0–1.0)
  4. temporal_freshness    — How recent is the source data? (0.0–1.0)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ExtractionMethod(str, Enum):
    """How the data was extracted from its source."""
    WEB_SCRAPE = "WEB_SCRAPE"
    PDF_PARSE = "PDF_PARSE"
    VLM_EXTRACTION = "VLM_EXTRACTION"
    API_LOOKUP = "API_LOOKUP"
    KNOWLEDGE_GRAPH = "KNOWLEDGE_GRAPH"
    LLM_INFERENCE = "LLM_INFERENCE"
    MANUAL_INPUT = "MANUAL_INPUT"


class ProvenanceRecord(BaseModel):
    """
    A single source record — traces exactly where an attribute value came from.
    Every claim in the output must have at least one ProvenanceRecord.
    """
    source_name: str = Field(..., description="Human-readable source name")
    source_url: Optional[str] = Field(default=None, description="URL if available")
    extracted_text: Optional[str] = Field(default=None, description="Raw text that was extracted")
    extraction_method: ExtractionMethod = Field(
        default=ExtractionMethod.LLM_INFERENCE,
        description="Method used to extract this data"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="When this data was retrieved"
    )
    reliability_score: float = Field(
        default=0.5,
        ge=0.0, le=1.0,
        description="How reliable is this source (0.0–1.0)"
    )


class ConfidenceVector(BaseModel):
    """
    4-Dimensional Confidence Vector — NEXUS-PI's core differentiator.
    
    Instead of a single confidence number, every attribute carries a vector
    that explains WHY we are confident (or not) in each dimension.
    """
    source_reliability: float = Field(
        default=0.5, ge=0.0, le=1.0,
        description="Weighted reliability of all sources for this attribute"
    )
    cross_reference: float = Field(
        default=0.5, ge=0.0, le=1.0,
        description="Agreement score across multiple independent sources"
    )
    ontology_consistency: float = Field(
        default=0.5, ge=0.0, le=1.0,
        description="How well the value fits known patterns for this product category"
    )
    temporal_freshness: float = Field(
        default=0.5, ge=0.0, le=1.0,
        description="Recency-weighted score of the source data"
    )

    @property
    def overall(self) -> float:
        """
        Weighted composite confidence score.
        Source reliability and cross-reference are weighted higher because
        they are the strongest indicators of factual accuracy.
        """
        weights = {
            "source_reliability": 0.35,
            "cross_reference": 0.30,
            "ontology_consistency": 0.20,
            "temporal_freshness": 0.15,
        }
        return round(
            self.source_reliability * weights["source_reliability"]
            + self.cross_reference * weights["cross_reference"]
            + self.ontology_consistency * weights["ontology_consistency"]
            + self.temporal_freshness * weights["temporal_freshness"],
            4
        )

    def to_dict(self) -> dict:
        """Return the full confidence breakdown including computed overall."""
        return {
            "overall": self.overall,
            "source_reliability": self.source_reliability,
            "cross_reference": self.cross_reference,
            "ontology_consistency": self.ontology_consistency,
            "temporal_freshness": self.temporal_freshness,
        }


class ScoredAttribute(BaseModel):
    """
    A single product attribute with its confidence vector and provenance chain.
    This is the atomic unit of NEXUS-PI's output — every attribute is independently scored.
    """
    attribute_name: str = Field(..., description="Name of the attribute (e.g., 'supply_voltage')")
    value: str = Field(..., description="The attribute value (e.g., '24V DC')")
    unit: Optional[str] = Field(default=None, description="Unit of measurement if applicable")
    confidence: ConfidenceVector = Field(default_factory=ConfidenceVector)
    provenance: list[ProvenanceRecord] = Field(
        default_factory=list,
        description="Ordered list of sources supporting this value"
    )
    requires_human_review: bool = Field(
        default=False,
        description="Flagged for HITL review if confidence is below threshold"
    )

    def flag_for_review(self, threshold: float = 0.70) -> None:
        """Flag this attribute for human review if overall confidence is below threshold."""
        if self.confidence.overall < threshold:
            self.requires_human_review = True
