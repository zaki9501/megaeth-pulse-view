
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChainOpsOverview } from "@/components/dashboard/ChainOpsOverview";
import { DAppLeaderboard } from "@/components/dashboard/DAppLeaderboard";
import { WhaleTracker } from "@/components/dashboard/WhaleTracker";
import { WalletPortfolio } from "@/components/portfolio/WalletPortfolio";
import { ContractExplorer } from "@/components/contract/ContractExplorer";
import { WalletVisualizer } from "@/components/visualizer/WalletVisualizer";
import { DeveloperTools } from "@/components/dashboard/DeveloperTools";

const Index = () => {
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

  const renderContent = () => {
    switch (activeTab) {
      case "chain-ops":
        return <ChainOpsOverview />;
      case "leaderboard":
        return <DAppLeaderboard />;
      case "whale-tracker":
        return <WhaleTracker />;
      case "portfolio":
        return <WalletPortfolio />;
      case "contract-tools":
        return <ContractExplorer />;
      case "visualizer":
        return <WalletVisualizer />;
      case "dev-tools":
        return <DeveloperTools />;
      default:
        return <ChainOpsOverview />;
    }
  };

  return (
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
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
