"""
Product Data Schemas
Defines the input, intermediate, and output data models for the NEXUS-PI pipeline.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from .confidence import ConfidenceVector, ScoredAttribute, ProvenanceRecord


# ============================================================
# INPUT MODELS
# ============================================================

class ProductInput(BaseModel):
    """Minimal input required to begin product enrichment."""
    part_number: str = Field(..., description="Manufacturer part number / MPN")
    brand: str = Field(..., description="Brand or manufacturer name")
    description: str = Field(default="", description="Short product description (optional)")
    additional_context: Optional[str] = Field(
        default=None,
        description="Any extra information provided (URLs, notes, category hints)"
    )


# ============================================================
# INTERMEDIATE MODELS (Agent outputs)
# ============================================================

class DiscoveryResult(BaseModel):
    """Output from the Discovery Agent — raw gathered information."""
    raw_texts: list[str] = Field(default_factory=list, description="Extracted text passages from sources")
    source_urls: list[str] = Field(default_factory=list, description="URLs of discovered sources")
    source_names: list[str] = Field(default_factory=list, description="Names of sources")
    image_descriptions: list[str] = Field(default_factory=list, description="Descriptions from VLM image analysis")
    pdf_content: list[str] = Field(default_factory=list, description="Extracted PDF/catalog content")


class TaxonomyClassification(BaseModel):
    """Product taxonomy classification."""
    unspsc_code: Optional[str] = Field(default=None, description="UNSPSC code")
    unspsc_description: Optional[str] = Field(default=None, description="UNSPSC category name")
    eclass_code: Optional[str] = Field(default=None, description="eCl@ss code")
    eclass_description: Optional[str] = Field(default=None, description="eCl@ss category name")
    product_category: str = Field(default="General", description="Human-readable product category")
    confidence: ConfidenceVector = Field(default_factory=ConfidenceVector)


class AnalysisResult(BaseModel):
    """Output from the Analysis Agent — structured attributes extracted."""
    taxonomy: TaxonomyClassification = Field(default_factory=TaxonomyClassification)
    specifications: list[ScoredAttribute] = Field(
        default_factory=list,
        description="Extracted technical specifications with confidence"
    )
    raw_attributes: dict = Field(
        default_factory=dict,
        description="Key-value pairs of all extracted attributes"
    )


class RelatedProduct(BaseModel):
    """A related product identified through enrichment."""
    part_number: str = Field(..., description="Related product part number")
    name: str = Field(..., description="Related product name")
    relationship_type: str = Field(
        ...,
        description="Type of relationship: COMPATIBLE, REPLACEMENT, ACCESSORY, UPSELL"
    )
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)


class CommerceContent(BaseModel):
    """Commerce-ready generated content."""
    long_description: str = Field(default="", description="SEO-optimized long product description")
    features: list[str] = Field(default_factory=list, description="Feature/benefit bullet points")
    seo_meta_title: str = Field(default="", description="SEO meta title tag")
    seo_meta_description: str = Field(default="", description="SEO meta description")
    keywords: list[str] = Field(default_factory=list, description="Search keywords")


class EnrichmentResult(BaseModel):
    """Output from the Enrichment Agent — generated commerce content."""
    commerce_content: CommerceContent = Field(default_factory=CommerceContent)
    related_products: list[RelatedProduct] = Field(default_factory=list)


class QualityReport(BaseModel):
    """Quality assessment from the Validation Agent."""
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    attributes_validated: int = Field(default=0)
    attributes_high_confidence: int = Field(default=0, description="Confidence >= 0.85")
    attributes_medium_confidence: int = Field(default=0, description="0.70 <= Confidence < 0.85")
    attributes_low_confidence: int = Field(default=0, description="Confidence < 0.70")
    human_review_required: bool = Field(default=False)
    flags: list[str] = Field(default_factory=list, description="Validation warnings and flags")
    sources_consulted: int = Field(default=0)
    processing_time_seconds: float = Field(default=0.0)


# ============================================================
# OUTPUT MODEL
# ============================================================

class ProductOutput(BaseModel):
    """
    The complete enriched product intelligence output.
    This is the final deliverable of the NEXUS-PI pipeline.
    """
    product_id: str = Field(default="", description="NEXUS-PI internal product ID")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Original input
    input: ProductInput

    # Taxonomy classification
    taxonomy: TaxonomyClassification = Field(default_factory=TaxonomyClassification)

    # Technical specifications (each with confidence + provenance)
    specifications: list[ScoredAttribute] = Field(default_factory=list)

    # Commerce-ready content
    commerce_content: CommerceContent = Field(default_factory=CommerceContent)

    # Product relationships
    related_products: list[RelatedProduct] = Field(default_factory=list)

    # Quality assessment
    quality_report: QualityReport = Field(default_factory=QualityReport)

    def to_export_dict(self) -> dict:
        """Export as a clean dictionary suitable for JSON/XML export."""
        data = self.model_dump(mode="json")
        # Add computed fields
        specs_dict = {}
        for spec in self.specifications:
            specs_dict[spec.attribute_name] = {
                "value": spec.value,
                "unit": spec.unit,
                "confidence": spec.confidence.to_dict(),
                "sources": [p.source_name for p in spec.provenance],
            }
        data["specifications_map"] = specs_dict
        return data
