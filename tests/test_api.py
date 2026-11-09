"""
NEXUS-PI — API & Route Registration Unit Tests
Verifies FastAPI routing table, registered endpoints, health probes, and telemetry.
"""

import pytest
from nexus_pi.api.main import app


def test_api_metadata():
    """Verify FastAPI application metadata."""
    assert app.title == "NEXUS-PI — Product Intelligence API"
    assert app.version == "2.5.0"
    assert app.docs_url == "/docs"


def test_essential_routes_registered():
    """Verify that all core industrial endpoints are mounted on the FastAPI application."""
    routes = [route.path for route in app.routes]
    
    # 1. Health & Telemetry
    assert "/api/v1/health" in routes
    assert "/api/v1/models/status" in routes
    assert "/metrics" in routes or "/api/v1/metrics" in routes

    # 2. Enrichment & Multi-Agent Swarm
    assert "/api/v1/enrich" in routes
    assert "/api/v1/enrich/stream" in routes

    # 3. Document Ingestion & Batch
    assert "/api/v1/documents/upload-pdf" in routes
    assert "/api/v1/batch" in routes

    # 4. Product Catalog & History
    assert "/api/v1/products" in routes
    assert "/api/v1/dashboard/stats" in routes


def test_total_endpoints_coverage():
    """Verify that the full API suite has registered its routes."""
    routes = [route.path for route in app.routes]
    assert len(routes) >= 15
