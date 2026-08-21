# ⚡ NEXUS-PI: Autonomous AI Industrial Product Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Next-generation EXplainable Unified System for Industrial Product Intelligence**  
> Transform raw manufacturer part numbers, messy procurement spreadsheets, and OEM PDF datasheets into verified, structured, commerce-ready engineering dossiers backed by a **7-Agent Autonomous Swarm**, **4-Dimensional Trust Vectors**, **3D Digital Twin Physics**, and **Cross-Vendor Pinout Bridges**.

---

## 🚀 Key Capabilities at a Glance

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NEXUS-PI ARCHITECTURE                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
  [ Multimodal Ingestion ] ────► [ 7-Agent Autonomous Swarm ] ────► [ Verified Intelligence ]
  • Part Number / MPN            1. Discovery (Web & PDF)           • 4D Trust Vector (0-100%)
  • PDF Technical Datasheet      2. Analysis (SI Normalizer)        • eCl@ss & UNSPSC Taxonomy
  • CSV / Excel Batch            3. Taxonomy (UNSPSC/eCl@ss)        • Interactive Pinout Bridge
  • Gemini Vision Nameplate      4. Compliance (RoHS/REACH)         • 3D FEM Thermal Simulation
  • Whisper Voice Dictation      5. Lifecycle (MTBF/Carbon)         • EU Digital Passport (DPP)
                                 6. Validation (Claude Judge)       • SQLite DB & PDF Datasheet
                                 7. Orchestrator (SSE Stream)
```

---

## 🧭 Feature Matrix & Route Directory

| Route | Feature Area | Description |
| :--- | :--- | :--- |
| **`/`** | **Interactive Launchpad** | 1-click test presets (`Siemens`, `Schneider`, `Rockwell`, `ABB`, `Omron`), 3-step action hub, and animated explainer reel. |
| **`/enrich`** | **Enrichment Studio** | Live 7-agent SSE execution stream, optical nameplate OCR, and real-time thought inspector. |
| **`/history`** | **Product History DB** | Persistent SQLite database storing all enriched dossiers with search, filtering, and JSON export. |
| **`/batch`** | **Batch CSV / Excel Pipeline** | Custom CSV/TSV/JSON file uploader with auto-column mapping (`part_number`, `brand`), concurrent processing, and ERP CSV export. |
| **`/document-rag`** | **Real PDF Vector Ingestion** | Drag-and-drop OEM PDF datasheets parsed via `pypdf`, chunked with semantic similarity scoring and entity extraction. |
| **`/results/[id]`** | **Product Intelligence Dossier** | Comprehensive engineering dossier with 4D trust radar, spec table, pinout terminal, ESG carbon, and 1-click printable PDF datasheet. |
| **`/cross-vendor`** | **Cross-Vendor Pinout Bridge** | Discontinued/obsolete hardware replacement engine with physical terminal screw wiring maps and SCL ladder logic transpilation. |
| **`/digital-twin`** | **3D AI Digital Twin** | Real-time FEM thermal heatmaps, Arrhenius degradation ($\lambda(t)$), MTBF failure curves, and live signal probing. |
| **`/bom-optimizer`** | **BOM Swarm Optimizer** | Unstructured procurement spreadsheet parser with counterfeit detection and volume price cluster optimization. |
| **`/dpp-passports`** | **EU DPP Passports** | EU ESPR 2026 compliant Digital Product Passports with QR codes, circularity index ($91\%$), and LCA carbon footprints. |
| **`/compare`** | **Differential Matrix** | Side-by-side spec comparison of 2–4 industrial SKUs with AI architectural delta verdicts. |
| **`/chat`** | **Engineering Copilot** | Multi-model industrial Copilot for cross-referencing datasheets, pinouts, and taxonomy codes. |
| **`/dashboard`** | **Command Center** | Live platform analytics, 4D confidence radar, and brand distribution charts. |
| **`/ai-mesh`** | **5-Model AI Mesh** | Multi-model benchmark suite (GPT-4o, Claude 3.7, DeepSeek-R1, Gemini 2.5, LLaMA-3.3). |
| **`/agent-lab`** | **Agent Laboratory** | Isolated sandbox to test individual agents (Discovery, Analysis, Compliance, Lifecycle, Validation). |
| **`/hitl-queue`** | **HITL Review Queue** | Human-in-the-Loop review queue for confidence threshold anomalies and discrepancy overrides. |
| **`/business-case`** | **ROI Simulator** | Interactive financial calculator demonstrating annual savings ($184,000+) across catalog teams. |
| **`/settings`** | **Model Settings** | LLM API configuration, provider fallback chains, and 4D confidence weight sliders. |

---

## 🛠️ Technology Stack

### Backend Engine
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) with asynchronous SSE (`StreamingResponse`)
- **Persistence:** SQLite 3 with WAL mode (`nexus_pi/database.py`)
- **Document Extraction:** `pypdf` for technical datasheet parsing and table extraction
- **Live Search:** `httpx` async web scraper & SerpAPI / Tavily integration
- **AI Orchestration:** Multi-provider router (`OpenRouter`, `LiteLLM`, `OpenAI`, `Anthropic`, `Google Gemini`)
- **Validation:** Pydantic v2 typed schema enforcement

### Frontend Application
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack, SSR/SSG)
- **Styling:** Tailwind CSS with high-contrast industrial theme
- **Animations:** Framer Motion & WebGL Canvas 3D physics shaders
- **State Management:** Zustand with local & session persistence
- **Responsiveness:** Full mobile layout with slide-over drawer navigation

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/KAILASH-C12/NEXUS-PI.git
cd NEXUS-PI

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn nexus_pi.api.main:app --reload --port 8000
```
- **Backend API:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
- **Web Application:** `http://localhost:3000`

---

## 📁 Repository Structure

```
NEXUS-PI/
├── data/                      # SQLite persistence directory
├── nexus_pi/                  # Core Python Backend Package
│   ├── agents/                # 7-Agent Autonomous Swarm
│   │   ├── discovery_agent.py # Web search & PDF retrieval
│   │   ├── analysis_agent.py  # Spec extraction & SI normalization
│   │   ├── taxonomy_agent.py  # UNSPSC & eCl@ss classifier
│   │   ├── compliance_agent.py# RoHS, REACH, CE, UL auditor
│   │   ├── lifecycle_agent.py # MTBF, carbon footprint, DPP generator
│   │   ├── validation_agent.py# 4D confidence calculation & Claude judge
│   │   └── orchestrator.py    # Pipeline coordinator & SSE streamer
│   ├── api/                   # FastAPI Endpoints & WebSocket Routes
│   │   └── main.py            # API routes, PDF upload, Batch execution
│   ├── database.py            # SQLite database schema & queries
│   └── config.py              # System configuration & API keys
├── frontend/                  # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/               # 21 App Router Pages
│   │   ├── components/        # UI Components (RAG, DPP, Digital Twin, etc.)
│   │   ├── lib/               # API Client, Types, and Mock Fallbacks
│   │   └── stores/            # Zustand State Stores
│   └── package.json           # Frontend dependencies
└── requirements.txt           # Python backend dependencies
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.