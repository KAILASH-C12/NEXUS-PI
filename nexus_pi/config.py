"""
NEXUS-PI Configuration Module
Manages all settings via environment variables with Pydantic BaseSettings and automatic sanitization.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import Optional


class NexusSettings(BaseSettings):
    """Central configuration for the NEXUS-PI system."""

    # --- API Keys & Multi-Model Providers ---
    openai_api_key: Optional[str] = Field(default="", description="OpenAI API key")
    openrouter_api_key: Optional[str] = Field(default=None, description="OpenRouter unified API key")
    google_api_key: Optional[str] = Field(default=None, description="Google Gemini API key")
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key")
    tavily_api_key: Optional[str] = Field(default=None, description="Tavily AI Search API key")
    serpapi_api_key: Optional[str] = Field(default=None, description="SerpAPI key for web search")
    logfire_token: Optional[str] = Field(default=None, description="Pydantic Logfire observability token")
    qdrant_url: Optional[str] = Field(default="http://localhost:6333", description="Qdrant Hybrid Vector DB URL")
    qdrant_api_key: Optional[str] = Field(default=None, description="Qdrant Cloud API key")
    litellm_proxy_url: Optional[str] = Field(default=None, description="LiteLLM Router Proxy URL")

    # --- Model Configuration ---
    primary_model: str = Field(default="gpt-4o", description="Primary LLM model (e.g. gpt-4o, openrouter/deepseek/deepseek-r1)")
    analysis_model: str = Field(default="gpt-4o", description="Model for analysis agent")
    enrichment_model: str = Field(default="claude-3-7-sonnet-20250219", description="Model for enrichment agent")
    validation_model: str = Field(default="gpt-4o", description="Model for validation agent")
    routing_strategy: str = Field(default="least_latency", description="LiteLLM routing strategy (least_latency, shuffle, cost)")

    # --- Application Settings ---
    confidence_threshold: float = Field(default=0.70, description="Min confidence before HITL escalation")
    max_search_results: int = Field(default=5, description="Max web search results per query")
    enable_web_search: bool = Field(default=True, description="Enable web search in discovery")
    enable_pydantic_ai: bool = Field(default=True, description="Enforce strict Pydantic AI structured outputs")
    log_level: str = Field(default="INFO", description="Logging level")

    # --- API Settings ---
    api_host: str = Field(default="0.0.0.0", description="API server host")
    api_port: int = Field(default=8000, description="API server port")

    @field_validator("openai_api_key", "google_api_key", "anthropic_api_key", "serpapi_api_key", mode="before")
    @classmethod
    def sanitize_keys(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str):
            cleaned = v.strip().strip('"').strip("'")
            return cleaned
        return v or ""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }


# Singleton settings instance
settings = NexusSettings()
