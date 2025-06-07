
import { useState, useEffect } from "react";
import { Search, Zap, TrendingUp, Activity, Target } from "lucide-react";
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
}

export const WalletVisualizer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [viewMode, setViewMode] = useState<"minimal" | "full">("full");
  const [isScanning, setIsScanning] = useState(false);

  const handleWalletSearch = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    try {
      // Get wallet balance
      const balanceWei = await megaethAPI.getBalance(walletAddress);
      const balance = megaethAPI.weiToEther(balanceWei);
      
      // Get transaction count
      const txCount = await megaethAPI.getTransactionCount(walletAddress);
      
      // Check if it's a contract
      const isContract = await megaethAPI.isContract(walletAddress);
      
      // Calculate estimated gas usage (simplified calculation)
      const estimatedGasUsed = txCount * 21000; // Basic estimation
      
      setWalletData({
        address: walletAddress,
        balance: balance.toFixed(4),
        gasUsed: estimatedGasUsed,
        txCount: txCount,
        rank: Math.floor(Math.random() * 100) + 1, // Mock rank for now
        isActive: txCount > 0
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Command Center Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MEGAETH TRANSACTION VISUALIZER
              </h1>
              <p className="text-gray-400 text-sm font-mono">REAL-TIME BLOCKCHAIN ANALYSIS</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "minimal" ? "default" : "outline"}
              onClick={() => setViewMode("minimal")}
              className="text-xs"
            >
              MINIMAL HUD
            </Button>
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              onClick={() => setViewMode("full")}
              className="text-xs"
            >
              FULL SCANNER
            </Button>
          </div>
        </div>

        {/* Wallet Input Terminal */}
        <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <label className="text-purple-400 text-xs font-mono mb-2 block">
                  TARGET WALLET ADDRESS
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={16} />
                  <Input
                    placeholder="0x... or ENS name"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-10 bg-gray-800 border-purple-500/50 text-white font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleWalletSearch()}
                  />
                </div>
              </div>
              <Button 
                onClick={handleWalletSearch}
                disabled={!walletAddress || isScanning}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {isScanning ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SCANNING</span>
                  </div>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    ANALYZE
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {walletData && (
        <div className="space-y-6">
          {/* Hologram Wallet Card */}
          <HologramCard walletData={walletData} />

          {viewMode === "full" && (
            <>
              {/* Live Activity & Gas Usage Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">LIVE ACTIVITY STREAM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTimeline walletAddress={walletData.address} />
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/80 border-orange-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-orange-400 font-mono">GAS CONSUMPTION</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GasFlameChart gasData={walletData.gasUsed} walletAddress={walletData.address} />
                  </CardContent>
                </Card>
              </div>

              {/* Network Map */}
              <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 font-mono">NETWORK TOPOLOGY</CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkMap walletAddress={walletData.address} />
                </CardContent>
              </Card>

              {/* Transaction Log */}
              <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-400 font-mono">TRANSACTION LOG</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionLog walletAddress={walletData.address} />
                </CardContent>
              </Card>
            </>
          )}

          {viewMode === "minimal" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{walletData.txCount}</div>
                  <div className="text-xs text-gray-400 font-mono">TRANSACTIONS</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{walletData.balance}</div>
                  <div className="text-xs text-gray-400 font-mono">ETH BALANCE</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/80 border-orange-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400 font-mono">GAS USED</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">#{walletData.rank}</div>
                  <div className="text-xs text-gray-400 font-mono">ACTIVITY RANK</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
