import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/components/layout/authed-layout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          path: location.href,
        },
      });
    }
  },
  component: () => <AuthenticatedLayout />,
});
