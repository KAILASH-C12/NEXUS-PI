"""
NEXUS-PI — Command Line Interface
Enrich a single product from the command line.

Usage:
  python main.py --part-number "6ES7 215-1AG40-0XB0" --brand "Siemens" --description "SIMATIC S7-1200 CPU"
  python main.py --part-number "6ES7 215-1AG40-0XB0" --brand "Siemens" --description "SIMATIC S7-1200 CPU" --output result.json
"""

import asyncio
import json
import logging
import sys

# Fix Windows console encoding for emoji/unicode output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.tree import Tree
from rich import box

from nexus_pi.schemas.product import ProductInput
from nexus_pi.agents.orchestrator import Orchestrator

console = Console()


def display_result(output):
    """Display the enriched product output in a rich, formatted view."""
    data = output.to_export_dict()

    # ── Header ──
    console.print()
    console.print(Panel(
        f"[bold cyan]{output.input.brand}[/bold cyan] "
        f"[bold white]{output.input.part_number}[/bold white]\n"
        f"[dim]{output.product_id} • {output.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}[/dim]",
        title="🧠 [bold]NEXUS-PI Product Intelligence[/bold]",
        border_style="cyan",
        padding=(1, 2),
    ))

    # ── Taxonomy ──
    tax = output.taxonomy
    console.print(Panel(
        f"[bold]Category:[/bold] {tax.product_category}\n"
        f"[bold]UNSPSC:[/bold] {tax.unspsc_code or 'N/A'} — {tax.unspsc_description or ''}\n"
        f"[bold]eCl@ss:[/bold] {tax.eclass_code or 'N/A'} — {tax.eclass_description or ''}",
        title="📋 Taxonomy Classification",
        border_style="blue",
    ))

    # ── Specifications Table ──
    spec_table = Table(
        title="🔧 Technical Specifications",
        box=box.ROUNDED,
        show_header=True,
        header_style="bold magenta",
    )
    spec_table.add_column("Attribute", style="cyan", min_width=20)
    spec_table.add_column("Value", style="white", min_width=15)
    spec_table.add_column("Unit", style="dim", min_width=8)
    spec_table.add_column("Confidence", justify="center", min_width=12)
    spec_table.add_column("Review?", justify="center", min_width=8)

    for spec in output.specifications:
        conf = spec.confidence.overall
        if conf >= 0.85:
            conf_str = f"[green]{conf:.2f} ✅[/green]"
        elif conf >= 0.70:
            conf_str = f"[yellow]{conf:.2f} ⚠️[/yellow]"
        else:
            conf_str = f"[red]{conf:.2f} ❌[/red]"

        review = "[red]YES[/red]" if spec.requires_human_review else "[green]NO[/green]"

        spec_table.add_row(
            spec.attribute_name,
            spec.value,
            spec.unit or "—",
            conf_str,
            review,
        )

    console.print(spec_table)

    # ── Commerce Content ──
    cc = output.commerce_content
    if cc.long_description:
        console.print(Panel(
            cc.long_description,
            title="📝 Long Description",
            border_style="green",
        ))

    if cc.features:
        feature_text = "\n".join(f"  • {f}" for f in cc.features)
        console.print(Panel(
            feature_text,
            title="⭐ Features",
            border_style="yellow",
        ))

    if cc.seo_meta_title:
        console.print(Panel(
            f"[bold]Title:[/bold] {cc.seo_meta_title}\n"
            f"[bold]Description:[/bold] {cc.seo_meta_description}\n"
            f"[bold]Keywords:[/bold] {', '.join(cc.keywords[:8])}",
            title="🔍 SEO Metadata",
            border_style="magenta",
        ))

    # ── Related Products ──
    if output.related_products:
        rel_table = Table(
            title="🔗 Related Products",
            box=box.SIMPLE_HEAVY,
            show_header=True,
            header_style="bold cyan",
        )
        rel_table.add_column("Part Number", style="white")
        rel_table.add_column("Name", style="dim")
        rel_table.add_column("Relationship", style="cyan")

        for rp in output.related_products:
            rel_table.add_row(rp.part_number, rp.name, rp.relationship_type)

        console.print(rel_table)

    # ── Quality Report ──
    qr = output.quality_report
    review_status = "[red bold]⚠️  HUMAN REVIEW REQUIRED[/red bold]" if qr.human_review_required else "[green bold]✅ PASSED[/green bold]"

    console.print(Panel(
        f"[bold]Overall Confidence:[/bold] {qr.overall_confidence:.2f}\n"
        f"[bold]Attributes Validated:[/bold] {qr.attributes_validated}\n"
        f"  [green]High (≥0.85):[/green] {qr.attributes_high_confidence}  "
        f"[yellow]Medium (0.70-0.85):[/yellow] {qr.attributes_medium_confidence}  "
        f"[red]Low (<0.70):[/red] {qr.attributes_low_confidence}\n"
        f"[bold]Processing Time:[/bold] {qr.processing_time_seconds}s\n"
        f"[bold]Status:[/bold] {review_status}",
        title="📊 Quality Report",
        border_style="cyan",
    ))

    if qr.flags:
        flags_text = "\n".join(f"  ⚡ {f}" for f in qr.flags)
        console.print(Panel(flags_text, title="⚠️  Validation Flags", border_style="yellow"))

    # ── Provenance Sample ──
    if output.specifications and output.specifications[0].provenance:
        tree = Tree("📜 [bold]Provenance Chain (Sample)[/bold]")
        first_spec = output.specifications[0]
        spec_branch = tree.add(f"[cyan]{first_spec.attribute_name}[/cyan]: {first_spec.value}")
        for prov in first_spec.provenance:
            prov_node = spec_branch.add(f"[dim]{prov.source_name}[/dim]")
            prov_node.add(f"Method: {prov.extraction_method.value}")
            prov_node.add(f"Reliability: {prov.reliability_score:.2f}")
            if prov.source_url:
                prov_node.add(f"URL: {prov.source_url}")
        console.print(tree)


