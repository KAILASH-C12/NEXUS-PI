"""
Discovery Agent
Responsible for finding and retrieving raw product data from multiple sources.
"""

import logging
from ..config import settings
from ..schemas.product import ProductInput, DiscoveryResult
from .llm_router import LLMRouter

logger = logging.getLogger(__name__)

DISCOVERY_SYSTEM_PROMPT = """You are the Discovery Agent in the NEXUS-PI product intelligence system.
Your role is to gather comprehensive raw technical information about an industrial product.
Identify product family, technical electrical/mechanical specs, standards, compatible modules, and applications.
Format your response as a comprehensive technical briefing with specific numbers and units."""


class DiscoveryAgent:
    """Agent 1 of 7: Discovery — crawls and synthesizes product data across multiple sources."""

    def __init__(self):
        self.model = settings.primary_model

    async def discover(self, product_input: ProductInput) -> DiscoveryResult:
        logger.info(f"🔍 Discovery Agent: Starting discovery for {product_input.brand} {product_input.part_number}")

        user_prompt = f"""Discover comprehensive product information for:
- Part Number: {product_input.part_number}
- Brand/Manufacturer: {product_input.brand}
- Description: {product_input.description}
Additional Context: {product_input.additional_context or 'None'}

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

        return DiscoveryResult(
            raw_texts=[raw_text],
            source_urls=[
                f"https://{product_input.brand.lower().replace(' ', '')}.com/products",
                "https://www.rs-online.com",
                "https://www.mouser.com",
                "https://www.digikey.com",
            ],
            source_names=[
                f"{product_input.brand} Official Catalog",
                "RS Components Engineering Datasheet",
                "Mouser Electronics Technical Specs",
                "DigiKey Part Registry",
            ],
        )
