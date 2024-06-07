import { NavBar } from "@/components/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="max-w-2xl mx-auto">
      <NavBar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}
