import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

//Import the router for simplicity
import { BrowserRouter as Router } from "react-router";
//Import the queryclient on the parent for tanstack query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//initialize query client
const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </StrictMode>
);
