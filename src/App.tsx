
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import ContractTools from "./pages/ContractTools";
import Visualizer from "./pages/Visualizer";
import AddressDetails from "./pages/AddressDetails";
import TransactionDetails from "./pages/TransactionDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("chain-ops");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Professional Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
              {/* Subtle background orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/3 to-primary/3 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-primary/2 to-accent/2 rounded-full blur-3xl" />
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/1 to-transparent">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
              </div>
              
              {/* Professional radial gradient */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/1 to-background/80" />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
              
              <div
                className={`transition-all duration-300 ease-out ${
                  isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
                }`}
              >
                <Header />
                <main className="p-4 sm:p-6">
                  <div className="professional-card professional-shadow bg-card/50 backdrop-blur-sm">
                    <div className="p-6">
                      <Routes>
                        <Route path="/" element={<Index activeTab={activeTab} />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/contract-tools" element={<ContractTools />} />
                        <Route path="/visualizer" element={<Visualizer />} />
                        <Route path="/address/:address" element={<AddressDetails />} />
                        <Route path="/transaction/:hash" element={<TransactionDetails />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
