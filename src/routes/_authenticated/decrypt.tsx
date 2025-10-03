import { createFileRoute } from "@tanstack/react-router";
import { DecryptFile } from "@/components/decrypt-file";

export const Route = createFileRoute("/_authenticated/decrypt")({
  component: DecryptFile,
});
