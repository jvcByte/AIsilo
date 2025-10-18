import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/marketplace/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const item = MOCK_LISTINGS.find((l) => l.id === id) as Listing | undefined;

  if (!item) {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold">Listing not found</h1>
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

  return (
    <div>
      <Header />
      <main className=" max-w-5xl mx-auto px-4 py-12 space-y-6">
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

        <Card className="p-6 bg-linear-to-t to-muted from-background">
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {item.description}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                <div>
                  Author:{" "}
                  <span className="font-medium text-primary">
                    {item.author}
                  </span>
                </div>
                <div className="sm:ml-4">{item.type.toUpperCase()}</div>
                {item.tags && (
                  <div className="sm:ml-4">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-block text-xs px-2 py-0.5 mr-2 bg-muted rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </section>
            </div>

            <aside className="w-full md:w-1/3 mt-4 md:mt-0">
              <div className="border p-4 rounded">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-xl font-semibold mt-2">
                  {typeof item.priceHbar === "number"
                    ? `${item.priceHbar} HBAR`
                    : "Free / Request Access"}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">
                    <Link
                      to={`/marketplace/${item.id}/buy` as FileRouteTypes["to"]}
                    >
                      Buy / License
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Card>
      </main>
    </div>
  );
}
