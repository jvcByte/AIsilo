import { HeroTextLoop } from "./hero-text-loop";

export default function HeroSection() {
  return (
    <>
      <main className="">
        <section className="bg-linear-to-b to-muted from-background min-h-screen flex items-center">
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
            <div className="items-center">
              <h1 className="text-balance text-5xl font-bold md:text-6xl tracking-widest leading-[1.5]">
                Encrypt & Store Your Files on <span className="text-[#fa0707]">Blockchain</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-4 mb-8 max-w-2xl mx-auto">
                <HeroTextLoop />
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