@click.command()
@click.option("--part-number", "-p", required=True, help="Manufacturer part number")
@click.option("--brand", "-b", required=True, help="Brand / manufacturer name")
@click.option("--description", "-d", default="", help="Short product description")
@click.option("--context", "-c", default=None, help="Additional context or hints")
@click.option("--output", "-o", default=None, help="Output JSON file path (optional)")
@click.option("--quiet", "-q", is_flag=True, help="Output JSON only, no rich formatting")
def main(part_number, brand, description, context, output, quiet):
    """
    🧠 NEXUS-PI — AI-Powered Product Intelligence

    Transform minimal product information into rich, structured,
    commerce-ready product intelligence.
    """
    # Configure logging
    log_level = logging.WARNING if quiet else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)-8s | %(message)s",
        datefmt="%H:%M:%S",
    )

    if not quiet:
        console.print()
        console.print("[bold cyan]🧠 NEXUS-PI[/bold cyan] — AI-Powered Product Intelligence")
        console.print(f"   Processing: [bold]{brand}[/bold] {part_number}")
        console.print()

    # Build input
    product_input = ProductInput(
        part_number=part_number,
        brand=brand,
        description=description,
        additional_context=context,
    )

    # Run the pipeline
    orchestrator = Orchestrator()
    result = asyncio.run(orchestrator.run(product_input))

    # Display results
    if quiet:
        print(json.dumps(result.to_export_dict(), indent=2, default=str))
    else:
        display_result(result)

    # Save to file if requested
    if output:
        with open(output, "w", encoding="utf-8") as f:
            json.dump(result.to_export_dict(), f, indent=2, default=str)
        console.print(f"\n[green]💾 Output saved to {output}[/green]")


if __name__ == "__main__":
    main()
