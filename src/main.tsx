import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

//Import the router for simplicity
import { BrowserRouter as Router } from "react-router";
//Import the queryclient on the parent for tanstack query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastContainer } from "react-toastify";

//initialize query client
const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
