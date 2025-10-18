import { UploadModel } from "@/components/pages/upload-model";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/upload-model")({
  component: UploadModel,
});
