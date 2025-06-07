
import { useState, useEffect } from "react";
import { ExternalLink, Clock, Zap, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    // Mock transaction data
    const mockTxs: Transaction[] = [
      {
        hash: '0xabc123...def456',
        from: walletAddress,
        to: '0x742d35cc...8c5b',
        value: '0.5',
        gasUsed: 21000,
        timestamp: Date.now() - 120000,
        type: 'out',
        status: 'success'
      },
      {
        hash: '0xdef789...abc123',
        from: '0x8ba1f109...9c4d',
        to: walletAddress,
        value: '1.2',
        timestamp: Date.now() - 180000,
        type: 'in',
        status: 'success'
      },
      {
        hash: '0x456def...789abc',
        from: walletAddress,
        to: '0x1f9840a8...5ad5',
        value: '0.3',
        gasUsed: 45000,
        timestamp: Date.now() - 60000,
        type: 'out',
        status: 'pending'
      }
    ];

    setTransactions(mockTxs);
    
    // Simulate new transactions
    setTimeout(() => setIsScanning(false), 2000);
    
    const interval = setInterval(() => {
      const newTx: Transaction = {
        hash: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 8)}`,
        from: Math.random() > 0.5 ? walletAddress : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        to: Math.random() > 0.5 ? walletAddress : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        value: (Math.random() * 2).toFixed(3),
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        timestamp: Date.now(),
        type: Math.random() > 0.5 ? 'in' : 'out',
        status: 'pending'
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
    }, 10000);

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
              <span className="text-purple-400 font-mono text-sm">SCANNING MEMPOOL...</span>
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
        {transactions.map((tx, index) => (
          <div
            key={tx.hash}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-[1.02]"
            style={{
              animation: index === 0 && !isScanning ? 'slideInLeft 0.5s ease-out' : 'none'
            }}
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
                    <span className="font-mono text-white text-sm">{tx.hash}</span>
                    <ExternalLink size={12} className="text-gray-400 hover:text-white cursor-pointer" />
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {tx.type === 'in' ? 'FROM' : 'TO'}: {tx.type === 'in' ? tx.from : tx.to}
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
                  <span>{tx.gasUsed?.toLocaleString()} gas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{formatTime(tx.timestamp)}</span>
                </div>
              </div>
              
              {tx.status === 'pending' && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span>CONFIRMING</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
