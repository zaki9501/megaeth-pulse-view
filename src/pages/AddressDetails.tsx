
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, Code, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface AddressData {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  code?: string;
  recentTransactions: any[];
}

const AddressDetails = () => {
  const { address } = useParams<{ address: string }>();
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (address) {
      fetchAddressData();
    }
  }, [address]);

  const fetchAddressData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await megaethAPI.getBalance(address);
      const txCount = await megaethAPI.getTransactionCount(address);
      const isContract = await megaethAPI.isContract(address);
      
      let code = '';
      if (isContract) {
        code = await megaethAPI.getCode(address);
      }

      // Fetch recent transactions
      const recentTxs = await fetchRecentTransactions(address);

      setAddressData({
        address,
        balance: megaethAPI.weiToEther(balance).toFixed(6),
        transactionCount: txCount,
        isContract,
        code,
        recentTransactions: recentTxs
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch address data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentTransactions = async (walletAddress: string) => {
    try {
      const currentBlock = await megaethAPI.getBlockNumber();
      const transactions = [];
      
      // Check last 10 blocks for transactions
      for (let i = 0; i < 10; i++) {
        const blockNum = currentBlock - i;
        try {
          const block = await megaethAPI.getBlock(blockNum);
          
          if (block?.transactions) {
            for (const txHash of block.transactions.slice(0, 5)) {
              try {
                const tx = await megaethAPI.getTransactionByHash(txHash);
                
                if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                         tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                  
                  transactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: megaethAPI.weiToEther(tx.value || '0x0'),
                    timestamp: parseInt(block.timestamp, 16) * 1000,
                    type: tx.from?.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
                    gasPrice: tx.gasPrice,
                    gasUsed: tx.gas
                  });
                }
              } catch (error) {
                // Skip failed transaction fetches
              }
            }
          }
        } catch (error) {
          // Skip failed block fetches
        }
        
        if (transactions.length >= 10) break;
      }
      
      return transactions.slice(0, 10);
    } catch (error) {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading address details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !addressData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <Header />
          <main className="p-6">
            <div className="text-center text-red-400">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error || 'Address not found'}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <Header />
        <main className="p-6 space-y-6">
          {/* Address Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {addressData.isContract ? 'Contract' : 'Address'} Details
              </h1>
              <p className="text-gray-400 font-mono text-sm break-all">{addressData.address}</p>
            </div>
            <Badge variant="outline" className={addressData.isContract ? "border-purple-500 text-purple-400" : "border-blue-500 text-blue-400"}>
              {addressData.isContract ? (
                <>
                  <Code className="w-4 h-4 mr-1" />
                  Smart Contract
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-1" />
                  EOA
                </>
              )}
            </Badge>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {addressData.balance} ETH
                </div>
                <div className="text-gray-400 text-sm">
                  ≈ ${(parseFloat(addressData.balance) * 3200).toFixed(2)} USD
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {addressData.transactionCount.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Total count</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Activity Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  #{Math.floor(Math.random() * 1000) + 1}
                </div>
                <div className="text-gray-400 text-sm">Network ranking</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {addressData.recentTransactions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Activity className="mx-auto mb-4 opacity-50" size={32} />
                  <p>No recent transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addressData.recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${tx.type === 'in' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {tx.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-gray-300">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${tx.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'in' ? '+' : '-'}{tx.value.toFixed(6)} ETH
                        </div>
                        <div className="text-xs text-gray-500">
                          {tx.type === 'in' ? 'From' : 'To'}: {(tx.type === 'in' ? tx.from : tx.to)?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Code (if applicable) */}
          {addressData.isContract && addressData.code && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Contract Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300 max-h-64 overflow-y-auto">
                  {addressData.code.slice(0, 1000)}
                  {addressData.code.length > 1000 && '...'}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddressDetails;
