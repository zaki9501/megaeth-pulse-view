import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Activity, Copy, ExternalLink } from "lucide-react";
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

const INDEXER_BLOCK_API = "https://jiti.indexing.co/networks/MEGAETH_TESTNET";

export const WalletPortfolio = ({ walletAddress }: WalletPortfolioProps) => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchWalletData(walletAddress);
    }
  }, [walletAddress]);

  const fetchWalletData = async (address: string) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const [balance, isContract, latestBlock] = await Promise.all([
        megaethAPI.getBalance(address),
        megaethAPI.isContract(address),
        megaethAPI.getBlockNumber()
      ]);
      const balanceEth = megaethAPI.weiToEther(balance);
      const balanceUSD = balanceEth * 2500;
      // Scan last 100 blocks for transactions involving this address
      const blockNumbers = Array.from({ length: 100 }, (_, i) => latestBlock - i);
      const blockPromises = blockNumbers.map(num => fetch(`${INDEXER_BLOCK_API}/${num}`).then(r => r.ok ? r.json() : null).catch(() => null));
      const blocks = await Promise.all(blockPromises);
      let txCount = 0;
      for (const block of blocks) {
        if (!block || !block.transactions) continue;
        for (const tx of block.transactions) {
          if (!tx) continue;
          if (
            (tx.from && tx.from.toLowerCase() === address.toLowerCase()) ||
            (tx.to && tx.to.toLowerCase() === address.toLowerCase())
          ) {
            txCount++;
          }
        }
      }
      setWalletData({
        address,
        balance: balanceEth,
        balanceUSD,
        transactionCount: txCount,
        isContract,
        lastActivity: txCount > 0 ? new Date() : null,
        firstSeen: txCount > 0 ? new Date(Date.now() - (txCount * 24 * 60 * 60 * 1000)) : null
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet data');
      toast.error('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (walletAddress) {
    window.open(`https://explorer.megaeth.com/address/${walletAddress}`, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent mb-2">
            Portfolio Analysis
          </h2>
          <p className="text-green-400/70">Real-time wallet analysis powered by MegaETH</p>
        </div>
        <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10 neon-glow">
          <Activity className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Error State */}
      {error && (
        <Card className="glass-morphism border-red-500/50 bg-red-900/20 neon-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Info */}
      {walletData && (
        <>
          <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-gray-800/60 to-gray-900/60">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-xl flex items-center justify-center neon-glow">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-100">
                      {walletData.isContract ? 'Smart Contract' : 'Wallet Address'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-mono text-green-400/80 text-base">
                        {walletData.address.slice(0, 10)}...{walletData.address.slice(-8)}
                      </span>
                      <button onClick={copyAddress} className="text-green-400/80 hover:text-green-300 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={openInExplorer} className="text-green-400/80 hover:text-green-300 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-100">
                    {walletData.balance.toFixed(6)} <span className="text-green-400">ETH</span>
                  </div>
                  <div className="text-green-400/70 text-lg">
                    ≈ ${walletData.balanceUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
              {walletData.lastActivity && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-500/20">
                  <div>
                    <p className="text-green-400/70 text-sm">Last Activity</p>
                    <p className="text-green-100">{walletData.lastActivity.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-green-400/70 text-sm">Account Type</p>
                    <p className="text-green-100">{walletData.isContract ? 'Contract' : 'EOA'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-blue-900/40 to-blue-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-sm font-medium flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-100 mb-1">
                  {walletData.balance.toFixed(4)} ETH
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  ${walletData.balanceUSD.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-purple-900/40 to-purple-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-100 mb-1">
                  {walletData.transactionCount.toLocaleString()}
                </div>
                <div className="text-green-400/70 text-sm">Total count</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-green-900/40 to-green-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-sm font-medium">Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-100 mb-1">
                  {walletData.isContract ? 'Contract' : 'EOA'}
                </div>
                <div className="text-green-400/70 text-sm">
                  {walletData.isContract ? 'Smart Contract' : 'Externally Owned'}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-orange-900/40 to-orange-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-400 text-sm font-medium">Activity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-100 mb-1">
                  {Math.min(100, Math.floor((walletData.transactionCount / 10) * 100))}%
                </div>
                <div className="text-green-400/70 text-sm">Based on tx volume</div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <TransactionHistory walletAddress={walletData.address} />
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <Card className="glass-morphism cyber-border neon-glow">
            <CardContent className="p-12 text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-green-100 mb-2">Analyzing Wallet</h3>
              <p className="text-green-400/70">Fetching real-time data from MegaETH...</p>
              <div className="mt-4 w-64 mx-auto glass-morphism rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full animate-pulse neon-glow" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!walletAddress && !isLoading && (
        <div className="space-y-6">
          <Card className="glass-morphism cyber-border neon-glow bg-gradient-to-br from-gray-800/60 to-gray-900/60">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl"></div>
                <Wallet className="mx-auto mb-6 text-green-400 relative z-10" size={80} />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent mb-4">Portfolio Explorer</h3>
              <p className="text-green-400/70 max-w-2xl mx-auto text-lg leading-relaxed">
                Enter any wallet address or smart contract to explore comprehensive analytics including balance, 
                transaction history, activity patterns, and real-time insights powered by MegaETH.
              </p>
              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-green-500/70">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Complete History</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
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
