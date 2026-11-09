# ============================================================
# NEXUS-PI — Production Dockerfile
# Multi-stage build · Non-root · Minimal attack surface
# ============================================================
#
# Build:  docker build -t nexus-pi .
# Run:    docker run -p 8000:8000 --env-file .env \
#             -v nexus-pi-data:/app/data nexus-pi
#
# IMPORTANT — pair this Dockerfile with a .dockerignore to keep
# the build context small and prevent secrets from leaking into
# image layers.  See .dockerignore in the repo root.
# ============================================================

# ---------------------------
# Stage 1 — Builder
# ---------------------------
FROM python:3.11-slim-bookworm AS builder

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /build

# Install only the build-time system dependencies needed for compiled wheels
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies into a discrete prefix so we can copy
# just the site-packages into the runtime stage (no pip/setuptools bloat)
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ---------------------------
# Stage 2 — Runtime
# ---------------------------
FROM python:3.11-slim-bookworm AS runtime

# ── Labels (OCI image spec) ──
LABEL org.opencontainers.image.title="NEXUS-PI" \
      org.opencontainers.image.description="AI-Powered Industrial Product Intelligence Engine" \
      org.opencontainers.image.version="2.5.0" \
      org.opencontainers.image.vendor="NEXUS-PI" \
      org.opencontainers.image.licenses="MIT"

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Default port — can be overridden at runtime (e.g. Render, Railway)
ENV PORT=8000

WORKDIR /app

# Copy pre-built Python packages from builder stage
COPY --from=builder /install/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /install/bin /usr/local/bin

# Copy application source code
COPY nexus_pi/ ./nexus_pi/
COPY main.py .

# Copy sample data (the data/ directory holds the SQLite DB at runtime)
COPY data/ ./data/

# ── Security: create a non-root user ──
RUN groupadd --system nexus && \
    useradd --system --gid nexus --shell /usr/sbin/nologin --no-create-home nexus && \
    # Ensure the data directory is writable for SQLite persistence
    chown -R nexus:nexus /app/data && \
    chmod 755 /app/data

# Switch to non-root user
USER nexus

# Expose the application port
EXPOSE ${PORT}

# ── Health check ──
# Probes the /api/v1/health endpoint every 30 s.
# Uses python instead of curl to avoid installing an extra binary.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT}/api/v1/health')" || exit 1

# ── Entrypoint ──
# Use exec form so uvicorn receives OS signals (SIGTERM) directly.
# The shell form is used here intentionally so $PORT is expanded at runtime.
CMD uvicorn nexus_pi.api.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --log-level info
