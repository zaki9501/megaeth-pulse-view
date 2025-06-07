
import { useState, useEffect } from "react";
import { ArrowRight, Circle, Clock, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { megaethAPI } from "@/services/megaethApi";

interface Transaction {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  type: 'in' | 'out';
}

interface TransactionTimelineProps {
  walletAddress: string;
}

export const TransactionTimeline = ({ walletAddress }: TransactionTimelineProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        const currentBlock = await megaethAPI.getBlockNumber();
        const recentTxs: Transaction[] = [];
        
        // Check last 3 blocks for transactions
        for (let i = 0; i < 3; i++) {
          const blockNum = currentBlock - i;
          try {
            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
            const block = await megaethAPI.getBlock(blockNum);
            
            if (block && block.transactions && block.transactions.length > 0) {
              for (const txHash of block.transactions.slice(0, 2)) {
                try {
                  await new Promise(resolve => setTimeout(resolve, 50));
                  const tx = await megaethAPI.getTransactionByHash(txHash);
                  
                  if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                           tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                    
                    const transaction: Transaction = {
                      id: tx.hash,
                      from: tx.from || '',
                      to: tx.to || '',
                      value: megaethAPI.weiToEther(tx.value || '0x0').toFixed(4),
                      timestamp: parseInt(block.timestamp, 16) * 1000,
                      status: 'confirmed',
                      gasUsed: parseInt(tx.gas || '0x5208', 16),
                      type: tx.from?.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in'
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
        
        setTransactions(recentTxs.slice(0, 8).sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTransactions();
    
    // Poll for new transactions every 15 seconds
    const interval = setInterval(fetchRecentTransactions, 15000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  useEffect(() => {
    // Auto-highlight nodes
    const interval = setInterval(() => {
      if (transactions.length > 0) {
        const randomTx = transactions[Math.floor(Math.random() * transactions.length)];
        setActiveNode(randomTx.id);
        setTimeout(() => setActiveNode(null), 2000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [transactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 border-green-400 shadow-green-400/50';
      case 'pending': return 'text-yellow-400 border-yellow-400 shadow-yellow-400/50';
      case 'failed': return 'text-red-400 border-red-400 shadow-red-400/50';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'in' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="relative h-72 overflow-hidden bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg p-4">
      {/* Enhanced Timeline Container */}
      <div className="flex items-center space-x-6 h-full overflow-x-auto pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-cyan-400 font-mono text-sm">SCANNING BLOCKCHAIN...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 w-full h-full flex items-center justify-center">
            <div>
              <Circle className="mx-auto mb-4 opacity-50" size={32} />
              <p className="font-mono">No recent transactions detected</p>
              <p className="text-xs mt-2 opacity-75">Monitoring for new activity...</p>
            </div>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div key={tx.id} className="flex items-center space-x-4 flex-shrink-0">
              {/* Enhanced Transaction Node */}
              <div 
                className={`relative flex items-center justify-center w-16 h-16 rounded-full border-3 transition-all duration-700 backdrop-blur-sm ${getStatusColor(tx.status)} ${
                  activeNode === tx.id ? 'scale-125 shadow-xl' : 'scale-100'
                }`}
                style={{
                  background: activeNode === tx.id 
                    ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    : 'rgba(0,0,0,0.3)'
                }}
              >
                <Circle 
                  size={20} 
                  className={`${tx.status === 'pending' ? 'animate-pulse' : ''} ${activeNode === tx.id ? 'animate-spin' : ''}`}
                  fill="currentColor"
                />
                
                {/* Enhanced Transaction Info Tooltip */}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/95 border border-gray-600 rounded-lg p-3 text-xs font-mono opacity-0 hover:opacity-100 transition-opacity z-20 whitespace-nowrap backdrop-blur-sm shadow-xl">
                  <div className={`font-bold mb-1 ${getTypeColor(tx.type)}`}>
                    {tx.type === 'in' ? '↓ INCOMING' : '↑ OUTGOING'} {tx.value} ETH
                  </div>
                  <div className="text-gray-400 mb-1">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-purple-400">
                    <Zap size={10} className="inline mr-1" />
                    {tx.gasUsed?.toLocaleString()} gas
                  </div>
                  <Badge variant="outline" className={`mt-1 text-xs ${getStatusColor(tx.status)}`}>
                    {tx.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Activity Pulse */}
                {activeNode === tx.id && (
                  <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75" />
                )}
              </div>

              {/* Enhanced Connection Line */}
              {index < transactions.length - 1 && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-12 h-1 bg-gradient-to-r from-current via-transparent to-transparent opacity-60" />
                  <ArrowRight size={14} className="animate-pulse" />
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Enhanced Activity Indicators */}
      <div className="absolute top-4 right-4 flex items-center space-x-3 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-gray-800/80 px-3 py-1 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400">LIVE MONITORING</span>
        </div>
      </div>

      {/* Transaction Stats */}
      {transactions.length > 0 && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-xs font-mono">
          <div className="bg-gray-800/80 px-3 py-2 rounded-lg border border-cyan-500/30">
            <div className="text-cyan-400 font-bold">{transactions.length}</div>
            <div className="text-gray-400">RECENT TXS</div>
          </div>
          <div className="bg-gray-800/80 px-3 py-2 rounded-lg border border-purple-500/30">
            <div className="text-purple-400 font-bold">
              {transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0).toFixed(2)}
            </div>
            <div className="text-gray-400">TOTAL ETH</div>
          </div>
        </div>
      )}

      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse" 
             style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};
