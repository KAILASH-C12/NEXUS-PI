"""
NEXUS-PI — Schema & Input Validation Unit Tests
Verifies Pydantic v2 schemas, type safety, and product model transformations.
"""

import pytest
from nexus_pi.schemas.product import ProductInput, ProductOutput, TaxonomyClassification, AnalysisResult, CommerceContent
from nexus_pi.schemas.confidence import ConfidenceVector, ScoredAttribute, ExtractionMethod, ProvenanceRecord


def test_product_input_validation():
    """Verify that ProductInput properly accepts MPN and brand."""
    item = ProductInput(
        part_number="6ES7214-1AG40-0XB0",
        brand="Siemens",
        description="SIMATIC S7-1200 CPU 1214C",
    )
    assert item.part_number == "6ES7214-1AG40-0XB0"
    assert item.brand == "Siemens"
    assert "S7-1200" in item.description


def test_taxonomy_classification_defaults():
    """Verify default taxonomy assignment and confidence vector."""
    tax = TaxonomyClassification(
        unspsc_code="32151705",
        unspsc_description="Programmable logic controllers PLCs",
        eclass_code="27-24-22-02",
        product_category="PLC Controller",
        confidence=ConfidenceVector(source_reliability=0.9, cross_reference=0.85),
    )
    assert tax.unspsc_code == "32151705"
    assert tax.confidence.overall >= 0.70


def test_analysis_result_schema():
    """Verify that AnalysisResult stores extracted specifications and attributes."""
    spec = ScoredAttribute(
        attribute_name="supply_voltage",
        value="24V DC",
        unit="V",
        confidence=ConfidenceVector(source_reliability=0.95),
    )
    res = AnalysisResult(
        specifications=[spec],
        raw_attributes={"voltage": "24V DC"},
    )
    assert len(res.specifications) == 1
    assert res.specifications[0].value == "24V DC"
    assert res.raw_attributes["voltage"] == "24V DC"
