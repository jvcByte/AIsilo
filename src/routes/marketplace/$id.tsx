import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <div>Hello marketplace/${id} !</div>;
}
