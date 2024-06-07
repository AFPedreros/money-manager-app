import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <main className="min-h-screen w-full bg-background text-foreground dark">
          <RouterProvider router={router} />
          <Toaster richColors />
        </main>
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
