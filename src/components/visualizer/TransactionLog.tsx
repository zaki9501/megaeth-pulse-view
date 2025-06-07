
import { useState, useEffect } from "react";
import { ExternalLink, Clock, Zap, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { megaethAPI } from "@/services/megaethApi";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  timestamp: number;
  type: 'in' | 'out';
  status: 'success' | 'pending' | 'failed';
}

interface TransactionLogProps {
  walletAddress: string;
}

export const TransactionLog = ({ walletAddress }: TransactionLogProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;
      
      setIsScanning(true);
      try {
        // Get recent blocks and search for transactions
        const currentBlock = await megaethAPI.getBlockNumber();
        const recentTxs: Transaction[] = [];
        
        // Check last 10 blocks for transactions involving this wallet
        for (let i = 0; i < 10; i++) {
          const blockNum = currentBlock - i;
          try {
            const block = await megaethAPI.getBlock(blockNum);
            
            if (block && block.transactions) {
              for (const txHash of block.transactions) {
                try {
                  const tx = await megaethAPI.getTransactionByHash(txHash);
                  const receipt = await megaethAPI.getTransactionReceipt(txHash);
                  
                  if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                           tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                    
                    const transaction: Transaction = {
                      hash: tx.hash,
                      from: tx.from || '',
                      to: tx.to || '',
                      value: megaethAPI.weiToEther(tx.value || '0x0').toFixed(3),
                      gasUsed: receipt ? parseInt(receipt.gasUsed, 16) : 21000,
                      timestamp: parseInt(block.timestamp, 16) * 1000,
                      type: tx.from?.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
                      status: receipt && receipt.status === '0x1' ? 'success' : 'failed'
                    };
                    
                    recentTxs.push(transaction);
                  }
                } catch (error) {
                  console.log(`Error fetching transaction ${txHash}:`, error);
                }
              }
            }
          } catch (error) {
            console.log(`Error fetching block ${blockNum}:`, error);
          }
        }
        
        setTransactions(recentTxs.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsScanning(false);
      }
    };

    fetchTransactions();
    
    // Poll for new transactions every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="space-y-4">
      {/* Scanning Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              <span className="text-purple-400 font-mono text-sm">SCANNING BLOCKCHAIN...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-mono text-sm">REAL-TIME FEED</span>
            </>
          )}
        </div>
        <Badge variant="outline" className="border-purple-500 text-purple-400 font-mono">
          {transactions.length} TRANSACTIONS
        </Badge>
      </div>

      {/* Transaction List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {transactions.length === 0 && !isScanning ? (
          <div className="text-center text-gray-400 py-8">
            <p>No recent transactions found for this wallet</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={tx.hash}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {/* Direction Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'in' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  {/* Transaction Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white text-sm">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                      <ExternalLink size={12} className="text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {tx.type === 'in' ? 'FROM' : 'TO'}: {(tx.type === 'in' ? tx.from : tx.to).slice(0, 10)}...{(tx.type === 'in' ? tx.from : tx.to).slice(-6)}
                    </div>
                  </div>
                </div>

                {/* Value and Status */}
                <div className="text-right">
                  <div className={`text-lg font-bold font-mono ${
                    tx.type === 'in' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'in' ? '+' : '-'}{tx.value} ETH
                  </div>
                  <div className="flex items-center space-x-2 justify-end">
                    <Badge 
                      variant={tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Transaction Meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Zap size={12} />
                    <span>{tx.gasUsed.toLocaleString()} gas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{formatTime(tx.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
