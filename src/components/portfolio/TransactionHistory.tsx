
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, Filter, Download, Search, RefreshCw } from "lucide-react";
import { TransactionDetails } from "@/components/dashboard/TransactionDetails";
import { megaethAPI } from "@/services/megaethApi";
import { toast } from "sonner";

interface TransactionHistoryProps {
  walletAddress: string;
}

interface Transaction {
  hash: string;
  blockNumber: number;
  type: "incoming" | "outgoing" | "contract";
  amount: string;
  amountUSD: string;
  timestamp: Date;
  status: "success" | "pending" | "failed";
  gasUsed: string;
  gasPrice: string;
  from: string;
  to: string;
  value: string;
  isContract: boolean;
}

export const TransactionHistory = ({ walletAddress }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing" | "contract">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  const fetchTransactionHistory = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching transaction history for:', walletAddress);
      
      // Get the latest block number
      const latestBlock = await megaethAPI.getBlockNumber();
      console.log('Latest block:', latestBlock);
      
      const txHistory: Transaction[] = [];
      const blocksToCheck = 5; // Check last 5 blocks
      
      // Check recent blocks for transactions involving this address
      for (let i = 0; i < blocksToCheck; i++) {
        try {
          const blockNumber = latestBlock - i;
          const block = await megaethAPI.getBlock(blockNumber);
          
          if (block && block.transactions) {
            // For each transaction hash, get full transaction details
            for (let j = 0; j < Math.min(block.transactions.length, 3); j++) { // Limit to 3 per block
              try {
                const txHash = block.transactions[j];
                const tx = await megaethAPI.getTransactionByHash(txHash);
                
                if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                          tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                  
                  const valueEth = tx.value ? megaethAPI.weiToEther(tx.value) : 0;
                  const gasPrice = tx.gasPrice ? megaethAPI.weiToGwei(tx.gasPrice) : 0;
                  
                  const isIncoming = tx.to?.toLowerCase() === walletAddress.toLowerCase();
                  const isContract = tx.to ? await megaethAPI.isContract(tx.to) : false;
                  
                  txHistory.push({
                    hash: tx.hash,
                    blockNumber: parseInt(tx.blockNumber, 16),
                    type: isContract ? "contract" : (isIncoming ? "incoming" : "outgoing"),
                    amount: valueEth.toFixed(6),
                    amountUSD: (valueEth * 2500).toFixed(2),
                    timestamp: new Date(parseInt(block.timestamp, 16) * 1000),
                    status: "success",
                    gasUsed: tx.gas || "21000",
                    gasPrice: gasPrice.toFixed(2),
                    from: tx.from || "",
                    to: tx.to || "",
                    value: valueEth.toString(),
                    isContract
                  });
                }
              } catch (txError) {
                console.error(`Error fetching transaction ${j} from block ${blockNumber}:`, txError);
              }
            }
          }
        } catch (blockError) {
          console.error(`Error fetching block ${latestBlock - i}:`, blockError);
        }
      }
      
      // If no real transactions found, show a message but don't use mock data
      if (txHistory.length === 0) {
        console.log('No recent transactions found for this address');
      }
      
      // Sort by timestamp descending
      txHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setTransactions(txHistory);
      console.log('Found transactions:', txHistory.length);
      
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch transaction history');
      toast.error('Failed to fetch transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch = searchTerm === "" || 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTransactionClick = (hash: string) => {
    setSelectedTransaction(hash);
    setShowTransactionDetails(true);
  };

  const closeTransactionDetails = () => {
    setShowTransactionDetails(false);
    setSelectedTransaction(null);
  };

  const exportTransactions = () => {
    const csv = [
      ['Hash', 'Type', 'Amount (ETH)', 'From', 'To', 'Timestamp', 'Status'],
      ...filteredTransactions.map(tx => [
        tx.hash,
        tx.type,
        tx.amount,
        tx.from,
        tx.to,
        tx.timestamp.toISOString(),
        tx.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${walletAddress.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully');
  };

  if (!walletAddress) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl"></div>
              <Clock className="mx-auto mb-6 text-purple-400 relative z-10" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Transaction Explorer</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter a wallet address above to explore detailed transaction history with real-time data from MegaETH
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Loading Transaction History</h3>
            <p className="text-gray-400">Scanning recent blocks for transactions...</p>
            <div className="mt-4 w-64 mx-auto bg-gray-700 rounded-full h-2">
              <div className="bg-purple-400 h-2 rounded-full animate-pulse" style={{ width: '40%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Controls */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Clock className="mr-3 text-purple-400" size={24} />
                Transaction History
                <button 
                  onClick={fetchTransactionHistory}
                  className="ml-3 p-1 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </CardTitle>
              <p className="text-gray-400 mt-1">
                {filteredTransactions.length} transactions found
                {transactions.length === 0 && !isLoading && " (No recent transactions in last 5 blocks)"}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
                <option value="contract">Contract</option>
              </select>
              
              {/* Export Button */}
              <button 
                onClick={exportTransactions}
                disabled={filteredTransactions.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-400">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 bg-gray-750">
                    <TableHead className="text-gray-300 font-semibold">Type</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Transaction Hash</TableHead>
                    <TableHead className="text-gray-300 font-semibold">From/To</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Amount</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Time</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Gas</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-700/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            tx.type === "incoming" ? "bg-green-900/50" : 
                            tx.type === "contract" ? "bg-blue-900/50" : "bg-red-900/50"
                          }`}>
                            {tx.type === "incoming" ? (
                              <ArrowDownLeft className="text-green-400" size={16} />
                            ) : tx.type === "contract" ? (
                              <div className="w-4 h-4 bg-blue-400 rounded"></div>
                            ) : (
                              <ArrowUpRight className="text-red-400" size={16} />
                            )}
                          </div>
                          <div>
                            <span className={`font-medium ${
                              tx.type === "incoming" ? "text-green-400" : 
                              tx.type === "contract" ? "text-blue-400" : "text-red-400"
                            }`}>
                              {tx.type === "incoming" ? "Received" : 
                               tx.type === "contract" ? "Contract" : "Sent"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-blue-400 text-sm">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Block #{tx.blockNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400">
                            {tx.type === "incoming" ? "From:" : "To:"}
                          </div>
                          <div className="font-mono text-xs text-gray-300">
                            {(tx.type === "incoming" ? tx.from : tx.to).slice(0, 8)}...{(tx.type === "incoming" ? tx.from : tx.to).slice(-6)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-semibold text-white text-lg">{tx.amount} ETH</span>
                          <div className="text-xs text-gray-400">
                            ≈ ${tx.amountUSD}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === "success" ? "bg-green-900/50 text-green-400 border border-green-800" :
                          tx.status === "pending" ? "bg-yellow-900/50 text-yellow-400 border border-yellow-800" :
                          "bg-red-900/50 text-red-400 border border-red-800"
                        }`}>
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-white">
                            {tx.timestamp.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {tx.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-300">{parseInt(tx.gasUsed).toLocaleString()}</div>
                          <div className="text-xs text-gray-400">{tx.gasPrice} Gwei</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleTransactionClick(tx.hash)}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors group"
                        >
                          <span>Details</span>
                          <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : !isLoading && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Clock className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
            <p className="text-gray-400">
              No recent transactions found for this address in the last 5 blocks.
              <br />
              Try refreshing or check back later for more activity.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Transaction Summary */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Total Received</p>
                  <p className="text-white font-bold text-lg">
                    {filteredTransactions
                      .filter(tx => tx.type === "incoming")
                      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      .toFixed(4)} ETH
                  </p>
                </div>
                <ArrowDownLeft className="text-green-400" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm">Total Sent</p>
                  <p className="text-white font-bold text-lg">
                    {filteredTransactions
                      .filter(tx => tx.type === "outgoing")
                      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      .toFixed(4)} ETH
                  </p>
                </div>
                <ArrowUpRight className="text-red-400" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Contract Interactions</p>
                  <p className="text-white font-bold text-lg">
                    {filteredTransactions.filter(tx => tx.type === "contract").length}
                  </p>
                </div>
                <div className="w-6 h-6 bg-blue-400 rounded"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Avg. Gas Price</p>
                  <p className="text-white font-bold text-lg">
                    {filteredTransactions.length > 0 
                      ? (filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0) / filteredTransactions.length).toFixed(1)
                      : "0"} Gwei
                  </p>
                </div>
                <Filter className="text-purple-400" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetails
          transactionHash={selectedTransaction}
          isOpen={showTransactionDetails}
          onClose={closeTransactionDetails}
        />
      )}
    </div>
  );
};
