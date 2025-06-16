
import { useState, useEffect } from "react";
import { Search, Zap, Activity, Target, Shield, Eye } from "lucide-react";
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

export const TransactionVisualizer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
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
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="glass-morphism cyber-border neon-glow">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl text-green-100/90 flex items-center space-x-2">
            <Search size={20} />
            <span>Transaction Address Analyzer</span>
          </CardTitle>
          <p className="text-green-400/60 text-sm">
            Enter any wallet address to analyze transaction patterns and activity
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
                <Input
                  placeholder="0x742d35Cc6634C0532925a3b8D85B62B1fBaDbD61"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 glass-morphism cyber-border text-green-100/90 placeholder-green-400/40 text-base sm:text-lg rounded-lg focus:ring-2 focus:ring-green-500/70 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleWalletSearch()}
                />
                {isScanning && (
                  <div className="absolute bottom-0 left-0 h-1 bg-green-500/80 rounded-full transition-all duration-300 neon-glow" 
                       style={{ width: `${scanProgress}%` }} />
                )}
              </div>
            </div>
            <Button 
              onClick={handleWalletSearch}
              disabled={!walletAddress || isScanning}
              className="bg-green-600/80 hover:bg-green-700/80 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg h-12 sm:h-14 neon-glow hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
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
                <span className="text-green-400/60">Analysis Progress</span>
                <span className="text-green-400/80 font-semibold">{scanProgress}%</span>
              </div>
              <div className="w-full glass-morphism rounded-full h-2 sm:h-3">
                <div 
                  className="bg-green-500/80 h-2 sm:h-3 rounded-full transition-all duration-300 neon-glow"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-green-400/60">
                Scanning blockchain for transaction history and patterns...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {walletData ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Hologram Wallet Card */}
          <HologramCard walletData={walletData} />

          {/* Activity & Intelligence Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="glass-morphism cyber-border neon-glow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                  <Activity size={20} />
                  <span>Transaction Activity</span>
                  <Badge variant="outline" className="border-green-500/70 text-green-400/80 ml-auto text-xs bg-green-500/5">
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
                <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                  <Zap size={20} />
                  <span>Gas Usage Analysis</span>
                  <Badge variant="outline" className="border-orange-500/70 text-orange-400/80 ml-auto text-xs bg-orange-500/5">
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
              <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                <Target size={20} />
                <span>Network Connections</span>
                <Badge variant="outline" className="border-blue-500/70 text-blue-400/80 ml-auto text-xs bg-blue-500/5">
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
              <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                <Activity size={20} />
                <span>Recent Transactions</span>
                <Badge variant="outline" className="border-purple-500/70 text-purple-400/80 ml-auto text-xs bg-purple-500/5">
                  Detailed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionLog walletAddress={walletData.address} />
            </CardContent>
          </Card>
        </div>
      ) : !isScanning ? (
        <Card className="glass-morphism cyber-border neon-glow">
          <CardContent className="p-8 sm:p-16 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-600/80 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 neon-glow">
              <Eye className="text-white" size={32} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400/90 via-emerald-400/90 to-lime-400/90 bg-clip-text text-transparent mb-3 sm:mb-4">
              Transaction Explorer
            </h3>
            <p className="text-green-400/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Analyze any Ethereum address with comprehensive transaction insights including history, 
              balance tracking, smart contract interactions, and network activity patterns.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
