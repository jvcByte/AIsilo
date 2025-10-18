import { createFileRoute } from "@tanstack/react-router";
import { ModelDetailsPage } from "@/components/pages/model-details";

export const Route = createFileRoute("/marketplace/$id")({
  component: ModelDetailsPage,
});
