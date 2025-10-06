import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2 bg-gradient-to-tl from-muted to-background">
      Hello from About!
    </div>
  );
}
