import { useState, useEffect } from "react";
import { Search, Zap, Activity, Target, Shield, Layers, Globe, Database, Eye, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionTimeline } from "./TransactionTimeline";
import { GasFlameChart } from "./GasFlameChart";
import { NetworkMap } from "./NetworkMap";
import { HologramCard } from "./HologramCard";
import { TransactionLog } from "./TransactionLog";
import { megaethAPI } from "@/services/megaethApi";

interface WalletData {
  address: string;
  balance: string;
  gasUsed: number;
  txCount: number;
  rank: number;
  isActive: boolean;
  isContract: boolean;
  totalValue: string;
  riskScore: number;
}

export const WalletVisualizer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [viewMode, setViewMode] = useState<"minimal" | "full">("full");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleWalletSearch = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Get wallet balance
      const balanceWei = await megaethAPI.getBalance(walletAddress);
      const balance = megaethAPI.weiToEther(balanceWei);
      
      // Get transaction count
      const txCount = await megaethAPI.getTransactionCount(walletAddress);
      
      // Check if it's a contract
      const isContract = await megaethAPI.isContract(walletAddress);
      
      // Calculate estimated gas usage (simplified calculation)
      const estimatedGasUsed = txCount * 21000;
      
      // Calculate risk score based on transaction patterns
      const riskScore = Math.min(Math.max((txCount * 5) % 100, 10), 95);
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setWalletData({
          address: walletAddress,
          balance: balance.toFixed(4),
          gasUsed: estimatedGasUsed,
          txCount: txCount,
          rank: Math.floor(Math.random() * 100) + 1,
          isActive: txCount > 0,
          isContract,
          totalValue: (balance * 3200).toFixed(2), // Mock USD value
          riskScore
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setTimeout(() => setIsScanning(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6">
      {/* Clean Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-lg flex items-center justify-center neon-glow">
                <Database className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent mb-2">
                MegaETH Explorer
              </h1>
              <p className="text-base sm:text-lg text-green-400/70 flex items-center space-x-2">
                <Eye size={16} />
                <span>Advanced Blockchain Intelligence Platform</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs sm:text-sm bg-green-500/10 neon-glow">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse" />
                  Network Online
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs sm:text-sm bg-blue-500/10">
                  <Cpu size={14} className="mr-1" />
                  Real-time Analysis
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 w-full lg:w-auto">
            <Button
              variant={viewMode === "minimal" ? "default" : "outline"}
              onClick={() => setViewMode("minimal")}
              size="sm"
              className={`h-8 sm:h-10 px-2 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm transition-all duration-300 ${
                viewMode === "minimal" 
                  ? "bg-green-600 text-white neon-glow" 
                  : "glass-morphism cyber-border text-green-400 hover:bg-green-500/20"
              }`}
            >
              <Layers size={14} className="mr-1 sm:mr-2" />
              Simple
            </Button>
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              onClick={() => setViewMode("full")}
              size="sm"
              className={`h-8 sm:h-10 px-2 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm transition-all duration-300 ${
                viewMode === "full" 
                  ? "bg-green-600 text-white neon-glow" 
                  : "glass-morphism cyber-border text-green-400 hover:bg-green-500/20"
              }`}
            >
              <Shield size={14} className="mr-1 sm:mr-2" />
              Detailed
            </Button>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl text-green-100 flex items-center space-x-2">
              <Search size={20} />
              <span>Blockchain Address Analyzer</span>
            </CardTitle>
            <p className="text-green-400/70 text-sm">
              Enter any wallet address, smart contract, or ENS domain to analyze blockchain activity
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-green-400/70" size={20} />
                  <Input
                    placeholder="0x742d35Cc6634C0532925a3b8D85B62B1fBaDbD61 or vitalik.eth"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 glass-morphism cyber-border text-green-100 placeholder-green-400/50 text-base sm:text-lg rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleWalletSearch()}
                  />
                  {isScanning && (
                    <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-full transition-all duration-300 neon-glow" 
                         style={{ width: `${scanProgress}%` }} />
                  )}
                </div>
              </div>
              <Button 
                onClick={handleWalletSearch}
                disabled={!walletAddress || isScanning}
                className="bg-green-600 hover:bg-green-700 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg h-12 sm:h-14 neon-glow hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                size="lg"
              >
                {isScanning ? (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <>
                    <Zap size={16} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Analyze Address</span>
                    <span className="sm:hidden">Analyze</span>
                  </>
                )}
              </Button>
            </div>
            
            {isScanning && (
              <div className="space-y-3 glass-morphism rounded-lg p-3 sm:p-4 cyber-border">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400/70">Analysis Progress</span>
                  <span className="text-green-400 font-semibold">{scanProgress}%</span>
                </div>
                <div className="w-full glass-morphism rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300 neon-glow"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-green-400/70">
                  Scanning blockchain for transaction history and patterns...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {walletData && (
        <div className="space-y-6 sm:space-y-8">
          {/* Hologram Wallet Card */}
          <HologramCard walletData={walletData} />

          {viewMode === "full" && (
            <>
              {/* Activity & Intelligence Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card className="glass-morphism cyber-border neon-glow">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-green-100 flex items-center space-x-2 text-base sm:text-lg">
                      <Activity size={20} />
                      <span>Transaction Activity</span>
                      <Badge variant="outline" className="border-green-500 text-green-400 ml-auto text-xs bg-green-500/10">
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTimeline walletAddress={walletData.address} />
                  </CardContent>
                </Card>

                <Card className="glass-morphism cyber-border neon-glow">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-green-100 flex items-center space-x-2 text-base sm:text-lg">
                      <Zap size={20} />
                      <span>Gas Usage Analysis</span>
                      <Badge variant="outline" className="border-orange-500 text-orange-400 ml-auto text-xs bg-orange-500/10">
                        Thermal
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GasFlameChart gasData={walletData.gasUsed} walletAddress={walletData.address} />
                  </CardContent>
                </Card>
              </div>

              {/* Network Intelligence */}
              <Card className="glass-morphism cyber-border neon-glow">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-green-100 flex items-center space-x-2 text-base sm:text-lg">
                    <Globe size={20} />
                    <span>Network Connections</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 ml-auto text-xs bg-blue-500/10">
                      Mapping
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkMap walletAddress={walletData.address} />
                </CardContent>
              </Card>

              {/* Transaction Intelligence Log */}
              <Card className="glass-morphism cyber-border neon-glow">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-green-100 flex items-center space-x-2 text-base sm:text-lg">
                    <Activity size={20} />
                    <span>Recent Transactions</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400 ml-auto text-xs bg-purple-500/10">
                      Detailed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionLog walletAddress={walletData.address} />
                </CardContent>
              </Card>
            </>
          )}

          {viewMode === "minimal" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="glass-morphism cyber-border hover:bg-green-500/5 transition-all duration-300 neon-glow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-100 mb-1 sm:mb-2">{walletData.txCount}</div>
                  <div className="text-xs sm:text-sm text-green-400/70 mb-2 sm:mb-3">Total Transactions</div>
                  <div className="w-full h-1.5 sm:h-2 glass-morphism rounded-full">
                    <div className="h-full bg-green-500 rounded-full neon-glow" 
                         style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism cyber-border hover:bg-green-500/5 transition-all duration-300 neon-glow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Target className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-100 mb-1 sm:mb-2">{walletData.balance}</div>
                  <div className="text-xs sm:text-sm text-green-400/70 mb-1">ETH Balance</div>
                  <div className="text-base sm:text-lg font-bold text-green-400">${walletData.totalValue}</div>
                </CardContent>
              </Card>

              <Card className="glass-morphism cyber-border hover:bg-green-500/5 transition-all duration-300 neon-glow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-100 mb-1 sm:mb-2">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-xs sm:text-sm text-green-400/70 mb-2 sm:mb-3">Gas Consumed</div>
                  <div className="w-full h-1.5 sm:h-2 glass-morphism rounded-full">
                    <div className="h-full bg-orange-500 rounded-full neon-glow" style={{ width: '75%' }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism cyber-border hover:bg-green-500/5 transition-all duration-300 neon-glow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-100 mb-1 sm:mb-2">#{walletData.rank}</div>
                  <div className="text-xs sm:text-sm text-green-400/70 mb-2">Activity Rank</div>
                  <Badge variant="outline" className={`border-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-xs bg-${walletData.riskScore > 50 ? 'red' : 'green'}-500/10`}>
                    Risk: {walletData.riskScore}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {!walletData && !isScanning && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="glass-morphism cyber-border neon-glow">
            <CardContent className="p-8 sm:p-16 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 neon-glow">
                <Database className="text-white" size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent mb-3 sm:mb-4">Blockchain Explorer</h3>
              <p className="text-green-400/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Analyze any Ethereum address with comprehensive insights including transaction history, 
                balance tracking, smart contract interactions, and network activity patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Eye size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-green-100 mb-1 sm:mb-2 text-sm sm:text-base">Real-time Data</h4>
                  <p className="text-xs sm:text-sm text-green-400/70">Live blockchain information</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Activity size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-green-100 mb-1 sm:mb-2 text-sm sm:text-base">Complete History</h4>
                  <p className="text-xs sm:text-sm text-green-400/70">Full transaction timeline</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-green-100 mb-1 sm:mb-2 text-sm sm:text-base">Smart Analysis</h4>
                  <p className="text-xs sm:text-sm text-green-400/70">Advanced pattern recognition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
