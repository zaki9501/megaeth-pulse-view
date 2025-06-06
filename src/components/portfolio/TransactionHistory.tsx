
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, Filter, Download, Search } from "lucide-react";
import { TransactionDetails } from "@/components/dashboard/TransactionDetails";

interface TransactionHistoryProps {
  walletAddress: string;
}

interface Transaction {
  hash: string;
  type: "incoming" | "outgoing";
  amount: string;
  timestamp: Date;
  status: "success" | "pending" | "failed";
  gasUsed: string;
  gasPrice: string;
  from: string;
  to: string;
  value: string;
}

export const TransactionHistory = ({ walletAddress }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  const fetchTransactionHistory = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    
    // Enhanced mock transaction data
    const mockTransactions: Transaction[] = [
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        type: "outgoing",
        amount: "0.5",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "success",
        gasUsed: "21000",
        gasPrice: "20",
        from: walletAddress,
        to: "0x742C4B3814bb8D453c41eE25a1d67A7c18d4E3dd",
        value: "0.5"
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        type: "incoming",
        amount: "1.2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "success",
        gasUsed: "21000",
        gasPrice: "18",
        from: "0x8ba1f109551bD432803012645Hac136c22C58877",
        to: walletAddress,
        value: "1.2"
      },
      {
        hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        type: "outgoing",
        amount: "0.1",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "pending",
        gasUsed: "21000",
        gasPrice: "25",
        from: walletAddress,
        to: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        value: "0.1"
      },
      {
        hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        type: "incoming",
        amount: "2.5",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: "success",
        gasUsed: "21000",
        gasPrice: "22",
        from: "0xA0b86a33E6441E8532b35c5b7E6F9b7C2d3e8f90",
        to: walletAddress,
        value: "2.5"
      }
    ];
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
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

  if (!walletAddress) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl"></div>
              <Clock className="mx-auto mb-6 text-purple-400 relative z-10" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Transaction Explorer</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter a wallet address above to explore detailed transaction history with advanced filtering and analytics
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
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-6"></div>
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-lg">Loading transaction history...</p>
            <p className="text-gray-500 text-sm mt-2">Fetching and analyzing transactions</p>
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
              </CardTitle>
              <p className="text-gray-400 mt-1">{filteredTransactions.length} of {transactions.length} transactions</p>
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
                onChange={(e) => setFilter(e.target.value as "all" | "incoming" | "outgoing")}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
              
              {/* Export Button */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Transactions Table */}
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
                          tx.type === "incoming" ? "bg-green-900/50" : "bg-red-900/50"
                        }`}>
                          {tx.type === "incoming" ? (
                            <ArrowDownLeft className="text-green-400" size={16} />
                          ) : (
                            <ArrowUpRight className="text-red-400" size={16} />
                          )}
                        </div>
                        <div>
                          <span className={`font-medium ${
                            tx.type === "incoming" ? "text-green-400" : "text-red-400"
                          }`}>
                            {tx.type === "incoming" ? "Received" : "Sent"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-blue-400 text-sm">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
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
                          ≈ ${(parseFloat(tx.amount) * 2500).toFixed(2)}
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
                        <div className="text-sm text-gray-300">{tx.gasUsed}</div>
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

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Total Received</p>
                <p className="text-white font-bold text-lg">
                  {transactions.filter(tx => tx.type === "incoming").reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(3)} ETH
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
                  {transactions.filter(tx => tx.type === "outgoing").reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(3)} ETH
                </p>
              </div>
              <ArrowUpRight className="text-red-400" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Avg. Gas Price</p>
                <p className="text-white font-bold text-lg">
                  {(transactions.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0) / transactions.length).toFixed(1)} Gwei
                </p>
              </div>
              <Filter className="text-purple-400" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

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
