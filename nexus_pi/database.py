"""
NEXUS-PI SQLite Database Layer
Async persistence for enriched products, search, and analytics.
"""

import json
import logging
import os
import aiosqlite
from datetime import datetime
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

# Database path — stored next to the project root
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "nexus_pi.db")


async def get_db() -> aiosqlite.Connection:
    """Get an async database connection."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    return db


async def init_database():
    """Create all tables if they don't exist. Called on app startup."""
    logger.info(f"📦 Initializing SQLite database at {DB_PATH}")
    db = await get_db()
    try:
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS products (
                product_id TEXT PRIMARY KEY,
                part_number TEXT NOT NULL,
                brand TEXT NOT NULL,
                description TEXT DEFAULT '',
                additional_context TEXT,
                taxonomy_json TEXT DEFAULT '{}',
                specifications_json TEXT DEFAULT '[]',
                commerce_content_json TEXT DEFAULT '{}',
                related_products_json TEXT DEFAULT '[]',
                quality_report_json TEXT DEFAULT '{}',
                compliance_json TEXT DEFAULT '{}',
                lifecycle_json TEXT DEFAULT '{}',
                overall_confidence REAL DEFAULT 0.0,
                processing_time_seconds REAL DEFAULT 0.0,
                human_review_required INTEGER DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE INDEX IF NOT EXISTS idx_products_part_number ON products(part_number);
            CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
            CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_products_confidence ON products(overall_confidence);

            CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
                product_id,
                part_number,
                brand,
                description,
                specs_text,
                content='products',
                content_rowid='rowid'
            );

            CREATE TABLE IF NOT EXISTS enrichment_jobs (
                job_id TEXT PRIMARY KEY,
                product_id TEXT,
                status TEXT DEFAULT 'pending',
                started_at TEXT,
                completed_at TEXT,
                error_message TEXT,
                stages_json TEXT DEFAULT '[]',
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
            );
        """)
        await db.commit()
        logger.info("✅ Database tables initialized successfully")
    finally:
        await db.close()


async def save_product(product_data: Dict[str, Any]) -> str:
    """Save an enriched product to the database. Returns product_id."""
    db = await get_db()
    try:
        product_id = product_data.get("product_id", "")
        input_data = product_data.get("input", {})
        quality = product_data.get("quality_report", {})

        # Build specs text for full-text search
        specs = product_data.get("specifications", [])
        specs_text_parts = []
        for s in specs:
            name = s.get("attribute_name", "")
            val = s.get("value", "")
            unit = s.get("unit", "") or ""
            specs_text_parts.append(f"{name} {val} {unit}")
        specs_text = " ".join(specs_text_parts)

        await db.execute("""
            INSERT OR REPLACE INTO products (
                product_id, part_number, brand, description, additional_context,
                taxonomy_json, specifications_json, commerce_content_json,
                related_products_json, quality_report_json,
                compliance_json, lifecycle_json,
                overall_confidence, processing_time_seconds, human_review_required,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id,
            input_data.get("part_number", ""),
            input_data.get("brand", ""),
            input_data.get("description", ""),
            input_data.get("additional_context"),
            json.dumps(product_data.get("taxonomy", {})),
            json.dumps(product_data.get("specifications", [])),
            json.dumps(product_data.get("commerce_content", {})),
            json.dumps(product_data.get("related_products", [])),
            json.dumps(quality),
            json.dumps(product_data.get("compliance", {})),
            json.dumps(product_data.get("lifecycle", {})),
            quality.get("overall_confidence", 0.0),
            quality.get("processing_time_seconds", 0.0),
            1 if quality.get("human_review_required", False) else 0,
            product_data.get("timestamp", datetime.utcnow().isoformat()),
            datetime.utcnow().isoformat(),
        ))

        # Update full-text search index
        # First delete existing entry if any
        await db.execute("DELETE FROM products_fts WHERE product_id = ?", (product_id,))
        await db.execute("""
            INSERT INTO products_fts (product_id, part_number, brand, description, specs_text)
            VALUES (?, ?, ?, ?, ?)
        """, (
            product_id,
            input_data.get("part_number", ""),
            input_data.get("brand", ""),
            input_data.get("description", ""),
            specs_text,
        ))

        await db.commit()
        logger.info(f"💾 Product {product_id} saved to database")
        return product_id
    finally:
        await db.close()


async def get_product(product_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single product by ID."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM products WHERE product_id = ?", (product_id,))
        row = await cursor.fetchone()
        if not row:
            return None
        return _row_to_product(row)
    finally:
        await db.close()


