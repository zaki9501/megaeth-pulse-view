
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
    <div className="min-h-screen bg-black text-green-300 relative overflow-hidden">
      {/* Subtle Light Green Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {/* Light Green Subtle Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-300/5 to-emerald-300/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-300/5 to-green-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-lime-300/4 to-green-300/4 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Very Subtle Matrix Digital Rain Effect */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-green-300/15 to-transparent matrix-rain"
            style={{
              left: `${(i * 8) % 100}%`,
              height: `${Math.random() * 120 + 60}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Subtle Floating Particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-300/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Light Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/2 to-transparent">
          <div className="h-full w-full bg-[linear-gradient(rgba(134,239,172,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(134,239,172,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>
        
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-300/2 to-black/80" />
      </div>

      {/* Main Content with Enhanced Black Glass Effect */}
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
            <div className="glass-morphism rounded-3xl cyber-border shadow-2xl bg-black/30">
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
