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

### Cloud & DevOps Infrastructure
- **Containerization:** Multi-stage, non-root Dockerfiles for API and Frontend; `docker-compose` orchestration
- **Infrastructure as Code (IaC):** AWS CloudFormation (820+ lines: VPC, IAM least privilege, ECR, Secrets Manager, CloudWatch) & Terraform comparison
- **CI/CD Pipeline:** Jenkins 7-stage DevSecOps pipeline with Bandit AST scanning, Trivy image vulnerability checks, and production approval gates
- **Observability:** Prometheus scraping native `/metrics` endpoint with 6 SLO alert rules; custom 8-panel Grafana dashboard
- **Automated Testing:** Pytest unit and integration test suite with Pydantic v2 validation and 4D confidence calculations

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Docker & Docker Compose (optional for full container stack)

### 1. Run the Full Stack with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/KAILASH-C12/NEXUS-PI.git
cd NEXUS-PI

# Spin up API, Frontend, Prometheus, and Grafana in one command
docker-compose up --build -d
```

| Service | Port | URL |
|---|---|---|
| **Next.js Frontend** | `3000` | `http://localhost:3000` |
| **FastAPI Backend & Swagger** | `8000` | `http://localhost:8000/docs` |
| **Prometheus Metrics & Alerts** | `9090` | `http://localhost:9090` |
| **Grafana Visual Dashboard** | `3001` | `http://localhost:3001` (login: `admin` / `admin`) |

### 2. Run Local Test Suite

```bash
# Run all unit tests (Pydantic schemas, 4D confidence engine, and API routes)
pytest tests/ -v
```

### 3. Alternative: Run Services Manually

#### Backend:
```bash
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn nexus_pi.api.main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Repository Structure

```
NEXUS-PI/
├── Dockerfile                         # Production multi-stage, non-root backend image
├── .dockerignore                      # Secret and build context exclusion rules
├── docker-compose.yml                 # Multi-service stack (API, Frontend, Prometheus, Grafana)
├── Jenkinsfile                        # 7-stage DevSecOps CI/CD pipeline
├── pytest.ini                         # Pytest configuration
├── requirements.txt                   # Python backend dependencies
├── data/                              # SQLite persistence directory
│
├── frontend/                          # Next.js 16 Frontend
│   ├── Dockerfile                     # Multi-stage standalone Next.js container
│   ├── .dockerignore                  # Node build exclusions
│   ├── next.config.ts                 # Standalone build configuration
│   ├── src/app/                       # 21 App Router Pages
│   └── package.json                   # Frontend dependencies
│
├── nexus_pi/                          # Core Python Backend Package
│   ├── agents/                        # 7-Agent Autonomous Swarm
│   │   ├── discovery_agent.py         # Web search & PDF retrieval
│   │   ├── analysis_agent.py          # Spec extraction & SI normalization
│   │   ├── taxonomy_agent.py          # UNSPSC & eCl@ss classifier
│   │   ├── compliance_agent.py        # RoHS, REACH, CE, UL auditor
│   │   ├── lifecycle_agent.py         # MTBF, carbon footprint, DPP generator
│   │   ├── validation_agent.py        # 4D confidence calculation & Claude judge
│   │   └── orchestrator.py            # Pipeline coordinator & SSE streamer
│   ├── api/
│   │   └── main.py                    # API routes, PDF upload, Prometheus /metrics
│   ├── database.py                    # Async SQLite persistence (WAL mode)
│   ├── config.py                      # System configuration & API key management
│   └── schemas/                       # Pydantic v2 Typed Schemas
│
├── infrastructure/                    # Infrastructure as Code (IaC)
│   ├── cloudformation.yaml            # AWS CloudFormation full stack (VPC, IAM, ECR, EC2, Logs)
│   └── terraform/                     # Terraform comparison module (main.tf, variables.tf)
│
├── monitoring/                        # Observability & Alerting
│   ├── prometheus.yml                 # Prometheus scrape configuration
│   ├── alert-rules.yml                # Production SLO alert rules
│   └── grafana-dashboard.json         # 8-panel visual dashboard model
│
└── tests/                             # Automated Test Suite (All 8 tests passing)
    ├── test_api.py                    # Route registration and health checks
    ├── test_schemas.py                # Pydantic schema validation tests
    └── test_confidence.py             # 4D confidence vector and HITL threshold tests
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.