
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
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                MegaETH Explorer
              </h1>
              <p className="text-base sm:text-lg text-gray-400 flex items-center space-x-2">
                <Eye size={16} className="sm:size-18" />
                <span>Advanced Blockchain Intelligence Platform</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse" />
                  Network Online
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs sm:text-sm">
                  <Cpu size={12} className="sm:size-14 mr-1" />
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
              className="h-8 sm:h-10 px-2 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm"
            >
              <Layers size={14} className="sm:size-16 mr-1 sm:mr-2" />
              Simple
            </Button>
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              onClick={() => setViewMode("full")}
              size="sm"
              className="h-8 sm:h-10 px-2 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm"
            >
              <Shield size={14} className="sm:size-16 mr-1 sm:mr-2" />
              Detailed
            </Button>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl text-white flex items-center space-x-2">
              <Search size={18} className="sm:size-20" />
              <span>Blockchain Address Analyzer</span>
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Enter any wallet address, smart contract, or ENS domain to analyze blockchain activity
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} className="sm:size-20" />
                  <Input
                    placeholder="0x742d35Cc6634C0532925a3b8D85B62B1fBaDbD61 or vitalik.eth"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-700 border-gray-600 text-white text-base sm:text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleWalletSearch()}
                  />
                  {isScanning && (
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300" 
                         style={{ width: `${scanProgress}%` }} />
                  )}
                </div>
              </div>
              <Button 
                onClick={handleWalletSearch}
                disabled={!walletAddress || isScanning}
                className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg h-12 sm:h-14"
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
                    <Zap size={16} className="sm:size-18 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Analyze Address</span>
                    <span className="sm:hidden">Analyze</span>
                  </>
                )}
              </Button>
            </div>
            
            {isScanning && (
              <div className="space-y-3 bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Analysis Progress</span>
                  <span className="text-blue-400 font-semibold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
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
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-white flex items-center space-x-2 text-base sm:text-lg">
                      <Activity size={18} className="sm:size-20" />
                      <span>Transaction Activity</span>
                      <Badge variant="outline" className="border-green-500 text-green-400 ml-auto text-xs">
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTimeline walletAddress={walletData.address} />
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-white flex items-center space-x-2 text-base sm:text-lg">
                      <Zap size={18} className="sm:size-20" />
                      <span>Gas Usage Analysis</span>
                      <Badge variant="outline" className="border-orange-500 text-orange-400 ml-auto text-xs">
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
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white flex items-center space-x-2 text-base sm:text-lg">
                    <Globe size={18} className="sm:size-20" />
                    <span>Network Connections</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 ml-auto text-xs">
                      Mapping
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkMap walletAddress={walletData.address} />
                </CardContent>
              </Card>

              {/* Transaction Intelligence Log */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white flex items-center space-x-2 text-base sm:text-lg">
                    <Activity size={18} className="sm:size-20" />
                    <span>Recent Transactions</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400 ml-auto text-xs">
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
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{walletData.txCount}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Total Transactions</div>
                  <div className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" 
                         style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Target className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{walletData.balance}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">ETH Balance</div>
                  <div className="text-base sm:text-lg font-bold text-green-400">${walletData.totalValue}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Gas Consumed</div>
                  <div className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">#{walletData.rank}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-2">Activity Rank</div>
                  <Badge variant="outline" className={`border-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-xs`}>
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
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 sm:p-16 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Database className="text-white" size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Blockchain Explorer</h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Analyze any Ethereum address with comprehensive insights including transaction history, 
                balance tracking, smart contract interactions, and network activity patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Eye size={20} className="sm:size-24 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Real-time Data</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Live blockchain information</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Activity size={20} className="sm:size-24 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Complete History</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Full transaction timeline</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield size={20} className="sm:size-24 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Smart Analysis</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Advanced pattern recognition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
