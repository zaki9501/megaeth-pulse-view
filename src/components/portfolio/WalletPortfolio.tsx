
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

interface WalletPortfolioProps {
  walletAddress: string;
}

interface PortfolioData {
  balance: string;
  balanceUSD: number;
  transactionCount: number;
  lastActivity: Date;
}

export const WalletPortfolio = ({ walletAddress }: WalletPortfolioProps) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchPortfolioData();
    }
  }, [walletAddress]);

  const fetchPortfolioData = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [balance, transactionCount] = await Promise.all([
        megaethAPI.getBalance(walletAddress),
        megaethAPI.getTransactionCount(walletAddress)
      ]);

      const balanceInEther = megaethAPI.weiToEther(balance);
      const balanceUSD = balanceInEther * 2500; // Mock ETH price

      setPortfolioData({
        balance: balanceInEther.toFixed(6),
        balanceUSD,
        transactionCount,
        lastActivity: new Date()
      });
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12 text-center">
          <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Wallet Selected</h3>
          <p className="text-gray-400">Search for a wallet address to view its portfolio</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-800">
        <CardContent className="p-6">
          <div className="text-red-400">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">ETH Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioData?.balance} ETH</div>
            <div className="text-sm text-gray-400">${portfolioData?.balanceUSD.toFixed(2)} USD</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioData?.transactionCount}</div>
            <div className="flex items-center text-sm text-green-400">
              <Activity size={14} className="mr-1" />
              Active wallet
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${portfolioData?.balanceUSD.toFixed(2)}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp size={14} className="mr-1" />
              +2.4% (24h)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Last Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Recent</div>
            <div className="text-sm text-gray-400">{portfolioData?.lastActivity.toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Wallet Address</label>
              <div className="font-mono text-blue-400 break-all">{walletAddress}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400">Network</label>
                <div className="font-semibold">MEGA Testnet</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Chain ID</label>
                <div className="font-semibold">6342</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
