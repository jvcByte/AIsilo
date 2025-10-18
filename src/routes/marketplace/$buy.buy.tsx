import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_LISTINGS } from "@/data/marketplace-data";
import { Link } from "@tanstack/react-router";
import { useActiveAccount } from "thirdweb/react";
import { SignInButton } from "@/components/wallet/thirdweb-connect-btn";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { Listing } from "@/data/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export const Route = createFileRoute("/marketplace/$buy/buy")({
  component: RouteComponent,
});

function RouteComponent() {
  const { buy } = Route.useParams();
  const item = MOCK_LISTINGS.find((l) => l.id === buy) as Listing | undefined;
  const activeAccount = useActiveAccount();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!item) {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold mt-8">Purchase</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Listing not found.
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

  // If not connected, prompt the user to connect with the embedded SignIn flow
  if (!activeAccount) {
    return (
      <div>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-16">
          <Card className="p-6 mt-8 bg-linear-to-b to-muted from-background">
            <h1 className="text-xl font-bold">Connect your wallet</h1>
            <p className="text-sm text-muted-foreground mt-2">
              You need to connect a wallet to purchase or license this asset.
            </p>

            <div className="mt-6">
              <SignInButton label="Connect Wallet to Continue" />
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              After connecting you'll be returned here to complete the purchase.
            </div>

            <div className="mt-6">
              <Link
                to={"/marketplace" as FileRouteTypes["to"]}
                className="text-muted-foreground hover:underline"
              >
                Back to marketplace
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const handleBuy = async () => {
    // In a real app you'd call your payment / contract flow here.
    // We simulate a purchase for the demo.
    setIsPurchasing(true);
    setTxHash(null);

    try {
      await new Promise((res) => setTimeout(res, 1200));
      // mock transaction id
      const mockTx = "0x" + Math.random().toString(16).slice(2, 10);
      setTxHash(mockTx);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb className="text-sm text-muted-foreground mt-8 mb-4">
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
        <Card className="p-6 bg-linear-to-t to-muted from-background">
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {item.description}
              </p>

              <div className="mt-4 text-sm text-muted-foreground">
                Seller:{" "}
                <span className="font-medium text-primary">{item.author}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Type: <span className="font-medium">{item.type}</span>
              </div>
            </div>

            <aside className="w-full md:w-64 mt-6 md:mt-0">
              <div className="border p-4 rounded">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-2xl font-semibold mt-2">
                  {typeof item.priceHbar === "number"
                    ? `${item.priceHbar} HBAR`
                    : "Free / Request Access"}
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleBuy}
                    disabled={isPurchasing || !!txHash}
                  >
                    {isPurchasing
                      ? "Processing..."
                      : txHash
                        ? "Purchased"
                        : "Buy / License"}
                  </Button>
                </div>

                {txHash && (
                  <div className="mt-4 text-sm">
                    <div className="text-success-foreground font-medium">
                      Purchase complete
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Transaction: <span className="font-mono">{txHash}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button asChild>
                        <a
                          href={`/marketplace/${item.id}`}
                          className="inline-block"
                        >
                          View Item
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard?.writeText(txHash);
                          }}
                        >
                          Copy TX
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-muted-foreground">
                  This demo simulates the buy flow. Replace handleBuy with real
                  payment / on-chain logic.
                </div>
              </div>
            </aside>
          </div>
        </Card>
      </main>
    </div>
  );
}
