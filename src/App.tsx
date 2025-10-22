import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import { AppFooter } from "./components/AppFooter";
import Landing from "./pages/Landing";
import Generate from "./pages/Generate";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <>
                <Navigation />
                <Landing />
                <AppFooter />
              </>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <Navigation />
                <Generate />
                <AppFooter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigation />
                <Dashboard />
                <AppFooter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;