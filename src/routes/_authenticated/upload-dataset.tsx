import { createFileRoute } from "@tanstack/react-router";
import { UploadDataset } from "@/components/pages/upload-dataset";

export const Route = createFileRoute("/_authenticated/upload-dataset")({
  component: UploadDataset,
});
