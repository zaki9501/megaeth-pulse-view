import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { WalletSearch } from "./WalletSearch";
import { TransactionHistory } from "./TransactionHistory";
import { megaethAPI } from "@/services/megaethApi";

interface WalletPortfolioProps {
  walletAddress?: string;
}

export const WalletPortfolio = ({ walletAddress: initialAddress }: WalletPortfolioProps) => {
  const [walletAddress, setWalletAddress] = useState(initialAddress || "");
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchWalletData();
    }
  }, [walletAddress]);

  const fetchWalletData = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    try {
      const balance = await megaethAPI.getBalance(walletAddress);
      const txCount = await megaethAPI.getTransactionCount(walletAddress);
      const isContract = await megaethAPI.isContract(walletAddress);
      
      setWalletData({
        address: walletAddress,
        balance: megaethAPI.weiToEther(balance),
        transactionCount: txCount,
        isContract
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Portfolio Analysis</h2>
        <Badge variant="outline" className="border-blue-500 text-blue-400">
          <Activity className="w-4 h-4 mr-1" />
          Real-time Data
        </Badge>
      </div>

      <WalletSearch 
        onWalletSelect={setWalletAddress} 
        selectedWallet={walletAddress}
      />

      {walletData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {walletData.balance.toFixed(4)} ETH
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Real-time
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {walletData.transactionCount}
                </div>
                <div className="text-gray-400 text-sm">Total count</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {walletData.isContract ? 'Contract' : 'EOA'}
                </div>
                <div className="text-gray-400 text-sm">
                  {walletData.isContract ? 'Smart Contract' : 'Externally Owned Account'}
                </div>
              </CardContent>
            </Card>
          </div>

          <TransactionHistory walletAddress={walletAddress} />
        </>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
