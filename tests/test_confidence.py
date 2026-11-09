"""
NEXUS-PI — Confidence & Trust Vector Unit Tests
Verifies 4D confidence scores, evidence weighting, and HITL thresholds.
"""

import pytest
from nexus_pi.schemas.confidence import ConfidenceVector, ScoredAttribute, ExtractionMethod, ProvenanceRecord


def test_confidence_vector_calculation():
    """Verify composite 4D score calculation."""
    vector = ConfidenceVector(
        source_reliability=0.90,
        cross_reference=0.85,
        ontology_consistency=0.95,
        temporal_freshness=0.80,
    )
    # Composite score
    composite = vector.overall
    assert 0.0 <= composite <= 1.0
    assert composite >= 0.70  # Should be above default HITL escalation threshold


def test_scored_attribute_with_provenance():
    """Verify that attributes carry source lineage and extraction method."""
    prov = ProvenanceRecord(
        source_name="Siemens Industry Mall Datasheet",
        source_url="https://mall.industry.siemens.com/tedservices/DatasheetService/6ES7214-1AG40-0XB0",
        extraction_method=ExtractionMethod.PDF_PARSE,
        reliability_score=0.95,
    )
    attr = ScoredAttribute(
        attribute_name="operating_temperature_max",
        value="60",
        unit="°C",
        confidence=ConfidenceVector(source_reliability=0.95, cross_reference=0.90),
        provenance=[prov],
    )
    assert attr.value == "60"
    assert attr.unit == "°C"
    assert attr.provenance[0].extraction_method == ExtractionMethod.PDF_PARSE
    assert attr.provenance[0].reliability_score == 0.95

    # Check review threshold logic
    attr.flag_for_review(threshold=0.70)
    assert attr.requires_human_review is False

    # Low confidence vector triggers HITL flag
    low_attr = ScoredAttribute(
        attribute_name="unknown_spec",
        value="unverified",
        confidence=ConfidenceVector(source_reliability=0.2, cross_reference=0.2),
    )
    low_attr.flag_for_review(threshold=0.70)
    assert low_attr.requires_human_review is True
