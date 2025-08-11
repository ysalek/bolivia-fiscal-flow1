
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthWrapper from "@/components/ui/auth-wrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TenantProvider from "@/components/saas/TenantProvider";
import Signup from "./pages/Signup";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TenantProvider>
            <AuthWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/suscripcion" element={<Subscription />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthWrapper>
          </TenantProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
