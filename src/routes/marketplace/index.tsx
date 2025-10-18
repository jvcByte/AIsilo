import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/marketplace-data";
import type { Listing, ListingType } from "@/data/types";
import type { FileRouteTypes } from "@/routeTree.gen";

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

function ListingCard({ item }: { item: Listing }) {
  return (
    <Card className="p-4 h-full flex flex-col justify-between border-border bg-linear-to-br to-muted from-background">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
            {item.type.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
        <div className="text-xs text-muted-foreground mb-3">
          Author:{" "}
          <span className="font-medium text-primary">{item.author}</span>
        </div>
        {item.tags && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded bg-card border border-border"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          {typeof item.priceHbar === "number" ? (
            <div className="text-sm font-semibold text-primary">
              {item.priceHbar} HBAR
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Free / Request Access
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="px-3 py-1">
            {/* Cast through unknown to the router-generated `to` union type so ESLint doesn't require `any` */}
            <Link
              to={`/marketplace/${item.id}` as unknown as FileRouteTypes["to"]}
            >
              Details
            </Link>
          </Button>
          <Button asChild className="px-3 py-1">
            <Link
              to={
                `/marketplace/${item.id}/buy` as unknown as FileRouteTypes["to"]
              }
            >
              Buy / License
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Marketplace() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | ListingType>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_LISTINGS.filter((l) => {
      if (filterType !== "all" && l.type !== filterType) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags?.some((t) => t.toLowerCase().includes(q)) ||
        l.author.toLowerCase().includes(q)
      );
    });
  }, [query, filterType]);

  return (
    <div className="">
      <Header />
      <div className="relative bg-linear-to-b to-muted from-background min-h-[90vh] flex items-center overflow-hidden">
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 pt-24">
          <div className="fixed top-25 left-100 right-100 space-y-6 space-x-7">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Marketplace</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover AI models and datasets with on-chain provenance and
                  transparent licensing on Hedera.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button asChild variant="outline" className="inline-flex">
                  <Link to="/copy-paste">
                    <PlusCircleIcon />
                    Create Listing
                  </Link>
                </Button>
              </div>
            </div>

            {/* Search & filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search models, datasets, tags or author..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "model" ? "default" : "outline"}
                  onClick={() => setFilterType("model")}
                >
                  Models
                </Button>
                <Button
                  variant={filterType === "dataset" ? "default" : "outline"}
                  onClick={() => setFilterType("dataset")}
                >
                  Datasets
                </Button>
              </div>
            </div>
          </div>

          {/* Listings grid */}
          <section className="pt-32">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No results — try adjusting your search or filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
