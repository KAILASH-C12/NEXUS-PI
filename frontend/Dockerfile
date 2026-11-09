# =============================================================================
# NEXUS-PI Frontend — Production Dockerfile
# Multi-stage build for Next.js 16 with standalone output
# =============================================================================
# Stages:
#   1. deps        — install production + dev dependencies (cached layer)
#   2. builder     — build the Next.js application
#   3. runner      — minimal production image with standalone output
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Install dependencies
# ---------------------------------------------------------------------------
# Using Node 20 Alpine for smaller image size and LTS support.
FROM node:20-alpine AS deps

# Add libc6-compat for native module compatibility on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package manifests first to maximize Docker layer caching.
# Dependencies are re-installed only when these files change.
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod) — dev deps are needed for the build
# step. Using `npm ci` for reproducible, lockfile-exact installs.
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2: Build the application
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Re-use cached node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the full source tree
COPY . .

# Build-time environment variables.
# NEXT_PUBLIC_* vars are inlined at build time by Next.js, so they must be
# available here. Provide a sensible default that can be overridden at
# `docker build --build-arg`.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Disable Next.js anonymous telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Produce the standalone build (requires `output: "standalone"` in next.config)
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: Production runner
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Label the image for traceability
LABEL maintainer="NEXUS-PI Team"
LABEL description="NEXUS-PI Next.js 16 frontend — production image"

# Runtime environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# The API URL is baked into the JS bundle at build time (NEXT_PUBLIC_*), but
# server-side code may still read it at runtime, so expose it here as well.
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# --- Security: run as non-root -------------------------------------------------
# Create a dedicated system group and user so the container never runs as root.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# --- Copy only what the standalone server needs --------------------------------
# 1. Public assets (static files served directly)
COPY --from=builder /app/public ./public

# 2. Standalone server bundle (includes a minimal Node server + dependencies)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 3. Static build output (pre-rendered pages, chunks, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user before exposing the port
USER nextjs

# Next.js standalone listens on port 3000 by default
EXPOSE 3000

# The standalone server reads PORT and HOSTNAME from the environment.
# Bind to 0.0.0.0 so the container is reachable from outside.
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the standalone Next.js server
CMD ["node", "server.js"]
