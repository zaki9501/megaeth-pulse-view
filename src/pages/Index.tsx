
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating Particles */}
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      {/* Main Content with Glass Effect */}
      <div className="relative z-10">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        <div
          className={`transition-all duration-500 ease-in-out ${
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <Header />
          <main className="p-3 sm:p-6">
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
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
