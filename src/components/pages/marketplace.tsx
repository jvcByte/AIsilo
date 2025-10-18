import { useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { PlusCircleIcon, TrendingUp, Users, Shield, Zap } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/marketplace-data";
import type { Listing, ListingType } from "@/data/types";
import type { FileRouteTypes } from "@/routeTree.gen";

function ListingCard({ item }: { item: Listing }) {
  return (
    <Card className="p-4 h-full flex flex-col justify-between border-border bg-gradient-to-br from-background to-muted hover:border-primary/50 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
          <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
            {item.type.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {item.description}
        </p>
        <div className="text-xs text-muted-foreground mb-3">
          By: <span className="font-medium text-primary">{item.author}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          Category:{" "}
          <span className="font-medium text-cyan-400">{item.category}</span>
        </div>
        {item.tags && (
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded bg-card border border-border/50 text-muted-foreground"
              >
                #{t}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded bg-card border border-border/50 text-muted-foreground">
                +{item.tags.length - 3}
              </span>
            )}
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
            <div className="text-sm text-green-400 font-medium">Free</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="px-3 py-1 text-xs">
            <Link
              to={`/marketplace/${item.id}` as unknown as FileRouteTypes["to"]}
            >
              Details
            </Link>
          </Button>
          <Button
            asChild
            className="px-3 py-1 text-xs bg-primary hover:bg-primary/90"
          >
            <Link
              to={
                `/marketplace/${item.id}/buy` as unknown as FileRouteTypes["to"]
              }
            >
              License
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
        l.author.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    });
  }, [query, filterType]);

  const stats = [
    {
      label: "Models & Datasets",
      value: MOCK_LISTINGS.length,
      icon: TrendingUp,
    },
    { label: "Active Creators", value: "2,400+", icon: Users },
    { label: "Verified Listings", value: "98%", icon: Shield },
    { label: "On-Chain Transactions", value: "150K+", icon: Zap },
  ];

  return (
    <div className="w-full">
      <Header />
      <div className="relative bg-gradient-to-b from-background via-background to-muted min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                AI Models & Datasets Marketplace
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Discover, license, and monetize AI models and datasets on the
                Hedera blockchain. Transparent pricing, on-chain provenance, and
                instant payments.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-base"
              >
                <Link to="/copy-paste" className="flex items-center gap-2">
                  <PlusCircleIcon size={20} />
                  Create Listing
                </Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-base border-primary/50 hover:bg-primary/10"
                onClick={() =>
                  document
                    .getElementById("browse-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse Listings
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="p-6 border-border/50 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          {/* Search & Filters */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Find What You Need</h2>
              <div className="flex flex-col gap-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, author, category, or tags..."
                  className="py-6 text-base"
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className="px-6"
                  >
                    All ({MOCK_LISTINGS.length})
                  </Button>
                  <Button
                    variant={filterType === "model" ? "default" : "outline"}
                    onClick={() => setFilterType("model")}
                    className="px-6"
                  >
                    Models (
                    {MOCK_LISTINGS.filter((l) => l.type === "model").length})
                  </Button>
                  <Button
                    variant={filterType === "dataset" ? "default" : "outline"}
                    onClick={() => setFilterType("dataset")}
                    className="px-6"
                  >
                    Datasets (
                    {MOCK_LISTINGS.filter((l) => l.type === "dataset").length})
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Listings Grid */}
          <section id="browse-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filtered.length === 0
                  ? "No listings found"
                  : `${filtered.length} ${filterType === "all" ? "Listing" : filterType}${filtered.length !== 1 ? "s" : ""}`}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <Card className="p-12 text-center border-border/50">
                <p className="text-muted-foreground mb-4">
                  No results found for your search. Try adjusting your filters
                  or browse all listings.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setFilterType("all");
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          {/* Info Section */}
          <section className="py-12 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">For Buyers</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      Browse curated AI models and datasets from top creators
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      License assets with transparent, on-chain pricing in HBAR
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      Access verified provenance and creator reputation scores
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Integrate licensed models via our SDK or API</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">For Creators</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      Upload and monetize your AI models and datasets instantly
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Keep 85% of revenue—no hidden fees or middlemen</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      Set your own licensing terms and pricing strategy
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>
                      Build reputation through reviews and verified transactions
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <Button
              asChild
              className="mt-8 px-8 py-6 text-base bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Link
                to="/copy-paste"
                className="flex items-center justify-center gap-2"
              >
                <PlusCircleIcon size={20} />
                Start Listing Now
              </Link>
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}

export { Marketplace };
