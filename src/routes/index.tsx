import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard",
      replace: true,
    });
  },
});

function RouteComponent() {
  return null;
}
