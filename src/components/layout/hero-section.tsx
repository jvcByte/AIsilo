import { HeroTextLoop } from "./hero-text-loop";
import {
  FileText,
  FileLock,
  Shield,
  FileCheck,
  Cloud,
  type LucideIcon,
  Boxes,
  Server,
  FileBox,
  FileCode,
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

// Floating file icon component
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
    setMounted(true);
  }, []);

  const floatingIcons = [
    {
      icon: FileText,
      delay: 0,
      duration: 8,
      startX: 10,
      startY: 20,
      endX: 15,
      endY: 80,
    },
    {
      icon: FileLock,
      delay: 1,
      duration: 10,
      startX: 85,
      startY: 15,
      endX: 80,
      endY: 75,
    },
    {
      icon: FileBox,
      delay: 2,
      duration: 9,
      startX: 5,
      startY: 60,
      endX: 10,
      endY: 30,
    },
    {
      icon: Boxes,
      delay: 0.5,
      duration: 11,
      startX: 90,
      startY: 50,
      endX: 88,
      endY: 20,
    },
    {
      icon: FileCode,
      delay: 1.5,
      duration: 7,
      startX: 15,
      startY: 80,
      endX: 20,
      endY: 25,
    },
    {
      icon: FileCheck,
      delay: 2.5,
      duration: 9,
      startX: 88,
      startY: 80,
      endX: 85,
      endY: 35,
    },
    {
      icon: Cloud,
      delay: 3,
      duration: 10,
      startX: 8,
      startY: 40,
      endX: 12,
      endY: 70,
    },
    {
      icon: Server,
      delay: 1.8,
      duration: 8,
      startX: 92,
      startY: 35,
      endX: 90,
      endY: 65,
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
              transform: translate(20px, -30px) rotate(5deg) scale(1.1);
            }
            50% {
              transform: translate(-15px, -60px) rotate(-5deg) scale(0.95);
            }
            75% {
              transform: translate(25px, -40px) rotate(3deg) scale(1.05);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }

          .animate-scale-in {
            animation: scaleIn 0.8s ease-out forwards;
          }

          .glow-text {
            text-shadow: 0 0 40px rgba(250, 7, 7, 0.3);
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
      <main>
        <section className="relative bg-linear-to-b to-muted from-background min-h-[90vh] flex items-center overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 hero-gradient pointer-events-none" />

          {/* Floating icons */}
          {mounted &&
            floatingIcons.map((props, index) => (
              <FloatingIcon key={index} {...props} />
            ))}

          {/* Main content */}
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
            <div className="items-center space-y-8">
              {/* Badge */}
              <div className="hidden md:inline-flex animate-scale-in items-center gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Decentralized & Secure
                </span>
              </div>

              {/* Main heading */}
              <h1 className="animate-fade-in-up text-balance text-4xl font-bold md:text-7xl tracking-tight leading-[1.2] [animation-delay:200ms]">
                Encrypt & Store Your Files on{" "}
                <span className="glow-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  Blockchain
                </span>
              </h1>

              {/* Subheading */}
              <div className="animate-fade-in-up text-lg md:text-2xl text-muted-foreground mt-6 mb-8 max-w-3xl mx-auto [animation-delay:400ms]">
                <HeroTextLoop />
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up flex gap-4 justify-center items-center [animation-delay:600ms]">
                <SignInButton
                  label="Get Started"
                  connectButtonStyle={{
                    fontSize: "0.875rem sm:text-base",
                    fontWeight: "bold",
                    color: "var(--background)",
                    backgroundColor: "var(--primary)",
                    border: "2px solid var(--border)",
                    height: "2.25rem",
                    minWidth: "auto",
                    borderRadius: "0.7rem",
                  }}
                  termsOfServiceUrl="https://fileit01.vercel.app"
                  privacyPolicyUrl="https://fileit01.vercel.app"
                />

                <Button
                  asChild
                  variant="outline"
                  className="md:px-8 py-4 bg-card border-2 border-border rounded-lg font-semibold md:text-lg hover:border-primary transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Link to="/docs"> Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto [animation-delay:800ms]">
                <div className="text-center">
                  <div className="text-xl md:text-4xl font-bold text-primary">
                    Private
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Encrypted Access
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-4xl font-bold text-primary">
                    Integrity
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Blockchain Verified
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-4xl font-bold text-primary">
                    Access
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    IPFS Network
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
      </main>
    </>
  );
}
