
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
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
}

export const TransactionHistory = ({ walletAddress }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  const fetchTransactionHistory = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    
    // Mock transaction data since we need specific transaction tracking
    const mockTransactions: Transaction[] = [
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        type: "outgoing",
        amount: "0.5",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: "success",
        gasUsed: "21000",
        gasPrice: "20"
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        type: "incoming",
        amount: "1.2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "success",
        gasUsed: "21000",
        gasPrice: "18"
      },
      {
        hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        type: "outgoing",
        amount: "0.1",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: "pending",
        gasUsed: "21000",
        gasPrice: "25"
      }
    ];
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  };

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
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12 text-center">
          <Clock className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Wallet Selected</h3>
          <p className="text-gray-400">Search for a wallet address to view its transaction history</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading transaction history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <span className="text-sm text-gray-400">{transactions.length} transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Transaction Hash</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Time</TableHead>
                <TableHead className="text-gray-400">Gas</TableHead>
                <TableHead className="text-gray-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {tx.type === "incoming" ? (
                        <ArrowDownLeft className="text-green-400" size={16} />
                      ) : (
                        <ArrowUpRight className="text-red-400" size={16} />
                      )}
                      <span className={tx.type === "incoming" ? "text-green-400" : "text-red-400"}>
                        {tx.type === "incoming" ? "Received" : "Sent"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-blue-400 text-sm">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{tx.amount} ETH</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === "success" ? "bg-green-900 text-green-400" :
                      tx.status === "pending" ? "bg-yellow-900 text-yellow-400" :
                      "bg-red-900 text-red-400"
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {tx.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {tx.gasUsed} ({tx.gasPrice} Gwei)
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleTransactionClick(tx.hash)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <span>View</span>
                      <ExternalLink size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
