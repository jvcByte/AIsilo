import { HeroTextLoop } from "./hero-text-loop";
import {
  FileText,
  FileLock,
  FileCheck,
  Cloud,
  type LucideIcon,
  Boxes,
  Server,
  FileBox,
  FileCode,
  FolderGit2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import SignInButton from "@/components/wallet/thirdweb-connect-btn";

interface FloatingIconProps {
  icon: LucideIcon;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Floating icon component (repurposed for AI models & datasets)
function FloatingIcon({
  icon: Icon,
  delay,
  duration,
  startX,
  startY,
  endX,
  endY,
}: FloatingIconProps) {
  return (
    <div
      className="absolute opacity-20 dark:opacity-10"
      style={
        {
          animation: `float ${duration}s ease-in-out ${delay}s infinite`,
          left: `${startX}%`,
          top: `${startY}%`,
          "--end-x": `${endX}%`,
          "--end-y": `${endY}%`,
        } as React.CSSProperties
      }
    >
      <Icon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render floating icons after mount to avoid SSR/rehydration mismatch
    setMounted(true);
  }, []);

  // Floating icons suggest models, datasets, compute, and security
  const floatingIcons: FloatingIconProps[] = [
    {
      icon: FileCode,
      delay: 0,
      duration: 9,
      startX: 8,
      startY: 18,
      endX: 12,
      endY: 78,
    },
    {
      icon: FileText,
      delay: 1,
      duration: 10,
      startX: 22,
      startY: 70,
      endX: 18,
      endY: 22,
    },
    {
      icon: FileBox,
      delay: 2,
      duration: 11,
      startX: 45,
      startY: 12,
      endX: 50,
      endY: 80,
    },
    {
      icon: Boxes,
      delay: 0.6,
      duration: 8,
      startX: 78,
      startY: 25,
      endX: 74,
      endY: 72,
    },
    {
      icon: Cloud,
      delay: 1.8,
      duration: 9,
      startX: 60,
      startY: 82,
      endX: 58,
      endY: 28,
    },
    {
      icon: Server,
      delay: 2.2,
      duration: 12,
      startX: 90,
      startY: 50,
      endX: 86,
      endY: 18,
    },
    {
      icon: FileCheck,
      delay: 3,
      duration: 10,
      startX: 12,
      startY: 50,
      endX: 18,
      endY: 30,
    },
    {
      icon: FileLock,
      delay: 0.4,
      duration: 7,
      startX: 84,
      startY: 78,
      endX: 80,
      endY: 36,
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg) scale(1);
            }
            25% {
              transform: translate(18px, -28px) rotate(4deg) scale(1.07);
            }
            50% {
              transform: translate(-12px, -50px) rotate(-4deg) scale(0.98);
            }
            75% {
              transform: translate(22px, -36px) rotate(2deg) scale(1.03);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.96);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.9s ease-out forwards;
          }

          .animate-scale-in {
            animation: scaleIn 0.7s ease-out forwards;
          }

          .glow-text {
            text-shadow: 0 0 40px rgba(0, 0, 0, 0.18);
          }

          .hero-gradient {
            background: radial-gradient(
              circle at center,
              transparent 0%,
              rgba(0, 0, 0, 0.03) 50%,
              transparent 100%
            );
          }
        `}
      </style>

      <main className="relative ">
        <section className="relative bg-linear-to-b to-muted from-background min-h-[90vh] flex items-center overflow-hidden">
          {/* Soft radial gradient over the hero */}
          <div className="absolute inset-0 hero-gradient pointer-events-none" />

          {/* Floating icons */}
          {mounted &&
            floatingIcons.map((props, idx) => (
              <FloatingIcon key={idx} {...props} />
            ))}

          {/* Content container */}
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
            <div className="items-center space-y-8">
              {/* Trust badge */}
              <div className="hidden md:inline-flex animate-scale-in items-center gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <FolderGit2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Breaking AI Silos
                </span>
                <FolderGit2 className="w-4 h-4 text-primary" />
              </div>

              {/* Main heading */}
              <h1 className="leading-[1.2] animate-fade-in-up text-balance text-4xl font-bold md:text-7xl tracking-wider [animation-delay:200ms]">
                A marketplace for Your AI models & datasets on{" "}
                <span className="glow-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  Hedera
                </span>
              </h1>

              {/* Subheading */}
              <div className="animate-fade-in-up text-lg md:text-2xl text-muted-foreground mt-6 mb-8 max-w-3xl mx-auto [animation-delay:400ms]">
                <HeroTextLoop />
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up flex gap-4 justify-center items-center [animation-delay:600ms]">
                <SignInButton
                  label="Add Your Model"
                  connectButtonStyle={{
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "var(--background)",
                    backgroundColor: "var(--primary)",
                    border: "2px solid var(--border)",
                    height: "2.5rem",
                    minWidth: "auto",
                    borderRadius: "0.75rem",
                    padding: "0 1rem",
                  }}
                  termsOfServiceUrl="https://aisilo.example/terms"
                  privacyPolicyUrl="https://aisilo.example/privacy"
                />

                <Button
                  asChild
                  variant="outline"
                  className="md:px-8 py-3 bg-card border-2 border-border rounded-lg font-semibold md:text-lg hover:border-primary transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Link to="/marketplace">Explore Catalog</Link>
                </Button>
              </div>

              {/* Key benefits / stats */}
              <div className="animate-fade-in-up grid grid-cols-1 sm:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto [animation-delay:800ms]">
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-primary">
                    Curate
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Organize models & datasets with rich metadata for easy
                    discovery.
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-primary">
                    Monetize
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    License models, set usage fees, and receive direct payments.
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-4xl font-bold text-primary">
                    Access
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    GLobally deploy decentralized AI apps that call models
                    securely.
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-4xl font-bold text-primary">
                    Integrity
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Your Model remains tamper-proof with verifiable provenance.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
      </main>
    </>
  );
}
