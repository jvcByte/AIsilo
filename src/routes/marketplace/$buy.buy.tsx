import { createFileRoute } from "@tanstack/react-router";
import { ModelBuy } from "@/components/pages/model-buy";
export const Route = createFileRoute("/marketplace/$buy/buy")({
  component: ModelBuy,
});
