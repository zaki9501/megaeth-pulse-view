
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const DAppLeaderboard = () => {
  const timeRanges = ["24h", "7d", "30d"];
  const categories = ["All", "DeFi", "Gaming", "NFT", "Infra"];
  
  const [topContracts, setTopContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopContracts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the latest block number from the indexer
        const latestBlockRes = await fetch("https://jiti.indexing.co/networks/MEGAETH_TESTNET/latest");
        const latestBlockData = await latestBlockRes.json();
        const latestBlock = latestBlockData.number;
        const numBlocks = 20;
        const contractStats: Record<string, { count: number; lastSeen: number }> = {};
        // Scan last N blocks
        for (let i = 0; i < numBlocks; i++) {
          const blockNum = latestBlock - i;
          const res = await fetch(`https://jiti.indexing.co/networks/MEGAETH_TESTNET/${blockNum}`);
          if (!res.ok) continue;
          const block = await res.json();
          if (block && block.transactions) {
            for (const tx of block.transactions) {
              if (tx.to) {
                if (!contractStats[tx.to]) {
                  contractStats[tx.to] = { count: 0, lastSeen: blockNum };
                }
                contractStats[tx.to].count++;
                contractStats[tx.to].lastSeen = Math.max(contractStats[tx.to].lastSeen, blockNum);
              }
            }
          }
        }
        // Convert to array and sort by count desc
        const sorted = Object.entries(contractStats)
          .map(([address, stats]) => ({ address, ...stats }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setTopContracts(sorted);
      } catch (e: any) {
        setError(e.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTopContracts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">
          DApp Leaderboard
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Data range</span>
          <div className="flex space-x-1">
            {timeRanges.map(range => (
              <Button 
                key={range} 
                variant="outline" 
                size="sm" 
                className="professional-button-secondary hover:bg-primary/10"
                disabled
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2">
        {categories.map(category => (
          <Button 
            key={category} 
            variant={category === "All" ? "default" : "outline"}
            size="sm"
            className={category === "All" ? 
              "professional-button" : 
              "professional-button-secondary hover:bg-primary/10"
            }
            disabled
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="professional-card professional-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span>Top Contracts (last 20 blocks)</span>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>Tx Count</span>
              <span>Address</span>
              <span>Last Seen</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-400">{error}</div>
          ) : (
          <div className="space-y-1">
              {topContracts.map((contract, index) => (
                <div key={contract.address} className="flex items-center justify-between p-4 hover:bg-accent/50 rounded-lg transition-all duration-200 group border border-border/50 hover:border-primary/20">
                <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground text-sm w-6 font-medium">{index + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/20">
                      <Zap className="text-green-400" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">{contract.address.slice(0, 8)}...{contract.address.slice(-6)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Contract</span>
                    </div>
                  </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                      <div className="font-medium text-foreground">{contract.count}</div>
                  </div>
                  <div className="text-right">
                      <div className="font-mono text-foreground">{contract.address.slice(0, 6)}...{contract.address.slice(-4)}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-muted-foreground">#{contract.lastSeen}</div>
                  </div>
                  <div className="w-16 h-8 bg-secondary rounded flex items-center justify-center border border-border">
                    <div className="w-12 h-2 bg-primary rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
