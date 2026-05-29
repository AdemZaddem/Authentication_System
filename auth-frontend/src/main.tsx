import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./store/authStore.ts";

const queryClient = new QueryClient();


const token = localStorage.getItem('token')
if(token){
  useAuthStore.getState().setAuth(token)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    
      <App />
     
    </QueryClientProvider>
  </StrictMode>,
);
