import { UploadText } from "@/components/upload-text";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/upload-text")({
  component: UploadText,
});
