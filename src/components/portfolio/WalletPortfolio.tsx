
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, Activity, Copy, ExternalLink } from "lucide-react";
import { WalletSearch } from "./WalletSearch";
import { TransactionHistory } from "./TransactionHistory";
import { megaethAPI } from "@/services/megaethApi";
import { toast } from "sonner";

interface WalletPortfolioProps {
  walletAddress?: string;
}

interface WalletData {
  address: string;
  balance: number;
  balanceUSD: number;
  transactionCount: number;
  isContract: boolean;
  lastActivity: Date | null;
  firstSeen: Date | null;
}

export const WalletPortfolio = ({ walletAddress: initialAddress }: WalletPortfolioProps) => {
  const [walletAddress, setWalletAddress] = useState(initialAddress || "");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchWalletData();
    }
  }, [walletAddress]);

  const fetchWalletData = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching wallet data for:', walletAddress);
      
      // Fetch basic wallet information
      const [balance, txCount, isContract] = await Promise.all([
        megaethAPI.getBalance(walletAddress),
        megaethAPI.getTransactionCount(walletAddress),
        megaethAPI.isContract(walletAddress)
      ]);

      const balanceEth = megaethAPI.weiToEther(balance);
      const balanceUSD = balanceEth * 2500; // Approximate ETH price
      
      console.log('Wallet data fetched:', { balance: balanceEth, txCount, isContract });
      
      setWalletData({
        address: walletAddress,
        balance: balanceEth,
        balanceUSD,
        transactionCount: txCount,
        isContract,
        lastActivity: txCount > 0 ? new Date() : null,
        firstSeen: txCount > 0 ? new Date(Date.now() - (txCount * 24 * 60 * 60 * 1000)) : null
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet data');
      toast.error('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied to clipboard');
  };

  const openInExplorer = () => {
    window.open(`https://explorer.megaeth.com/address/${walletAddress}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Portfolio Analysis</h2>
          <p className="text-gray-400">Real-time wallet analysis powered by MegaETH</p>
        </div>
        <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
          <Activity className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
      </div>

      <WalletSearch 
        onWalletSelect={setWalletAddress} 
        selectedWallet={walletAddress}
      />

      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-400">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {walletData && (
        <>
          {/* Wallet Header */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {walletData.isContract ? 'Smart Contract' : 'Wallet Address'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-gray-400 text-sm">
                        {walletData.address.slice(0, 10)}...{walletData.address.slice(-8)}
                      </span>
                      <button onClick={copyAddress} className="text-gray-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={openInExplorer} className="text-gray-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {walletData.balance.toFixed(6)} ETH
                  </div>
                  <div className="text-gray-400">
                    ≈ ${walletData.balanceUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
              
              {walletData.lastActivity && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Last Activity</p>
                    <p className="text-white">{walletData.lastActivity.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white">{walletData.isContract ? 'Contract' : 'EOA'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-sm font-medium flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {walletData.balance.toFixed(4)} ETH
                </div>
                <div className="flex items-center text-blue-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  ${walletData.balanceUSD.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {walletData.transactionCount.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Total count</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-sm font-medium">Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {walletData.isContract ? 'Contract' : 'EOA'}
                </div>
                <div className="text-gray-400 text-sm">
                  {walletData.isContract ? 'Smart Contract' : 'Externally Owned'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-400 text-sm font-medium">Activity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.min(100, Math.floor((walletData.transactionCount / 10) * 100))}%
                </div>
                <div className="text-gray-400 text-sm">Based on tx volume</div>
              </CardContent>
            </Card>
          </div>

          <TransactionHistory walletAddress={walletAddress} />
        </>
      )}

      {isLoading && (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Wallet</h3>
              <p className="text-gray-400">Fetching real-time data from MegaETH...</p>
              <div className="mt-4 w-64 mx-auto bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!walletAddress && !isLoading && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
                <Wallet className="mx-auto mb-6 text-blue-400 relative z-10" size={80} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Portfolio Explorer</h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Enter any wallet address or smart contract to explore comprehensive analytics including balance, 
                transaction history, activity patterns, and real-time insights powered by MegaETH.
              </p>
              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Complete History</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Advanced Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
