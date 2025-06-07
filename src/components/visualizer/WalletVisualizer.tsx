
import { useState, useEffect } from "react";
import { Search, Zap, TrendingUp, Activity, Target, Shield, Layers, Globe } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
            style={{ 
              top: `${i * 5}%`, 
              left: 0, 
              right: 0,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Command Center Header */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                MEGAETH BLOCKCHAIN ANALYZER
              </h1>
              <p className="text-gray-400 text-sm font-mono flex items-center space-x-2">
                <Globe size={14} />
                <span>REAL-TIME BLOCKCHAIN INTELLIGENCE PLATFORM</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-mono text-xs">NETWORK ONLINE</span>
            </div>
            <Button
              variant={viewMode === "minimal" ? "default" : "outline"}
              onClick={() => setViewMode("minimal")}
              className="text-xs font-mono"
              size="sm"
            >
              <Layers size={14} className="mr-1" />
              MINIMAL
            </Button>
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              onClick={() => setViewMode("full")}
              className="text-xs font-mono"
              size="sm"
            >
              <Shield size={14} className="mr-1" />
              TACTICAL
            </Button>
          </div>
        </div>

        {/* Enhanced Wallet Input Terminal */}
        <Card className="bg-gray-900/90 border-purple-500/30 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6">
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <label className="text-purple-400 text-sm font-mono mb-3 block flex items-center space-x-2">
                  <Search size={16} />
                  <span>TARGET WALLET IDENTIFICATION</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                  <Input
                    placeholder="0x... or ENS domain"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-800 border-purple-500/50 text-white font-mono text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleWalletSearch()}
                  />
                  {isScanning && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300" 
                         style={{ width: `${scanProgress}%` }} />
                  )}
                </div>
              </div>
              <Button 
                onClick={handleWalletSearch}
                disabled={!walletAddress || isScanning}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-3 text-lg font-mono"
                size="lg"
              >
                {isScanning ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ANALYZING...</span>
                  </div>
                ) : (
                  <>
                    <Zap size={18} className="mr-2" />
                    INITIATE SCAN
                  </>
                )}
              </Button>
            </div>
            
            {isScanning && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">SCAN PROGRESS</span>
                  <span className="text-cyan-400">{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {walletData && (
        <div className="space-y-8 relative z-10">
          {/* Enhanced Hologram Wallet Card */}
          <HologramCard walletData={walletData} />

          {viewMode === "full" && (
            <>
              {/* Enhanced Activity & Intelligence Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gray-900/90 border-cyan-500/30 backdrop-blur-sm shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-cyan-400 font-mono flex items-center space-x-2">
                      <Activity size={20} />
                      <span>LIVE TRANSACTION STREAM</span>
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400 ml-auto">
                        REAL-TIME
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTimeline walletAddress={walletData.address} />
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/90 border-orange-500/30 backdrop-blur-sm shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-orange-400 font-mono flex items-center space-x-2">
                      <Zap size={20} />
                      <span>GAS CONSUMPTION ANALYTICS</span>
                      <Badge variant="outline" className="border-orange-400 text-orange-400 ml-auto">
                        THERMAL
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GasFlameChart gasData={walletData.gasUsed} walletAddress={walletData.address} />
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Network Intelligence */}
              <Card className="bg-gray-900/90 border-green-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-green-400 font-mono flex items-center space-x-2">
                    <Globe size={20} />
                    <span>NETWORK TOPOLOGY ANALYSIS</span>
                    <Badge variant="outline" className="border-green-400 text-green-400 ml-auto">
                      MAPPING
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkMap walletAddress={walletData.address} />
                </CardContent>
              </Card>

              {/* Enhanced Transaction Intelligence Log */}
              <Card className="bg-gray-900/90 border-purple-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-purple-400 font-mono flex items-center space-x-2">
                    <Activity size={20} />
                    <span>TRANSACTION INTELLIGENCE LOG</span>
                    <Badge variant="outline" className="border-purple-400 text-purple-400 ml-auto">
                      CLASSIFIED
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
              <Card className="bg-gray-900/90 border-cyan-500/30 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <Activity className="mx-auto mb-3 text-cyan-400" size={24} />
                  <div className="text-3xl font-bold text-cyan-400 mb-1">{walletData.txCount}</div>
                  <div className="text-xs text-gray-400 font-mono">TOTAL TRANSACTIONS</div>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-3">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" 
                         style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/90 border-purple-500/30 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <Target className="mx-auto mb-3 text-purple-400" size={24} />
                  <div className="text-3xl font-bold text-purple-400 mb-1">{walletData.balance}</div>
                  <div className="text-xs text-gray-400 font-mono">ETH BALANCE</div>
                  <div className="text-lg font-bold text-green-400 mt-1">${walletData.totalValue}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/90 border-orange-500/30 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <Zap className="mx-auto mb-3 text-orange-400" size={24} />
                  <div className="text-3xl font-bold text-orange-400 mb-1">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400 font-mono">GAS CONSUMED</div>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-3">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: '75%' }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/90 border-green-500/30 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-3 text-green-400" size={24} />
                  <div className="text-3xl font-bold text-green-400 mb-1">#{walletData.rank}</div>
                  <div className="text-xs text-gray-400 font-mono">ACTIVITY RANK</div>
                  <div className="flex items-center justify-center mt-2">
                    <Badge variant="outline" className={`border-${walletData.riskScore > 50 ? 'red' : 'green'}-400 text-${walletData.riskScore > 50 ? 'red' : 'green'}-400`}>
                      RISK: {walletData.riskScore}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
