
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, TrendingUp, Zap, Shield, Target, Globe } from "lucide-react";

interface WalletData {
  address: string;
  balance: string;
  gasUsed: number;
  txCount: number;
  rank: number;
  isActive: boolean;
  isContract?: boolean;
  totalValue?: string;
  riskScore?: number;
}

interface HologramCardProps {
  walletData: WalletData;
}

export const HologramCard = ({ walletData }: HologramCardProps) => {
  const [pulse, setPulse] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1500);
    }, 4000);

    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(scanInterval);
    };
  }, []);

  const getRiskColor = () => {
    if (!walletData.riskScore) return "green";
    if (walletData.riskScore > 70) return "red";
    if (walletData.riskScore > 40) return "yellow";
    return "green";
  };

  return (
    <div className="relative">
      {/* Enhanced Hologram Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 rounded-lg blur-2xl transition-all duration-2000 ${pulse ? 'opacity-100 scale-110' : 'opacity-60 scale-100'}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rounded-lg animate-pulse" />
      
      <Card className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/40 border-2 border-purple-500/60 backdrop-blur-sm overflow-hidden shadow-2xl">
        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse" />
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
            style={{ top: `${scanLine}%`, transition: 'top 0.05s linear' }}
          />
          <div 
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"
            style={{ top: `${(scanLine + 30) % 100}%`, transition: 'top 0.05s linear' }}
          />
        </div>
        
        <CardContent className="p-8 relative z-10">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full flex items-center justify-center transition-all duration-2000 ${pulse ? 'scale-125 shadow-2xl shadow-purple-500/50' : 'scale-100'}`}>
                  {walletData.isContract ? <Globe className="text-white" size={32} /> : <Wallet className="text-white" size={32} />}
                </div>
                
                {/* Status Indicators */}
                {walletData.isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                )}
                
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Shield size={12} className="text-white" />
                </div>
              </div>
              
              <div>
                <div className="text-white font-mono text-xl mb-2 tracking-wider">
                  {walletData.address.slice(0, 10)}...{walletData.address.slice(-8)}
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="border-green-500 text-green-400 font-mono">
                    <Activity size={14} className="mr-1" />
                    {walletData.isContract ? 'CONTRACT' : 'WALLET'}
                  </Badge>
                  <Badge variant="outline" className="border-purple-500 text-purple-400 font-mono">
                    <Target size={14} className="mr-1" />
                    RANK #{walletData.rank}
                  </Badge>
                  {walletData.riskScore && (
                    <Badge variant="outline" className={`border-${getRiskColor()}-500 text-${getRiskColor()}-400 font-mono`}>
                      <Shield size={14} className="mr-1" />
                      RISK {walletData.riskScore}%
                    </Badge>
                  )}
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  BLOCKCHAIN ENTITY • ID: {walletData.address.slice(-12)}
                </div>
              </div>
            </div>

            {/* Balance Display */}
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {walletData.balance} ETH
              </div>
              <div className="text-gray-400 text-sm font-mono mb-1">NATIVE BALANCE</div>
              {walletData.totalValue && (
                <div className="text-2xl font-bold text-green-400">
                  ${walletData.totalValue} USD
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-5 bg-gray-800/60 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-center mb-3">
                <Activity className="text-cyan-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">{walletData.txCount}</div>
              <div className="text-xs text-gray-400 font-mono mb-3">TRANSACTIONS</div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full animate-pulse" 
                     style={{ width: `${Math.min(walletData.txCount * 2, 100)}%` }} />
              </div>
            </div>

            <div className="text-center p-5 bg-gray-800/60 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-center mb-3">
                <Zap className="text-orange-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">{(walletData.gasUsed / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-400 font-mono mb-3">GAS USED</div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="text-center p-5 bg-gray-800/60 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">+{Math.floor(Math.random() * 50 + 10)}%</div>
              <div className="text-xs text-gray-400 font-mono mb-3">24H ACTIVITY</div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="text-center p-5 bg-gray-800/60 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-center mb-3">
                <Shield className={`text-${getRiskColor()}-400`} size={24} />
              </div>
              <div className={`text-2xl font-bold text-${getRiskColor()}-400 mb-1`}>
                {walletData.riskScore || Math.floor(Math.random() * 100)}
              </div>
              <div className="text-xs text-gray-400 font-mono mb-3">RISK SCORE</div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div className={`h-full bg-gradient-to-r from-${getRiskColor()}-500 to-${getRiskColor()}-400 rounded-full`} 
                     style={{ width: `${walletData.riskScore || 30}%` }} />
              </div>
            </div>
          </div>

          {/* Security Status Bar */}
          <div className="mt-6 p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="text-blue-400" size={20} />
                <span className="text-blue-400 font-mono text-sm">SECURITY STATUS</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-green-400 text-green-400">
                  VERIFIED
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-400">
                  MONITORED
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-400">
                  ANALYZED
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
