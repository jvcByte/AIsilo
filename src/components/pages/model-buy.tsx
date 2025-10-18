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
import { useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  Loader,
  AlertCircle,
  Download,
  FileText,
  Shield,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

function ModelBuy() {
  const { buy } = useParams({ from: "/marketplace/$buy/buy" });
  const item = MOCK_LISTINGS.find((l) => l.id === buy) as Listing | undefined;
  const activeAccount = useActiveAccount();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  // If not connected, prompt the user to connect
  if (!activeAccount) {
    return (
      <div>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb className="text-sm text-muted-foreground mb-8">
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

          <Card className="p-8 bg-gradient-to-br from-background to-muted border-primary/30">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle
                className="text-yellow-500 flex-shrink-0 mt-1"
                size={24}
              />
              <div>
                <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
                <p className="text-muted-foreground mt-2">
                  You need a Hedera-compatible wallet to purchase or license
                  this asset.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 border border-border/50 rounded-lg p-6 mb-6">
              <h2 className="font-semibold mb-3">Why connect your wallet?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Secure, on-chain transaction recording</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Instant access to your license upon purchase</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Ownership verification and proof of purchase</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Direct integration with your HBAR account</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <SignInButton label="Connect Wallet to Continue" />
            </div>

            <p className="text-xs text-muted-foreground">
              After connecting, you'll return here to complete the purchase. We
              support all Hedera-compatible wallets.
            </p>

            <div className="mt-6 pt-6 border-t border-border/50">
              <Link
                to={"/marketplace" as FileRouteTypes["to"]}
                className="text-muted-foreground hover:text-primary transition"
              >
                ← Back to marketplace
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const handleBuy = async () => {
    if (!agreedToTerms) return;

    setIsPurchasing(true);
    setTxHash(null);

    try {
      // Simulate transaction delay
      await new Promise((res) => setTimeout(res, 2000));
      // Generate mock transaction hash
      const mockTx = "0x" + Math.random().toString(16).slice(2, 18);
      setTxHash(mockTx);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumb className="text-sm text-muted-foreground mb-5 mt-12">
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>Purchase</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Summary */}
            <Card className="p-6 bg-gradient-to-br from-background to-muted border-border/50">
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <p className="text-muted-foreground mb-4">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Creator</p>
                  <p className="font-semibold text-primary">{item.author}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold capitalize">{item.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold capitalize">{item.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">License</p>
                  <p className="font-semibold">Commercial Use</p>
                </div>
              </div>
            </Card>

            {/* License Terms */}
            <Card className="p-6 border-border/50 bg-gradient-to-br from-background to-muted">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                License Terms
              </h2>
              <ScrollArea className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-4 max-h-64 text-sm text-muted-foreground space-y-3 h-[60vh] sm:h-[calc(90vh-13rem)] w-full">
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Grant of License:</strong> Upon purchase and payment
                  confirmation on the Hedera blockchain, Creator grants you a
                  non-exclusive, worldwide, royalty-free license to use this{" "}
                  {item.type} for commercial and personal purposes.
                </p>
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Permitted Use:</strong> You may download, install,
                  use, and integrate this {item.type} into your applications and
                  projects. You may modify the {item.type} for your internal
                  use.
                </p>
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Restrictions:</strong> You may not redistribute,
                  resell, or sublicense this {item.type} without explicit
                  written permission from the Creator. You may not claim
                  ownership or authorship of the {item.type}.
                </p>
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Intellectual Property:</strong> All intellectual
                  property rights remain with the Creator. This license does not
                  transfer ownership.
                </p>
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Warranty Disclaimer:</strong> This {item.type} is
                  provided "as-is" without warranty of any kind. The Creator
                  makes no representations regarding accuracy, completeness, or
                  fitness for purpose.
                </p>
                <p className="mb-2 tracking-wide leading-5.5 text-justify">
                  <strong>Support:</strong> The Creator may provide support and
                  documentation. Support is provided on a best-effort basis.
                </p>
              </ScrollArea>
            </Card>

            {/* What You Get */}
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download size={20} className="text-primary" />
                What You'll Receive
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium">Instant Download</p>
                    <p className="text-sm text-muted-foreground">
                      Access your {item.type} immediately after on-chain
                      confirmation
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium">Full Documentation</p>
                    <p className="text-sm text-muted-foreground">
                      API guides, integration examples, and usage instructions
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium">Creator Support</p>
                    <p className="text-sm text-muted-foreground">
                      Direct access to creator for integration assistance
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium">Proof of Purchase</p>
                    <p className="text-sm text-muted-foreground">
                      On-chain transaction record for verification
                    </p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Terms Agreement */}
            {!txHash && (
              <Card className="p-6 border-border/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the license terms and conditions above. I
                    understand that this is a non-exclusive license and that all
                    intellectual property rights remain with the creator.
                  </span>
                </label>
              </Card>
            )}
          </div>

          {/* Sidebar - Purchase Summary */}
          <div className="lg:col-span-1">
            {!txHash ? (
              <Card className="p-6 border-primary/50 bg-gradient-to-b from-primary/10 to-background sticky top-24">
                <h2 className="font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 pb-6 border-b border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">License Fee</span>
                    <span className="font-semibold">
                      {typeof item.priceHbar === "number"
                        ? `${item.priceHbar} HBAR`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-semibold">~0.5 HBAR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-semibold text-xs text-muted-foreground">
                      (incl. in price)
                    </span>
                  </div>
                </div>

                <div className="py-4 border-b border-border/50 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {typeof item.priceHbar === "number"
                        ? `${item.priceHbar + 0.5}`
                        : "0.5"}{" "}
                      HBAR
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBuy}
                  disabled={isPurchasing || !agreedToTerms}
                  className="w-full py-6 text-base mb-3"
                >
                  {isPurchasing ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Connected: {activeAccount?.address?.slice(0, 8)}...
                  {activeAccount?.address?.slice(-6)}
                </p>
              </Card>
            ) : (
              <Card className="p-6 border-green-500/50 bg-gradient-to-b from-green-500/10 to-background sticky top-24">
                <div className="text-center space-y-4">
                  <CheckCircle size={48} className="text-green-400 mx-auto" />
                  <div>
                    <h2 className="text-xl font-bold">Purchase Complete</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your license has been confirmed on-chain
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-left">
                    <p className="text-xs text-muted-foreground mb-2">
                      Transaction Hash
                    </p>
                    <p className="text-xs font-mono text-cyan-400 break-all">
                      {txHash}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="default" className="flex-1">
                      <Link
                        to={`/marketplace/${item.id}` as FileRouteTypes["to"]}
                      >
                        View Item
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigator.clipboard?.writeText(txHash)}
                    >
                      Copy TX
                    </Button>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link to={"/marketplace" as FileRouteTypes["to"]}>
                      Continue Shopping
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground pt-2">
                    Check your email for download links and documentation.
                  </p>
                </div>
              </Card>
            )}

            {/* Security Info */}
            <Card className="p-6 border-border/50 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                Secure Purchase
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Hedera blockchain verified</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Instant on-chain settlement</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Immutable transaction record</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Creator verified</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export { ModelBuy };