async def get_products(
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    brand_filter: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> Dict[str, Any]:
    """List products with pagination, search, and filtering."""
    db = await get_db()
    try:
        offset = (page - 1) * page_size

        if search and search.strip():
            # Full-text search
            search_term = search.strip()
            # Use FTS5 match query
            query = """
                SELECT p.* FROM products p
                JOIN products_fts fts ON p.product_id = fts.product_id
                WHERE products_fts MATCH ?
            """
            params: list = [f'"{search_term}"*']

            if brand_filter:
                query += " AND p.brand = ?"
                params.append(brand_filter)

            # Count total
            count_query = query.replace("SELECT p.*", "SELECT COUNT(*)")
            count_cursor = await db.execute(count_query, params)
            total_row = await count_cursor.fetchone()
            total = total_row[0] if total_row else 0

            # Fetch page
            query += f" ORDER BY p.{sort_by} {'DESC' if sort_order == 'desc' else 'ASC'} LIMIT ? OFFSET ?"
            params.extend([page_size, offset])
            cursor = await db.execute(query, params)
        else:
            # Regular listing
            query = "SELECT * FROM products"
            params = []

            if brand_filter:
                query += " WHERE brand = ?"
                params.append(brand_filter)

            # Count total
            count_query = query.replace("SELECT *", "SELECT COUNT(*)")
            count_cursor = await db.execute(count_query, params)
            total_row = await count_cursor.fetchone()
            total = total_row[0] if total_row else 0

            # Fetch page
            query += f" ORDER BY {sort_by} {'DESC' if sort_order == 'desc' else 'ASC'} LIMIT ? OFFSET ?"
            params.extend([page_size, offset])
            cursor = await db.execute(query, params)

        rows = await cursor.fetchall()
        products = [_row_to_product(r) for r in rows]

        return {
            "products": products,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }
    finally:
        await db.close()


async def delete_product(product_id: str) -> bool:
    """Delete a product by ID. Returns True if deleted."""
    db = await get_db()
    try:
        await db.execute("DELETE FROM products_fts WHERE product_id = ?", (product_id,))
        cursor = await db.execute("DELETE FROM products WHERE product_id = ?", (product_id,))
        await db.commit()
        deleted = cursor.rowcount > 0
        if deleted:
            logger.info(f"🗑️ Product {product_id} deleted from database")
        return deleted
    finally:
        await db.close()


async def get_dashboard_stats() -> Dict[str, Any]:
    """Get real-time dashboard statistics."""
    db = await get_db()
    try:
        # Total products
        cursor = await db.execute("SELECT COUNT(*) FROM products")
        total = (await cursor.fetchone())[0]

        # Average confidence
        cursor = await db.execute("SELECT AVG(overall_confidence) FROM products")
        row = await cursor.fetchone()
        avg_confidence = round(row[0], 4) if row[0] else 0.0

        # Products requiring review
        cursor = await db.execute("SELECT COUNT(*) FROM products WHERE human_review_required = 1")
        review_count = (await cursor.fetchone())[0]

        # Average processing time
        cursor = await db.execute("SELECT AVG(processing_time_seconds) FROM products")
        row = await cursor.fetchone()
        avg_time = round(row[0], 2) if row[0] else 0.0

        # Brand distribution
        cursor = await db.execute("""
            SELECT brand, COUNT(*) as count FROM products
            GROUP BY brand ORDER BY count DESC LIMIT 10
        """)
        brands = [{"brand": r[0], "count": r[1]} for r in await cursor.fetchall()]

        # Confidence distribution
        cursor = await db.execute("""
            SELECT
                SUM(CASE WHEN overall_confidence >= 0.85 THEN 1 ELSE 0 END) as high,
                SUM(CASE WHEN overall_confidence >= 0.70 AND overall_confidence < 0.85 THEN 1 ELSE 0 END) as medium,
                SUM(CASE WHEN overall_confidence < 0.70 THEN 1 ELSE 0 END) as low
            FROM products
        """)
        conf_row = await cursor.fetchone()
        confidence_distribution = {
            "high": conf_row[0] or 0,
            "medium": conf_row[1] or 0,
            "low": conf_row[2] or 0,
        }

        # Recent enrichments (last 10)
        cursor = await db.execute("""
            SELECT product_id, part_number, brand, description, overall_confidence, processing_time_seconds, created_at
            FROM products ORDER BY created_at DESC LIMIT 10
        """)
        recent = []
        for r in await cursor.fetchall():
            recent.append({
                "product_id": r[0],
                "part_number": r[1],
                "brand": r[2],
                "description": r[3],
                "overall_confidence": r[4],
                "processing_time_seconds": r[5],
                "created_at": r[6],
            })

        # Total processing time
        cursor = await db.execute("SELECT SUM(processing_time_seconds) FROM products")
        row = await cursor.fetchone()
        total_processing_time = round(row[0], 2) if row[0] else 0.0

        return {
            "total_products": total,
            "average_confidence": avg_confidence,
            "review_required_count": review_count,
            "average_processing_time": avg_time,
            "total_processing_time": total_processing_time,
            "brand_distribution": brands,
            "confidence_distribution": confidence_distribution,
            "recent_enrichments": recent,
        }
    finally:
        await db.close()


async def get_all_brands() -> List[str]:
    """Get all unique brands in the database."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT DISTINCT brand FROM products ORDER BY brand")
        return [r[0] for r in await cursor.fetchall()]
    finally:
        await db.close()


def _row_to_product(row) -> Dict[str, Any]:
    """Convert a database row to a product dictionary."""
    return {
        "product_id": row["product_id"],
        "timestamp": row["created_at"],
        "input": {
            "part_number": row["part_number"],
            "brand": row["brand"],
            "description": row["description"],
            "additional_context": row["additional_context"],
        },
        "taxonomy": json.loads(row["taxonomy_json"]) if row["taxonomy_json"] else {},
        "specifications": json.loads(row["specifications_json"]) if row["specifications_json"] else [],
        "commerce_content": json.loads(row["commerce_content_json"]) if row["commerce_content_json"] else {},
        "related_products": json.loads(row["related_products_json"]) if row["related_products_json"] else [],
        "quality_report": json.loads(row["quality_report_json"]) if row["quality_report_json"] else {},
        "compliance": json.loads(row["compliance_json"]) if row["compliance_json"] else {},
        "lifecycle": json.loads(row["lifecycle_json"]) if row["lifecycle_json"] else {},
    }
