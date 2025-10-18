import { createFileRoute } from "@tanstack/react-router";
import { SignInButtonEmbeded } from "@/components/wallet/thirdweb-connect-btn";
import { Header } from "@/components/layout/header";
import { useActiveAccount } from "thirdweb/react";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const activeAccount = useActiveAccount();
  const search: { path: string } = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (activeAccount?.address) {
      navigate({
        to: search.path || "/dashboard",
        replace: true,
      });
    }
  }, [activeAccount?.address, search.path, navigate]);

  // Don't render anything while redirecting
  if (activeAccount?.address) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-muted to-background">
        <SignInButtonEmbeded />
      </div>
    </div>
  );
}
