import { Header } from "@/components/layout/header";
import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/layout/hero-section";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { AuthenticatedLayout } from "@/components/layout/authed-layout";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  const isAuthenticated = !!(activeAccount?.address && activeWallet?.id);

  if (!isAuthenticated) {
    return (
      <div className="">
        <Header />
        <HeroSection />
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <Dashboard />
    </AuthenticatedLayout>
  );
}
