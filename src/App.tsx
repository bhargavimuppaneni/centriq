import React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import './App.css'

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App
