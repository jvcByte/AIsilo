import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marketplace/$id/buy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/marketplace/$id/buy"!</div>
}
