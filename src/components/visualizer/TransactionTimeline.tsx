
import { useState, useEffect } from "react";
import { ArrowRight, Circle } from "lucide-react";

interface Transaction {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TransactionTimelineProps {
  walletAddress: string;
}

export const TransactionTimeline = ({ walletAddress }: TransactionTimelineProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        from: walletAddress,
        to: "0x742d35cc...8c5b",
        value: "0.5",
        timestamp: Date.now() - 30000,
        status: 'confirmed'
      },
      {
        id: "tx2",
        from: "0x8ba1f109...9c4d",
        to: walletAddress,
        value: "1.2",
        timestamp: Date.now() - 15000,
        status: 'confirmed'
      },
      {
        id: "tx3",
        from: walletAddress,
        to: "0x1f9840a8...5ad5",
        value: "0.3",
        timestamp: Date.now() - 5000,
        status: 'pending'
      }
    ];

    setTransactions(mockTransactions);

    // Simulate new transactions
    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: `tx${Date.now()}`,
        from: Math.random() > 0.5 ? walletAddress : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        to: Math.random() > 0.5 ? walletAddress : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        value: (Math.random() * 2).toFixed(3),
        timestamp: Date.now(),
        status: 'pending'
      };

      setTransactions(prev => [...prev.slice(-5), newTx]);
      setActiveNode(newTx.id);
      
      setTimeout(() => {
        setActiveNode(null);
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'confirmed' } : tx
          )
        );
      }, 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, [walletAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 border-green-400';
      case 'pending': return 'text-yellow-400 border-yellow-400';
      case 'failed': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="relative h-64 overflow-hidden">
      {/* Timeline Container */}
      <div className="flex items-center space-x-4 h-full overflow-x-auto pb-4">
        {transactions.map((tx, index) => (
          <div key={tx.id} className="flex items-center space-x-2 flex-shrink-0">
            {/* Transaction Node */}
            <div 
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${getStatusColor(tx.status)} ${
                activeNode === tx.id ? 'scale-125 shadow-lg shadow-current/50' : ''
              }`}
            >
              <Circle 
                size={16} 
                className={`${tx.status === 'pending' ? 'animate-pulse' : ''}`}
                fill="currentColor"
              />
              
              {/* Glow Effect */}
              {activeNode === tx.id && (
                <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75" />
              )}
              
              {/* Transaction Info Tooltip */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs font-mono opacity-0 hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                <div className="text-cyan-400">{tx.value} ETH</div>
                <div className="text-gray-400">{new Date(tx.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Connection Line */}
            {index < transactions.length - 1 && (
              <div className="flex items-center space-x-1 text-gray-500">
                <div className="w-8 h-0.5 bg-gradient-to-r from-current to-transparent" />
                <ArrowRight size={12} />
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Moving Scanner Line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse opacity-50" 
             style={{ left: '50%', animationDuration: '2s' }} />
      </div>

      {/* Activity Indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-2 text-xs font-mono">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-400">LIVE FEED</span>
      </div>
    </div>
  );
};
