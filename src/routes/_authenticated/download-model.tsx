import { createFileRoute } from "@tanstack/react-router";
import { DownloadModel } from "@/components/pages/download-model";

export const Route = createFileRoute("/_authenticated/download-model")({
  component: DownloadModel,
  validateSearch: (search: Record<string, unknown>) => ({
    cid: (search.cid as string) || "",
  }),
});
