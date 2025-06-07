
import { useState, useEffect } from "react";
import { ArrowRight, Circle } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

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
    const fetchRecentTransactions = async () => {
      if (!walletAddress) return;
      
      try {
        const currentBlock = await megaethAPI.getBlockNumber();
        const recentTxs: Transaction[] = [];
        
        // Check last 5 blocks for transactions
        for (let i = 0; i < 5; i++) {
          const blockNum = currentBlock - i;
          try {
            const block = await megaethAPI.getBlock(blockNum);
            
            if (block && block.transactions) {
              for (const txHash of block.transactions.slice(0, 3)) { // Limit to 3 per block
                try {
                  const tx = await megaethAPI.getTransactionByHash(txHash);
                  
                  if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                           tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                    
                    const transaction: Transaction = {
                      id: tx.hash,
                      from: tx.from || '',
                      to: tx.to || '',
                      value: megaethAPI.weiToEther(tx.value || '0x0').toFixed(3),
                      timestamp: parseInt(block.timestamp, 16) * 1000,
                      status: 'confirmed'
                    };
                    
                    recentTxs.push(transaction);
                  }
                } catch (error) {
                  console.log(`Error fetching transaction:`, error);
                }
              }
            }
          } catch (error) {
            console.log(`Error fetching block:`, error);
          }
        }
        
        setTransactions(recentTxs.slice(0, 6).sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      }
    };

    fetchRecentTransactions();
    
    // Poll for new transactions every 10 seconds
    const interval = setInterval(fetchRecentTransactions, 10000);
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
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 w-full">
            <p>No recent transactions found</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
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
          ))
        )}
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
