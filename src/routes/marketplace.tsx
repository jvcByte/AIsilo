import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import SignInButton from "@/components/wallet/thirdweb-connect-btn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";

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

export const Route = createFileRoute("/marketplace")({
  component: Marketplace,
});

type ListingType = "model" | "dataset";

type Listing = {
  id: string;
  title: string;
  description: string;
  author: string;
  priceHbar?: number;
  type: ListingType;
  tags?: string[];
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: "gpt-mini-1",
    title: "GPT-Mini (fine-tuned)",
    description:
      "Small, fast language model fine-tuned for on-chain analytics.",
    author: "alice.hedera",
    priceHbar: 5,
    type: "model",
    tags: ["nlp", "fine-tuned", "fast"],
  },
  {
    id: "vision-set-01",
    title: "Vision Dataset v1",
    description: "2M labeled images for object detection (curated & cleaned).",
    author: "dataset-curator",
    priceHbar: 12,
    type: "dataset",
    tags: ["vision", "images", "curated"],
  },
  {
    id: "speech-tts-1",
    title: "TTS Express",
    description: "Lightweight TTS model optimized for low-latency inference.",
    author: "voice-labs",
    priceHbar: 3,
    type: "model",
    tags: ["speech", "tts", "low-latency"],
  },
  {
    id: "tabular-finance-01",
    title: "Market Signals (tabular)",
    description: "High-quality financial time-series dataset for modeling.",
    author: "quant-team",
    priceHbar: 8,
    type: "dataset",
    tags: ["tabular", "finance", "timeseries"],
  },
];

function ListingCard({ item }: { item: Listing }) {
  return (
    <Card className="p-4 h-full flex flex-col justify-between border-border">
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
            <Link to={`/marketplace/${item.id}`}>Details</Link>
          </Button>
          <Button asChild className="px-3 py-1">
            <Link to={`/marketplace/${item.id}/buy`}>Buy / License</Link>
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
    <div className="p-2">
      <Header />
      <div className="relative bg-linear-to-b to-muted from-background min-h-[90vh] flex items-center overflow-hidden">
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 pt-24">
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
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex"
              >
                <Link to="/create">
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
                onChange={(e: any) => setQuery(e.target.value)}
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

          {/* Listings grid */}
          <section>
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

          {/* Info / getting started */}
          <section className="p-6 bg-card border border-border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Getting started</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                Connect your Hedera-compatible wallet to buy or list assets.
              </li>
              <li>
                Create listings with pricing, license terms, and metadata.
                Provenance will be recorded on Hedera for transparency.
              </li>
              <li>
                Use the SDK or API to integrate licensed models into your
                decentralized AI apps.
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
