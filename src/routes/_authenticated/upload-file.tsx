import { UploadFile } from "@/components/upload-file";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/upload-file")({
  component: UploadFile,
});
