
import { useState } from "react";
import { WalletPortfolio } from "@/components/portfolio/WalletPortfolio";
import { TransactionHistory } from "@/components/portfolio/TransactionHistory";
import { WalletSearch } from "@/components/portfolio/WalletSearch";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">
          Portfolio Explorer
        </h1>
      </div>

      {/* Wallet Search */}
      <WalletSearch 
        onWalletSelect={setSelectedWallet}
        selectedWallet={selectedWallet}
      />

      {/* Tab Navigation */}
      <div className="flex space-x-1 professional-card p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "portfolio"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "transactions"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
        >
          Transaction History
        </button>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Portfolio;
