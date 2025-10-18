import { CopyPaste } from "@/components/pages/copy-past";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/copy-paste")({
  component: CopyPaste,
});
