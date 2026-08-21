# NEXUS-PI: AI-Powered Industrial Product Intelligence & Multimodal Swarm

> **Next-generation EXplainable Unified System for Industrial Product Intelligence**

Transform raw part numbers, unstructured datasheets, and physical nameplate images into verified, structured, commerce-ready product intelligence backed by **4-Dimensional Confidence Vectors**, **3D Digital Twin Physics**, and **Cross-Vendor Pinout Bridges**.

---

## 🏗️ State-of-the-Art Python AI Engineering Stack

NEXUS-PI is engineered on the modern AI production stack:

| Layer | Technology | Role & Capability |
| :--- | :--- | :--- |
| **Structured Outputs** | **Pydantic AI & DSPy** | Strict mathematical schema enforcement & typed object generation |
| **Model Gateway** | **OpenRouter** | Single unified API key for GPT-4o, Claude 3.7, DeepSeek-R1, LLaMA-3.3, and Qwen |
| **Load Balancer** | **LiteLLM Router** | Automatic fallback tiers, TPM/RPM rate-limiting, and shuffle load-balancing |
| **Web Discovery** | **Tavily AI Search & SerpAPI** | Deep programmatic web research with live OEM source URL attribution |
| **Document Ingestion** | **Docling (MIT)** | Deep hierarchical PDF chunking, table extraction, and formula parsing |
| **Vector Database** | **Qdrant** | Hybrid dense vector (1024-dim) + sparse BM25 semantic retrieval |
| **Open-Source AI** | **Hugging Face & PyTorch** | `BAAI/bge-large-en-v1.5` embeddings & `DeepSeek-R1` reasoning proofs |
| **Observability** | **Pydantic Logfire** | Structured LLM tracing, token cost accounting, and latency telemetry |
| **Backend API** | **FastAPI + Uvicorn** | Asynchronous streaming SSE endpoints & Pydantic v2 validation |
| **Frontend UI** | **Next.js 15 + Tailwind CSS v4** | Interactive WebGL/Canvas 3D physics shaders, glassmorphism, Framer Motion |

---

## ⚡ Flagship AI Features

1. **3D AI Digital Twin & Multi-Physics Stress Simulator (`/digital-twin`)**:
   - Real-time FEM thermal heatmaps on MCU core, buck regulator, and isolated optocouplers.
   - Arrhenius actuarial failure rate calculations ($\lambda(t)$) and dynamic MTBF degradation curves.
   - Interactive terminal pin voltage probing (`DI.0`, `DI.1`, `DO.0`, `PROFINET`) with live oscillograms.

2. **Cross-Vendor Semantic Replacement & Pinout Bridge (`/cross-vendor`)**:
   - Vector similarity & ontology matcher resolving obsolete/discontinued PLCs (Rockwell AB, Schneider, Omron $\rightarrow$ Siemens).
   - Interactive physical terminal screw wiring bridges with safety alerts.
   - Automated SCL / Ladder Logic code transpilation for TIA Portal.

3. **Autonomous Industrial BOM & RFP Bulk Optimizer (`/bom-optimizer`)**:
   - Multi-agent swarm parsing unstructured factory procurement spreadsheets.
   - Automatic obsolescence mapping, counterfeit risk alerts, and bulk volume discount optimization.

4. **EU Digital Product Passport (DPP) & ESG Generator (`/dpp-passports`)**:
   - Official ESPR 2026 EU mandate compliant passports with dynamic QR codes.
   - Cradle-to-gate LCA carbon footprint ($\text{kg CO}_2\text{e}$), circularity score ($91.0\%$), and SHA-256 provenance hashes.

5. **Mobile-Ready Live Camera Shoot (Gemini 2.5 Flash Vision OCR)**:
   - Live camera viewfinder with HUD optical bounding target and rear/front camera switcher.
   - 1-click snapshot extraction for industrial nameplates, QR codes, and electrical ratings.

---

## 🚀 Quickstart Guide

### 1. Backend (FastAPI Server)

```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run FastAPI Server on port 8000
uvicorn nexus_pi.api.main:app --reload --port 8000
```
👉 Interactive Swagger Docs: **`http://localhost:8000/docs`**

### 2. Frontend (Next.js 15)

```powershell
cd frontend

# Start development server on port 3000
npm run dev
```
👉 Web Application: **`http://localhost:3000`**

---

## 🧭 Platform Routes

| Route | View | Description |
|---|---|---|
| `/` | **Guided Industrial Hubs** | Role-based navigation for Plant Maintenance, Sourcing, eCommerce, and AI Architects. |
| `/digital-twin` | **3D Digital Twin** | Real-time FEM thermal heatmaps, Arrhenius degradation, and live signal probing. |
| `/cross-vendor` | **Cross-Vendor Bridge** | Drop-in replacement finder with interactive terminal screw wiring bridges. |
| `/bom-optimizer` | **BOM Swarm Optimizer** | Unstructured requisition parser with volume discount calculations. |
| `/dpp-passports` | **EU DPP Passports** | ESPR 2026 compliant Digital Product Passports with dynamic QR codes. |
| `/ai-mesh` | **5-Model AI Mesh** | Multi-model benchmark for GPT-4o, Gemini 2.5, Claude 3.7, Whisper, DALL-E, and HuggingFace. |
| `/agent-lab` | **Agent Laboratory** | Isolated unit test sandboxes for Discovery, Analysis, Compliance, Lifecycle, and Validation. |
| `/dashboard` | **Command Center** | Live telemetry, 4D confidence radar, score distribution histogram, and recent SKUs. |
| `/enrich` | **Enrichment Studio** | Multimodal inputs (Text, Whisper Voice, Gemini Vision OCR) and live SSE progress. |
| `/batch` | **Batch Processing** | CSV upload & queue processor with concurrent progress meters. |
| `/compare` | **Differential Matrix** | Side-by-side spec comparison of 2-4 industrial SKUs with AI delta summary. |
| `/chat` | **Copilot Studio** | Multi-model chat interface with transparent ontology reasoning traces. |
| `/settings` | **Model Orchestration** | OpenRouter, Tavily, LiteLLM router proxy, and 4D weight calibration. |