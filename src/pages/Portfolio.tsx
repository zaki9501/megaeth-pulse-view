
import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WalletPortfolio } from "@/components/portfolio/WalletPortfolio";
import { TransactionHistory } from "@/components/portfolio/TransactionHistory";
import { WalletSearch } from "@/components/portfolio/WalletSearch";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const renderContent = () => {
    switch (activeTab) {
      case "portfolio":
        return <WalletPortfolio walletAddress={selectedWallet} />;
      case "transactions":
        return <TransactionHistory walletAddress={selectedWallet} />;
      default:
        return <WalletPortfolio walletAddress={selectedWallet} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex w-full">
      <Sidebar 
        activeTab="portfolio" 
        setActiveTab={() => {}}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
                Portfolio Explorer
              </h1>
            </div>

            {/* Wallet Search */}
            <WalletSearch 
              onWalletSelect={setSelectedWallet}
              selectedWallet={selectedWallet}
            />

            {/* Tab Navigation */}
            <div className="flex space-x-1 glass-morphism cyber-border p-1 rounded-lg w-fit neon-glow">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === "portfolio"
                    ? "bg-green-600 text-white neon-glow"
                    : "text-green-400/70 hover:text-green-300 hover:bg-green-500/20"
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === "transactions"
                    ? "bg-green-600 text-white neon-glow"
                    : "text-green-400/70 hover:text-green-300 hover:bg-green-500/20"
                }`}
              >
                Transaction History
              </button>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
