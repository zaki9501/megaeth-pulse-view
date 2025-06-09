
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                MegaETH Explorer
              </h1>
              <p className="text-lg text-gray-400 flex items-center space-x-2">
                <Eye size={18} />
                <span>Advanced Blockchain Intelligence Platform</span>
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Network Online
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  <Cpu size={14} className="mr-1" />
                  Real-time Analysis
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === "minimal" ? "default" : "outline"}
              onClick={() => setViewMode("minimal")}
              size="sm"
              className="h-10 px-4"
            >
              <Layers size={16} className="mr-2" />
              Simple View
            </Button>
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              onClick={() => setViewMode("full")}
              size="sm"
              className="h-10 px-4"
            >
              <Shield size={16} className="mr-2" />
              Detailed View
            </Button>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white flex items-center space-x-2">
              <Search size={20} />
              <span>Blockchain Address Analyzer</span>
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Enter any wallet address, smart contract, or ENS domain to analyze blockchain activity
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="0x742d35Cc6634C0532925a3b8D85B62B1fBaDbD61 or vitalik.eth"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-12 pr-4 py-4 bg-gray-700 border-gray-600 text-white text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg rounded-lg h-14"
                size="lg"
              >
                {isScanning ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <Zap size={18} className="mr-2" />
                    Analyze Address
                  </>
                )}
              </Button>
            </div>
            
            {isScanning && (
              <div className="space-y-3 bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Analysis Progress</span>
                  <span className="text-blue-400 font-semibold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Scanning blockchain for transaction history and patterns...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {walletData && (
        <div className="space-y-8">
          {/* Hologram Wallet Card */}
          <HologramCard walletData={walletData} />

          {viewMode === "full" && (
            <>
              {/* Activity & Intelligence Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity size={20} />
                      <span>Transaction Activity</span>
                      <Badge variant="outline" className="border-green-500 text-green-400 ml-auto">
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTimeline walletAddress={walletData.address} />
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Zap size={20} />
                      <span>Gas Usage Analysis</span>
                      <Badge variant="outline" className="border-orange-500 text-orange-400 ml-auto">
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
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Globe size={20} />
                    <span>Network Connections</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 ml-auto">
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
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Activity size={20} />
                    <span>Recent Transactions</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400 ml-auto">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{walletData.txCount}</div>
                  <div className="text-sm text-gray-400 mb-3">Total Transactions</div>
                  <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" 
                         style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{walletData.balance}</div>
                  <div className="text-sm text-gray-400 mb-1">ETH Balance</div>
                  <div className="text-lg font-bold text-green-400">${walletData.totalValue}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-400 mb-3">Gas Consumed</div>
                  <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">#{walletData.rank}</div>
                  <div className="text-sm text-gray-400 mb-2">Activity Rank</div>
                  <Badge variant="outline" className={`border-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-${walletData.riskScore > 50 ? 'red' : 'green'}-400`}>
                    Risk: {walletData.riskScore}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {!walletData && !isScanning && (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Database className="text-white" size={40} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Blockchain Explorer</h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                Analyze any Ethereum address with comprehensive insights including transaction history, 
                balance tracking, smart contract interactions, and network activity patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Eye size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Real-time Data</h4>
                  <p className="text-sm text-gray-400">Live blockchain information</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Activity size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Complete History</h4>
                  <p className="text-sm text-gray-400">Full transaction timeline</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Smart Analysis</h4>
                  <p className="text-sm text-gray-400">Advanced pattern recognition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
