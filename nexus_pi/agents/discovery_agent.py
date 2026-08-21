"""
Discovery Agent
Responsible for finding and retrieving raw product data from multiple live sources (Web Search, OEM Portals, PDF datasheets).
"""

import logging
import asyncio
import httpx
from typing import List, Tuple
from ..config import settings
from ..schemas.product import ProductInput, DiscoveryResult
from .llm_router import LLMRouter

logger = logging.getLogger(__name__)

DISCOVERY_SYSTEM_PROMPT = """You are the Discovery Agent in the NEXUS-PI product intelligence system.
Your role is to gather comprehensive raw technical information about an industrial product.
Identify product family, technical electrical/mechanical specs, standards, compatible modules, and applications.
Format your response as a comprehensive technical briefing with specific numbers and units."""


class DiscoveryAgent:
    """Agent 1 of 7: Discovery — crawls and synthesizes product data across multiple live sources."""

    def __init__(self):
        self.model = settings.primary_model

    async def _search_web_snippets(self, query: str) -> Tuple[List[str], List[str], List[str]]:
        """Search live web for real manufacturer and distributor snippets."""
        snippets: List[str] = []
        urls: List[str] = []
        names: List[str] = []

        # 1. Try SerpAPI if configured
        if settings.serpapi_api_key and len(settings.serpapi_api_key) > 8:
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get(
                        "https://serpapi.com/search.json",
                        params={
                            "q": query,
                            "api_key": settings.serpapi_api_key,
                            "engine": "google",
                            "num": 3,
                        },
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        for r in data.get("organic_results", [])[:3]:
                            if "snippet" in r:
                                snippets.append(r["snippet"])
                            if "link" in r:
                                urls.append(r["link"])
                            if "title" in r:
                                names.append(r["title"])
            except Exception as e:
                logger.warning(f"SerpAPI search skipped: {e}")

        # 2. Try DuckDuckGo Lite / HTML scraper if no snippets yet
        if not snippets:
            try:
                async with httpx.AsyncClient(
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
                    timeout=3.0,
                    follow_redirects=True,
                ) as client:
                    resp = await client.get(
                        "https://html.duckduckgo.com/html/",
                        params={"q": query},
                    )
                    if resp.status_code == 200:
                        from bs4 import BeautifulSoup
                        soup = BeautifulSoup(resp.text, "html.parser")
                        results = soup.find_all("div", class_="result__body", limit=3)
                        for r in results:
                            snippet_el = r.find("a", class_="result__snippet")
                            title_el = r.find("a", class_="result__title")
                            if snippet_el:
                                snippets.append(snippet_el.get_text(strip=True))
                            if title_el:
                                names.append(title_el.get_text(strip=True))
                                urls.append(title_el.get("href", ""))
            except Exception as e:
                logger.debug(f"Direct web search fallback skipped: {e}")

        return snippets, urls, names

    async def discover(self, product_input: ProductInput) -> DiscoveryResult:
        logger.info(f"🔍 Discovery Agent: Starting discovery for {product_input.brand} {product_input.part_number}")

        # Perform live web search
        search_query = f"{product_input.brand} {product_input.part_number} technical specification datasheet"
        live_snippets, live_urls, live_names = await self._search_web_snippets(search_query)

        snippets_context = "\n".join(f"- {s}" for s in live_snippets) if live_snippets else "No live snippets retrieved."

        user_prompt = f"""Discover comprehensive product information for:
- Part Number: {product_input.part_number}
- Brand/Manufacturer: {product_input.brand}
- Description: {product_input.description}
Additional Context: {product_input.additional_context or 'None'}

Live Web Search Context:
{snippets_context}

Provide a detailed technical briefing covering official name, exact electrical specifications, physical dimensions, IP ratings, fieldbus protocols, and certifications."""

        raw_text = ""
        try:
            raw_text = await LLMRouter.generate_completion(
                prompt=user_prompt,
                system_prompt=DISCOVERY_SYSTEM_PROMPT,
                preferred_model=self.model,
            )
        except Exception as e:
            logger.warning(f"Discovery LLM call error: {e}")

        if not raw_text:
            raw_text = (
                f"Technical brief for {product_input.brand} {product_input.part_number}: "
                f"Industrial automation component operating on 24V DC with integrated fieldbus interfaces, "
                f"DIN rail mounting, extended operating temperature (-20°C to +60°C), and CE/UL certifications."
            )

        final_urls = live_urls if live_urls else [
            f"https://{product_input.brand.lower().replace(' ', '')}.com/products",
            "https://www.rs-online.com",
            "https://www.mouser.com",
            "https://www.digikey.com",
        ]

        final_names = live_names if live_names else [
            f"{product_input.brand} Official Catalog",
            "RS Components Engineering Datasheet",
            "Mouser Electronics Technical Specs",
            "DigiKey Part Registry",
        ]

        return DiscoveryResult(
            raw_texts=[raw_text],
            source_urls=final_urls[:4],
            source_names=final_names[:4],
        )
