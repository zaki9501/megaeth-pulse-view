
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, ArrowRight, Zap, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  gasUsed?: string;
  status: 'success' | 'failed' | 'pending';
  blockNumber: string;
  blockHash: string;
  transactionIndex: string;
  timestamp: number;
  data: string;
  nonce: string;
}

const TransactionDetails = () => {
  const { hash } = useParams<{ hash: string }>();
  const [txData, setTxData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (hash) {
      fetchTransactionData();
    }
  }, [hash]);

  const fetchTransactionData = async () => {
    if (!hash) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tx = await megaethAPI.getTransactionByHash(hash);
      const receipt = await megaethAPI.getTransactionReceipt(hash);
      
      if (!tx) {
        throw new Error('Transaction not found');
      }

      // Get block to fetch timestamp
      let timestamp = Date.now();
      if (tx.blockNumber) {
        try {
          const block = await megaethAPI.getBlock(parseInt(tx.blockNumber, 16));
          timestamp = parseInt(block.timestamp, 16) * 1000;
        } catch (error) {
          // Use current time if block fetch fails
        }
      }

      setTxData({
        hash: tx.hash,
        from: tx.from || '',
        to: tx.to || '',
        value: megaethAPI.weiToEther(tx.value || '0x0').toString(),
        gasPrice: tx.gasPrice || '0x0',
        gasLimit: tx.gas || '0x0',
        gasUsed: receipt?.gasUsed || '0x0',
        status: receipt?.status === '0x1' ? 'success' : receipt?.status === '0x0' ? 'failed' : 'pending',
        blockNumber: tx.blockNumber || 'pending',
        blockHash: tx.blockHash || '',
        transactionIndex: tx.transactionIndex || '0x0',
        timestamp,
        data: tx.input || '0x',
        nonce: tx.nonce || '0x0'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400/80" size={20} />;
      case 'failed':
        return <XCircle className="text-red-400/80" size={20} />;
      case 'pending':
        return <Loader className="text-yellow-400/80 animate-spin" size={20} />;
      default:
        return <Clock className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 text-green-400/80 bg-green-500/5';
      case 'failed':
        return 'border-red-500/50 text-red-400/80 bg-red-500/5';
      case 'pending':
        return 'border-yellow-500/50 text-yellow-400/80 bg-yellow-500/5';
      default:
        return 'border-border text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading transaction details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !txData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <Header />
          <main className="p-6">
            <div className="text-center text-red-400/80">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error || 'Transaction not found'}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar activeTab="" setActiveTab={() => {}} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <Header />
        <main className="p-6 space-y-6">
          {/* Transaction Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Transaction Details</h1>
              <p className="text-muted-foreground font-mono text-sm break-all">{txData.hash}</p>
            </div>
            <Badge variant="outline" className={getStatusColor(txData.status)}>
              {getStatusIcon(txData.status)}
              <span className="ml-2 capitalize">{txData.status}</span>
            </Badge>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {parseFloat(txData.value).toFixed(6)} ETH
                </div>
                <div className="text-muted-foreground text-xs">
                  ≈ ${(parseFloat(txData.value) * 3200).toFixed(2)} USD
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-orange-400/80 flex items-center text-sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Gas Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {parseInt(txData.gasUsed, 16).toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs">
                  of {parseInt(txData.gasLimit, 16).toLocaleString()} limit
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-blue-400/80 flex items-center text-sm">
                  <Hash className="w-4 h-4 mr-1" />
                  Block
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {txData.blockNumber === 'pending' ? 'Pending' : parseInt(txData.blockNumber, 16).toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs">Block number</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-purple-400/80 flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-foreground">
                  {new Date(txData.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-muted-foreground text-xs">
                  {new Date(txData.timestamp).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Details */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">From</label>
                  <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">
                    {txData.from}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">To</label>
                  <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">
                    {txData.to || 'Contract Creation'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Gas Price</label>
                  <div className="font-mono text-sm text-foreground bg-muted p-3 rounded">
                    {megaethAPI.weiToGwei(txData.gasPrice).toFixed(2)} Gwei
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Nonce</label>
                  <div className="font-mono text-sm text-foreground bg-muted p-3 rounded">
                    {parseInt(txData.nonce, 16)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Position in Block</label>
                  <div className="font-mono text-sm text-foreground bg-muted p-3 rounded">
                    {parseInt(txData.transactionIndex, 16)}
                  </div>
                </div>
              </div>

              {txData.data && txData.data !== '0x' && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Input Data</label>
                  <div className="font-mono text-xs text-muted-foreground bg-secondary p-4 rounded max-h-32 overflow-y-auto break-all">
                    {txData.data}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default TransactionDetails;
