import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, TrendingUp, Activity, Database, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { LiveChart } from "./LiveChart";
import { StatusIndicator } from "./StatusIndicator";
import { TransactionDetails } from "./TransactionDetails";
import { useMegaETHData } from "@/hooks/useMegaETHData";
import { useState } from "react";

export const ChainOpsOverview = () => {
  const { chainMetrics, recentBlocks, isLoading, error, refetch } = useMegaETHData();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Format metrics for display
  const formatBlockHeight = (height: number) => {
    return height.toLocaleString();
  };

  const formatBlockTime = (time: number) => {
    return `${time.toFixed(1)} ms`;
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
      title: "Transactions", 
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading MegaETH data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chain Operations</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className={`text-sm ${error ? 'text-red-400' : 'text-green-400'}`}>
              {error ? 'Connection Error' : 'Real-time data'}
            </span>
          </div>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">MegaETH RPC Issue: {error}</span>
              <span className="text-gray-400 text-sm ml-2">(Some features may use mock data)</span>
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
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
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
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Transactions Per Block</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="tps" data={recentBlocks} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Gas Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="gas" data={recentBlocks} />
          </CardContent>
        </Card>
      </div>

      {/* Network Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Network Name</p>
              <p className="font-semibold">MEGA Testnet</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Chain ID</p>
              <p className="font-semibold">6342</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">RPC Endpoint</p>
              <p className="font-mono text-sm text-blue-400">carrot.megaeth.com/rpc</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="font-semibold">{chainMetrics.lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            <span className="text-sm text-gray-400">Click on a transaction to view details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentBlocks.slice(-10).reverse().map((block, blockIndex) => (
              <div key={block.number} className="space-y-2">
                <div className="text-sm text-gray-400 font-semibold">Block #{block.number}</div>
                {block.transactions.slice(0, 3).map((txHash, txIndex) => (
                  <div 
                    key={txHash} 
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors group"
                    onClick={() => handleTransactionClick(txHash)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="font-mono text-sm text-blue-400 group-hover:text-blue-300">
                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      </span>
                      <ExternalLink className="text-gray-400 group-hover:text-gray-300" size={14} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(block.timestamp * 1000).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {block.transactions.length > 3 && (
                  <div className="text-center text-sm text-gray-400 py-2">
                    +{block.transactions.length - 3} more transactions
                  </div>
                )}
              </div>
            ))}
          </div>
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
