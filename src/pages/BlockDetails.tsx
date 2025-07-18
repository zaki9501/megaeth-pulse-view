import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { megaethAPI } from "@/services/megaethApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Zap, Clock, User, Layers } from "lucide-react";

const BlockDetails = () => {
  const { blockHashOrNumber } = useParams<{ blockHashOrNumber: string }>();
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlock = async () => {
      setLoading(true);
      setError(null);
      try {
        let result = null;
        if (!blockHashOrNumber) throw new Error("No block specified");
        if (blockHashOrNumber.startsWith("0x") && blockHashOrNumber.length === 66) {
          result = await megaethAPI.getBlockByHash(blockHashOrNumber);
        } else {
          // Try as block number
          const num = isNaN(Number(blockHashOrNumber)) ? blockHashOrNumber : Number(blockHashOrNumber);
          result = await megaethAPI.getBlock(num);
        }
        if (!result) throw new Error("Block not found");
        setBlock(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch block");
      } finally {
        setLoading(false);
      }
    };
    fetchBlock();
  }, [blockHashOrNumber]);

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading block details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !block) {
    return (
      <main className="p-6">
        <div className="text-center text-red-400/80">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Block not found'}</p>
        </div>
      </main>
    );
  }

  // Formatters
  const blockNumber = parseInt(block.number, 16);
  const blockTime = new Date(parseInt(block.timestamp, 16) * 1000);
  const gasUsed = parseInt(block.gasUsed || '0x0', 16);
  const gasLimit = parseInt(block.gasLimit || '0x0', 16);
  const txCount = block.transactions ? block.transactions.length : 0;

  return (
    <main className="p-6 space-y-6">
      {/* Block Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Block Details</h1>
          <p className="text-muted-foreground font-mono text-sm break-all">{block.hash}</p>
        </div>
        <Badge variant="outline" className="border-green-500/50 text-green-400/80 bg-green-500/5">
          <Layers className="text-green-400/80 mr-2" size={20} />
          Block
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary flex items-center text-sm">
              <Hash className="w-4 h-4 mr-1" />
              Block Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{blockNumber}</div>
            <div className="text-muted-foreground text-xs">Block number</div>
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
            <div className="text-xl font-bold text-foreground">{gasUsed.toLocaleString()}</div>
            <div className="text-muted-foreground text-xs">of {gasLimit.toLocaleString()} limit</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-blue-400/80 flex items-center text-sm">
              <User className="w-4 h-4 mr-1" />
              Miner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground break-all">{block.miner}</div>
            <div className="text-muted-foreground text-xs">Miner address</div>
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
            <div className="text-sm font-bold text-foreground">{blockTime.toLocaleTimeString()}</div>
            <div className="text-muted-foreground text-xs">{blockTime.toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Block Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Block Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Block Hash</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{block.hash}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Parent Hash</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{block.parentHash}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Nonce</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{block.nonce}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Difficulty</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{parseInt(block.difficulty, 16).toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Size (bytes)</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{parseInt(block.size, 16).toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Total Transactions</label>
              <div className="font-mono text-sm text-primary break-all bg-muted p-3 rounded">{txCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {block.transactions && block.transactions.length > 0 ? (
            block.transactions.map((tx: string, idx: number) => (
              <div key={tx} className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm">
                <span>{tx}</span>
                {/* You can add a link to transaction details here if desired */}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No transactions in this block.</div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default BlockDetails; 