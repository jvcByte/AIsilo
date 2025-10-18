import { useParams } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { MOCK_LISTINGS } from "@/data/marketplace-data";
import type { Listing } from "@/data/types";
import type { FileRouteTypes } from "@/routeTree.gen";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star, Download, Users, Shield, FileText, Code } from "lucide-react";

function ModelDetailsPage() {
  const { id } = useParams({ from: "/marketplace/$id" });
  const item = MOCK_LISTINGS.find((l) => l.id === id) as Listing | undefined;

  if (!item) {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold mt-8">Listing not found</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We couldn't find the listing you requested.
          </p>
          <div className="mt-4">
            <Link
              to={"/marketplace" as FileRouteTypes["to"]}
              className="text-primary hover:underline"
            >
              Back to marketplace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Mock data for comprehensive details
  const mockStats = {
    downloads: Math.floor(Math.random() * 5000) + 100,
    rating: (Math.random() * 1 + 4).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 10,
    creators: Math.floor(Math.random() * 500) + 50,
  };

  const mockDetails = {
    version: "1.0.0",
    framework: item.type === "model" ? ["PyTorch", "ONNX"] : ["CSV", "Parquet"],
    size: item.type === "model" ? "245 MB" : "1.2 GB",
    updated: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    license: "Commercial License",
    supportedPlatforms: ["Hedera", "Web3", "Cloud"],
    documentation: true,
    apiAccess: true,
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb className="text-sm text-muted-foreground mt-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/marketplace/${item.id}`}>
                {item.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="p-6 bg-gradient-to-br from-background to-muted border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{item.title}</h1>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(parseFloat(mockStats.rating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{mockStats.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({mockStats.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Download size={16} className="text-primary" />
                  <span>{mockStats.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-primary" />
                  <span>
                    {mockStats.creators.toLocaleString()} active users
                  </span>
                </div>
              </div>
            </Card>

            {/* Creator Info */}
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Creator Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-semibold text-primary">{item.author}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Verification
                    </p>
                    <p className="font-semibold text-green-400">Verified</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      On-Chain Record
                    </p>
                    <p className="font-semibold text-cyan-400">Immutable</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Details */}
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code size={20} className="text-primary" />
                Technical Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-semibold">{mockDetails.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold">{mockDetails.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{mockDetails.updated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold capitalize">{item.category}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Framework/Format
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockDetails.framework.map((fw) => (
                    <span
                      key={fw}
                      className="px-3 py-1 rounded bg-muted text-sm font-medium"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Supported Platforms
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockDetails.supportedPlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 rounded bg-primary/10 text-primary text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Features & Capabilities */}
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-semibold mb-4">
                Features & Capabilities
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <p className="font-medium">Full API Documentation</p>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive guides and code examples
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <p className="font-medium">Commercial Use License</p>
                    <p className="text-sm text-muted-foreground">
                      Allowed for production and commercial applications
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <p className="font-medium">Instant Access</p>
                    <p className="text-sm text-muted-foreground">
                      Download after license confirmation on-chain
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <p className="font-medium">Creator Support</p>
                    <p className="text-sm text-muted-foreground">
                      Direct contact with creator for integration help
                    </p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Tags */}
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-muted border border-border/50 text-sm font-medium hover:border-primary transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Purchase Card */}
            <Card className="p-6 border-primary/50 bg-gradient-to-b from-primary/10 to-background sticky top-24">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {typeof item.priceHbar === "number"
                      ? `${item.priceHbar} HBAR`
                      : "Free"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    One-time license
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Creator Earnings
                    </span>
                    <span className="text-sm font-semibold text-green-400">
                      85%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Platform Fee</span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      15%
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base">
                    <Link
                      to={`/marketplace/${item.id}/buy` as FileRouteTypes["to"]}
                    >
                      Buy License Now
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full py-6">
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                License Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{mockDetails.license}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Usage</p>
                  <p className="font-medium">Commercial & Personal</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Support</p>
                  <p className="font-medium">Yes - Direct Creator</p>
                </div>
              </div>
            </Card>

            {/* On-Chain Info */}
            <Card className="p-6 border-border/50 bg-cyan-500/5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                On-Chain Record
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-semibold text-cyan-400">Hedera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-400">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provenance</span>
                  <span className="font-semibold">Immutable</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                All transactions are recorded on the Hedera blockchain for
                transparency and immutability.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export { ModelDetailsPage };
