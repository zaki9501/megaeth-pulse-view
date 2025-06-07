
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, TrendingUp, Zap } from "lucide-react";

interface WalletData {
  address: string;
  balance: string;
  gasUsed: number;
  txCount: number;
  rank: number;
  isActive: boolean;
}

interface HologramCardProps {
  walletData: WalletData;
}

export const HologramCard = ({ walletData }: HologramCardProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hologram Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl transition-opacity duration-1000 ${pulse ? 'opacity-100' : 'opacity-50'}`} />
      
      <Card className="relative bg-gradient-to-br from-gray-900/90 to-purple-900/30 border-2 border-purple-500/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center transition-all duration-1000 ${pulse ? 'scale-110 shadow-lg shadow-purple-500/50' : 'scale-100'}`}>
                  <Wallet className="text-white" size={24} />
                </div>
                {walletData.isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-white font-mono text-lg mb-1">
                  {walletData.address.slice(0, 8)}...{walletData.address.slice(-6)}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    <Activity size={12} className="mr-1" />
                    ACTIVE
                  </Badge>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    RANK #{walletData.rank}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {walletData.balance} ETH
              </div>
              <div className="text-gray-400 text-sm font-mono">WALLET BALANCE</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-xl font-bold text-cyan-400">{walletData.txCount}</div>
              <div className="text-xs text-gray-400 font-mono">TRANSACTIONS</div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
              </div>
            </div>

            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-xl font-bold text-orange-400">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-400 font-mono">GAS USED</div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-center space-x-1 text-xl font-bold text-green-400">
                <TrendingUp size={16} />
                <span>+12%</span>
              </div>
              <div className="text-xs text-gray-400 font-mono">24H ACTIVITY</div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* Scanning Lines Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-1 animate-pulse" style={{ top: '30%' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-1 animate-pulse" style={{ top: '70%', animationDelay: '1s' }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
