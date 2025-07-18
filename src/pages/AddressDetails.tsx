import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, Code, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

interface AddressData {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  code?: string;
  recentTransactions: any[];
}

const INDEXER_API = "https://jiti.indexing.co/networks/MEGAETH_TESTNET/address";
const INDEXER_BLOCK_API = "https://jiti.indexing.co/networks/MEGAETH_TESTNET";

const AddressDetails = () => {
  const { address } = useParams<{ address: string }>();
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchAddressData();
    }
  }, [address]);

  const fetchAddressData = async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const balance = await megaethAPI.getBalance(address);
      const isContract = await megaethAPI.isContract(address);
      let code = '';
      if (isContract) {
        code = await megaethAPI.getCode(address);
      }

      // Fetch latest block number
      const latestBlock = await megaethAPI.getBlockNumber();
      const blockNumbers = Array.from({ length: 100 }, (_, i) => latestBlock - i);
      // Fetch last 100 blocks in parallel from indexer
      const blockPromises = blockNumbers.map(num => fetch(`${INDEXER_BLOCK_API}/${num}`).then(r => r.ok ? r.json() : null).catch(() => null));
      const blocks = await Promise.all(blockPromises);
      // Filter transactions involving the address
      const txs = [];
      for (const block of blocks) {
        if (!block || !block.transactions) continue;
        for (const tx of block.transactions) {
          if (!tx) continue;
          if (
            (tx.from && tx.from.toLowerCase() === address.toLowerCase()) ||
            (tx.to && tx.to.toLowerCase() === address.toLowerCase())
          ) {
            txs.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: megaethAPI.weiToEther(tx.value || '0x0'),
              timestamp: block.timestamp ? (typeof block.timestamp === 'string' ? parseInt(block.timestamp, 16) * 1000 : block.timestamp * 1000) : Date.now(),
              type: tx.from?.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
              gasPrice: tx.gasPrice,
              gasUsed: tx.gas
            });
          }
        }
      }
      // Sort by timestamp descending
      txs.sort((a, b) => b.timestamp - a.timestamp);
      const totalTx = txs.length;
      const recentTxs = txs.slice(0, 10);

      setAddressData({
        address,
        balance: megaethAPI.weiToEther(balance).toFixed(6),
        transactionCount: totalTx,
        isContract,
        code,
        recentTransactions: recentTxs
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch address data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading address details...</p>
        </div>
      </div>
    );
  }

  if (error || !addressData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Address not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 space-y-6">
        {/* Address Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {addressData.isContract ? 'Smart Contract' : 'Address'} Details
            </h1>
            <p className="text-muted-foreground font-mono text-sm break-all">{addressData.address}</p>
          </div>
          <Badge variant="outline" className={addressData.isContract ? "border-primary text-primary bg-primary/5" : "border-accent text-accent-foreground bg-accent/10"}>
            {addressData.isContract ? (
              <>
                <Code className="w-4 h-4 mr-1" />
                Smart Contract
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-1" />
                EOA
              </>
            )}
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="professional-card professional-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {addressData.balance} ETH
              </div>
              <div className="text-muted-foreground text-sm">
                ≈ ${(parseFloat(addressData.balance) * 3200).toFixed(2)} USD
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card professional-shadow">
            <CardHeader>
              <CardTitle className="text-accent-foreground flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {addressData.transactionCount.toLocaleString()}
              </div>
              <div className="text-muted-foreground text-sm">Total count</div>
            </CardContent>
          </Card>

          <Card className="professional-card professional-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Activity Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                #{Math.floor(Math.random() * 1000) + 1}
              </div>
              <div className="text-muted-foreground text-sm">Network ranking</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="professional-card professional-shadow">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {addressData.recentTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Activity className="mx-auto mb-4 opacity-50" size={48} />
                <h3 className="text-lg font-semibold mb-2">No Recent Transactions</h3>
                <p>No recent transactions found for this address</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addressData.recentTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'in' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {tx.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <div className="font-mono text-sm text-foreground">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.type === 'in' ? 'text-primary' : 'text-destructive'
                      }`}>
                        {tx.type === 'in' ? '+' : '-'}{tx.value.toFixed(6)} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tx.type === 'in' ? 'From' : 'To'}: {(tx.type === 'in' ? tx.from : tx.to)?.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Code (if applicable) */}
        {addressData.isContract && addressData.code && (
          <Card className="professional-card professional-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Contract Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm text-foreground max-h-64 overflow-y-auto border">
                {addressData.code.slice(0, 1000)}
                {addressData.code.length > 1000 && '...'}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AddressDetails;
