
import { useState } from "react";
import { WalletPortfolio } from "@/components/portfolio/WalletPortfolio";
import { TransactionHistory } from "@/components/portfolio/TransactionHistory";
import { WalletSearch } from "@/components/portfolio/WalletSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Wallet, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Portfolio Explorer
              </h1>
              <p className="text-muted-foreground text-lg">
                Comprehensive wallet analysis and transaction tracking powered by MegaETH
              </p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/10 animate-pulse">
              <Activity className="w-4 h-4 mr-2" />
              Live Analytics
            </Badge>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="professional-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Wallets</p>
                    <p className="text-2xl font-bold text-foreground">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold text-foreground">$2.4M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card bg-gradient-to-br from-muted/5 to-accent/5 border-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted/10 rounded-lg">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-foreground">89,432</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wallet Search */}
        <div className="mb-8">
          <WalletSearch 
            onWalletSelect={setSelectedWallet}
            selectedWallet={selectedWallet}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <Card className="professional-card p-1 w-fit">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "portfolio"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Wallet className="w-4 h-4 mr-2 inline-block" />
                Portfolio Analysis
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "transactions"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Clock className="w-4 h-4 mr-2 inline-block" />
                Transaction History
              </button>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
