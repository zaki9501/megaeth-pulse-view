
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, TrendingUp, Activity, Database, CheckCircle, AlertCircle, ExternalLink, Layers, Hash, User } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { LiveChart } from "./LiveChart";
import { StatusIndicator } from "./StatusIndicator";
import { TransactionDetails } from "./TransactionDetails";
import { useMegaETHData } from "@/hooks/useMegaETHData";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { megaethAPI } from "@/services/megaethApi";

export const ChainOpsOverview = () => {
  const { chainMetrics, recentBlocks, isLoading, error, refetch } = useMegaETHData();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockDetails, setShowBlockDetails] = useState(false);
  const [blockDetails, setBlockDetails] = useState<any>(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  // Format metrics for display
  const formatBlockHeight = (height: number) => {
    return height.toLocaleString();
  };

  const formatBlockTime = (time: number) => {
    return `${(time / 1000).toFixed(1)} s`;
  };

  const formatGasPrice = (price: number) => {
    return `${price.toFixed(2)} Gwei`;
  };

  const chainMetricsDisplay = [
    { 
      title: "Block Height", 
      value: formatBlockHeight(chainMetrics.blockHeight), 
      icon: Database, 
      change: "+1.2%" 
    },
    { 
      title: "Block Time", 
      value: formatBlockTime(chainMetrics.blockTime), 
      icon: Clock, 
      change: "-5.1%" 
    },
    { 
      title: "Gas Price", 
      value: formatGasPrice(chainMetrics.gasPrice), 
      icon: TrendingUp, 
      change: "+2.4%" 
    },
    { 
      title: "TPS", 
      value: chainMetrics.tps.toString(), 
      icon: Activity, 
      change: "+15.7%" 
    },
  ];

  const systemStatus: Array<{
    label: string;
    status: "online" | "good" | "warning" | "error" | "syncing";
    value: string;
  }> = [
    { 
      label: "Sequencer Uptime", 
      status: error ? "error" : "online", 
      value: error ? "Error" : "99.98%" 
    },
    { 
      label: "Latency Status", 
      status: chainMetrics.blockTime > 100 ? "warning" : "good", 
      value: `${chainMetrics.blockTime.toFixed(0)}ms` 
    },
    { 
      label: "L2→L1 Sync", 
      status: "syncing", 
      value: "5.2s" 
    },
  ];

  const handleTransactionClick = (transactionHash: string) => {
    setSelectedTransaction(transactionHash);
    setShowTransactionDetails(true);
  };

  const closeTransactionDetails = () => {
    setShowTransactionDetails(false);
    setSelectedTransaction(null);
  };

  const handleBlockClick = async (blockNumber: number) => {
    setSelectedBlock(blockNumber);
    setShowBlockDetails(true);
    setBlockLoading(true);
    setBlockError(null);
    try {
      const block = await megaethAPI.getBlock(blockNumber);
      setBlockDetails(block);
    } catch (err) {
      setBlockError("Failed to fetch block details");
      setBlockDetails(null);
    } finally {
      setBlockLoading(false);
    }
  };

  const closeBlockDetails = () => {
    setShowBlockDetails(false);
    setSelectedBlock(null);
    setBlockDetails(null);
    setBlockError(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-green-400/70">Loading MegaETH data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
          Chain Operations
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className={`text-sm ${error ? 'text-red-400' : 'text-green-400'}`}>
              {error ? 'Connection Error' : 'Real-time data'}
            </span>
          </div>
          <button 
            onClick={refetch}
            className="px-4 py-2 glass-morphism cyber-border text-green-300 rounded-lg hover:bg-green-500/20 hover:text-green-100 transition-all duration-300 neon-glow"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="glass-morphism border-red-500/50 bg-red-900/20 neon-glow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">MegaETH RPC Issue: {error}</span>
              <span className="text-green-400/70 text-sm ml-2">(Some features may use mock data)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chainMetricsDisplay.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* System Status */}
      <Card className="glass-morphism cyber-border neon-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-100">
            <CheckCircle className="text-green-400" size={20} />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemStatus.map((status, index) => (
              <StatusIndicator key={index} {...status} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="text-green-100">Transactions Per Block</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="tps" data={recentBlocks} />
          </CardContent>
        </Card>

        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="text-green-100">Gas Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="gas" data={recentBlocks} />
          </CardContent>
        </Card>
      </div>

      {/* Network Info */}
      <Card className="glass-morphism cyber-border neon-glow">
        <CardHeader>
          <CardTitle className="text-green-100">Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-green-400/70">Network Name</p>
              <p className="font-semibold text-green-100">MEGA Testnet</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-400/70">Chain ID</p>
              <p className="font-semibold text-green-100">6342</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-400/70">RPC Endpoint</p>
              <p className="font-mono text-sm text-emerald-400 hover:text-emerald-300 transition-colors">carrot.megaeth.com/rpc</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-400/70">Last Updated</p>
              <p className="font-semibold text-green-100">{chainMetrics.lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blocks & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blocks */}
        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-green-100">
              <span>Recent Blocks</span>
              <span className="text-sm text-green-400/70">Latest 10 blocks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentBlocks.slice(-10).reverse().map((block) => (
                <div
                  key={block.number}
                  className="flex items-center justify-between p-3 glass-morphism cyber-border rounded-lg hover:bg-green-500/10 transition-all duration-300 group neon-glow hover:border-green-400/50 cursor-pointer"
                  onClick={() => handleBlockClick(block.number)}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      Block #{block.number}
                    </span>
                    <span className="text-xs text-green-400/70">
                      {new Date(block.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs text-green-400/70">
                      Txns: <span className="font-semibold text-green-100">{block.transactions.length}</span>
                    </div>
                    <div className="text-xs text-green-400/70">
                      Gas: <span className="font-semibold text-green-100">{parseInt(block.gasUsed, 16).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-green-100">
              <span>Recent Transactions</span>
              <span className="text-sm text-green-400/70">Click on a transaction to view details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentBlocks.slice(-10).reverse().map((block, blockIndex) => (
                <div key={block.number} className="space-y-2">
                  <div className="text-sm text-green-400/70 font-semibold">Block #{block.number}</div>
                  {block.transactions.slice(0, 3).map((txHash, txIndex) => (
                    <div 
                      key={txHash} 
                      className="flex items-center justify-between p-3 glass-morphism cyber-border rounded-lg hover:bg-green-500/10 cursor-pointer transition-all duration-300 group neon-glow hover:border-green-400/50"
                      onClick={() => handleTransactionClick(txHash)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-mono text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </span>
                        <ExternalLink className="text-green-400/70 group-hover:text-green-300 transition-colors" size={14} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-400/70">
                          {new Date(block.timestamp * 1000).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {block.transactions.length > 3 && (
                    <div className="text-center text-sm text-green-400/70 py-2">
                      +{block.transactions.length - 3} more transactions
                    </div>
                  )}
                </div>
              ))}
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

      {/* Block Details Modal */}
      <Dialog open={showBlockDetails} onOpenChange={closeBlockDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-morphism cyber-border neon-glow bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-0 border-green-500/30 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-lime-400/10 rounded-t-lg p-6 border-b border-green-500/10">
            <DialogTitle className="flex items-center space-x-2 text-green-100 text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              <Layers className="text-green-400" size={24} />
              <span>Block Details</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {blockLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
            )}
            {blockError && (
              <div className="text-red-400 text-center py-4">{blockError}</div>
            )}
            {blockDetails && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-green-100 mb-2">Block #{parseInt(blockDetails.number, 16)}</div>
                    <div className="text-green-400/70 font-mono text-xs break-all">{blockDetails.hash}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-green-400/70">{new Date(parseInt(blockDetails.timestamp, 16) * 1000).toLocaleString()}</span>
                    <span className="text-xs text-green-400/70">Txns: {blockDetails.transactions.length}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="text-blue-400" size={16} />
                    <span className="text-sm text-green-100">Parent Hash:</span>
                    <span className="font-mono text-xs break-all text-green-400/80">{blockDetails.parentHash}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="text-purple-400" size={16} />
                    <span className="text-sm text-green-100">Miner:</span>
                    <span className="font-mono text-xs break-all text-green-400/80">{blockDetails.miner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="text-orange-400" size={16} />
                    <span className="text-sm text-green-100">Gas Used:</span>
                    <span className="font-mono text-xs text-green-400/80">{parseInt(blockDetails.gasUsed, 16).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-cyan-400" size={16} />
                    <span className="text-sm text-green-100">Nonce:</span>
                    <span className="font-mono text-xs text-green-400/80">{blockDetails.nonce}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
