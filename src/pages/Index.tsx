
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
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden matrix-bg">
      {/* Matrix-style Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Green Matrix Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Matrix Digital Rain Effect */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-green-400/60 to-transparent matrix-rain"
            style={{
              left: `${(i * 5) % 100}%`,
              height: `${Math.random() * 200 + 100}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Floating Matrix Particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent">
          <div className="h-full w-full bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        {/* Radial Matrix Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-500/5 to-black/40" />
      </div>

      {/* Main Content with Cyber Glass Effect */}
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
            <div className="glass-morphism rounded-3xl cyber-border shadow-2xl neon-glow">
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
