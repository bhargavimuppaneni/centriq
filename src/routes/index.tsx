import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({
      to: "/",
      replace: true,
    });
  },
});

function RouteComponent() {
  return null;
}
