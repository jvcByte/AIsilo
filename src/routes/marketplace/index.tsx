import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/pages/marketplace";

/**
 * Marketplace route
 *
 * This page is intentionally self-contained and uses existing UI primitives
 * from the codebase. It renders a simple searchable/filterable grid of
 * marketplace listings (models & datasets) with CTAs to connect wallet,
 * browse, and create listings.
 *
 * The items here are mocked placeholders to provide structure for the page.
 * In a later iteration you can replace the mock data with real on-chain or
 * API-driven content.
 */

export const Route = createFileRoute("/marketplace/")({
  component: Marketplace,
});
