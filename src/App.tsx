import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Layout/Sidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NewCalculation from "./pages/NewCalculation";
import CalculationResults from "./pages/CalculationResults";
import History from "./pages/History";
import Settings from "./pages/Settings";
import About from "./pages/About";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes - no sidebar */}
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected routes - with sidebar */}
          <Route path="/*" element={
            <div className="flex min-h-screen w-full">
              <Sidebar />
              <div className="flex-1 w-full">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-calculation" element={<NewCalculation />} />
                  <Route path="/results" element={<CalculationResults />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
