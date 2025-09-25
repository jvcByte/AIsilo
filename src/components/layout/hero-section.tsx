// import { Link } from "@tanstack/react-router";
// import { Button } from "@/components/ui/button";
// import { ChevronRight } from "lucide-react";

// const navLinks = [{ name: "Get Started", to: "/_authenticated/dashboard" }];

export default function HeroSection() {
  return (
    <>
      <main className="">
        <section className="bg-linear-to-b to-muted from-background min-h-screen flex items-center">
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
            <div className="items-center">
              <h1 className="text-balance text-5xl font-bold md:text-6xl tracking-widest leading-[1.5]">
                Build Authenticated <span className="text-[#fa0707]">Web3</span> Dapps
              </h1>
              <p className="text-xl text-muted-foreground mt-4 mb-8 max-w-2xl mx-auto">
                Start from a production-ready template with wallet authentication, protected routes, and modern UI.
              </p>

              {/* Search Section */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-2xl mx-auto mt-8">

                {/* <Button asChild size="lg" className="pr-4.5">
                  <Link to={navLinks[0].to}>
                    <span className="text-nowrap md:px-3">Get Started</span>
                    <ChevronRight className="opacity-50" />
                  </Link>
                </Button> */}
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
