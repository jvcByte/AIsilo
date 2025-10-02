import { createFileRoute } from "@tanstack/react-router";
import DocumentationPage from "@/components/layout/documentation";

export const Route = createFileRoute("/docs")({
  component: DocumentationPage,
});
