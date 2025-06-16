
import { useState, useEffect } from "react";
import { Search, Layers, Activity, Zap, Clock, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { megaethAPI } from "@/services/megaethApi";

interface BlockData {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
  miner: string;
  difficulty: string;
  size: number;
}

export const BlockVisualizer = () => {
  const [blockNumber, setBlockNumber] = useState("");
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const latest = await megaethAPI.getBlockNumber();
        setLatestBlock(latest);
      } catch (error) {
        console.error('Error fetching latest block:', error);
      }
    };
    
    fetchLatestBlock();
  }, []);

  const handleBlockSearch = async () => {
    if (!blockNumber) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      const blockNum = blockNumber === 'latest' ? 'latest' : parseInt(blockNumber);
      const block = await megaethAPI.getBlock(blockNum);
      
      if (block) {
        const blockInfo: BlockData = {
          number: parseInt(block.number, 16),
          hash: block.hash,
          timestamp: parseInt(block.timestamp, 16) * 1000,
          transactions: block.transactions || [],
          gasUsed: parseInt(block.gasUsed || '0x0', 16).toString(),
          gasLimit: parseInt(block.gasLimit || '0x0', 16).toString(),
          miner: block.miner || 'Unknown',
          difficulty: parseInt(block.difficulty || '0x0', 16).toString(),
          size: parseInt(block.size || '0x0', 16)
        };
        
        clearInterval(progressInterval);
        setScanProgress(100);
        
        setTimeout(() => {
          setBlockData(blockInfo);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching block data:', error);
    } finally {
      setTimeout(() => setIsScanning(false), 1000);
    }
  };

  const formatNumber = (num: string | number) => {
    return parseInt(num.toString()).toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="glass-morphism cyber-border neon-glow">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl text-green-100/90 flex items-center space-x-2">
            <Search size={20} />
            <span>Block Explorer</span>
          </CardTitle>
          <p className="text-green-400/60 text-sm">
            Enter a block number or 'latest' to explore block details and transactions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-end">
            <div className="flex-1">
              <div className="relative">
                <Layers className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
                <Input
                  placeholder={`Block number (e.g., ${latestBlock}) or 'latest'`}
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(e.target.value)}
                  className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 glass-morphism cyber-border text-green-100/90 placeholder-green-400/40 text-base sm:text-lg rounded-lg focus:ring-2 focus:ring-green-500/70 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleBlockSearch()}
                />
                {isScanning && (
                  <div className="absolute bottom-0 left-0 h-1 bg-green-500/80 rounded-full transition-all duration-300 neon-glow" 
                       style={{ width: `${scanProgress}%` }} />
                )}
              </div>
            </div>
            <Button 
              onClick={handleBlockSearch}
              disabled={!blockNumber || isScanning}
              className="bg-green-600/80 hover:bg-green-700/80 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg h-12 sm:h-14 neon-glow hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              size="lg"
            >
              {isScanning ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Loading...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <>
                  <Database size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Explore Block</span>
                  <span className="sm:hidden">Explore</span>
                </>
              )}
            </Button>
          </div>
          
          {latestBlock > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBlockNumber('latest')}
                className="glass-morphism cyber-border text-green-400/70 hover:bg-green-500/10 text-xs"
              >
                Latest Block
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBlockNumber((latestBlock - 10).toString())}
                className="glass-morphism cyber-border text-green-400/70 hover:bg-green-500/10 text-xs"
              >
                Block #{latestBlock - 10}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBlockNumber((latestBlock - 100).toString())}
                className="glass-morphism cyber-border text-green-400/70 hover:bg-green-500/10 text-xs"
              >
                Block #{latestBlock - 100}
              </Button>
            </div>
          )}
          
          {isScanning && (
            <div className="space-y-3 glass-morphism rounded-lg p-3 sm:p-4 cyber-border">
              <div className="flex justify-between text-sm">
                <span className="text-green-400/60">Block Analysis Progress</span>
                <span className="text-green-400/80 font-semibold">{scanProgress}%</span>
              </div>
              <div className="w-full glass-morphism rounded-full h-2 sm:h-3">
                <div 
                  className="bg-green-500/80 h-2 sm:h-3 rounded-full transition-all duration-300 neon-glow"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-green-400/60">
                Loading block data and transaction details...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {blockData ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Block Header Card */}
          <Card className="glass-morphism cyber-border neon-glow">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-green-100/90 flex items-center space-x-2 text-lg sm:text-xl">
                <Layers size={24} />
                <span>Block #{blockData.number}</span>
                <Badge variant="outline" className="border-green-500/70 text-green-400/80 ml-auto text-xs bg-green-500/5">
                  Confirmed
                </Badge>
              </CardTitle>
              <p className="text-green-400/60 text-sm font-mono break-all">
                {blockData.hash}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-morphism p-4 rounded-lg cyber-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-blue-400/80" />
                    <span className="text-sm text-green-400/60">Timestamp</span>
                  </div>
                  <div className="text-green-100/90 font-semibold">
                    {formatDate(blockData.timestamp)}
                  </div>
                </div>
                
                <div className="glass-morphism p-4 rounded-lg cyber-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity size={16} className="text-green-400/80" />
                    <span className="text-sm text-green-400/60">Transactions</span>
                  </div>
                  <div className="text-green-100/90 font-semibold text-xl">
                    {blockData.transactions.length}
                  </div>
                </div>
                
                <div className="glass-morphism p-4 rounded-lg cyber-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={16} className="text-orange-400/80" />
                    <span className="text-sm text-green-400/60">Gas Used</span>
                  </div>
                  <div className="text-green-100/90 font-semibold">
                    {formatNumber(blockData.gasUsed)}
                  </div>
                  <div className="text-xs text-green-400/50">
                    of {formatNumber(blockData.gasLimit)} limit
                  </div>
                </div>
                
                <div className="glass-morphism p-4 rounded-lg cyber-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database size={16} className="text-purple-400/80" />
                    <span className="text-sm text-green-400/60">Block Size</span>
                  </div>
                  <div className="text-green-100/90 font-semibold">
                    {(blockData.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-morphism cyber-border neon-glow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                  <Database size={20} />
                  <span>Block Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 glass-morphism rounded-lg">
                    <span className="text-green-400/60 text-sm">Miner</span>
                    <span className="text-green-100/90 font-mono text-sm break-all max-w-48">
                      {blockData.miner}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-morphism rounded-lg">
                    <span className="text-green-400/60 text-sm">Difficulty</span>
                    <span className="text-green-100/90 font-semibold">
                      {formatNumber(blockData.difficulty)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-morphism rounded-lg">
                    <span className="text-green-400/60 text-sm">Gas Utilization</span>
                    <span className="text-green-100/90 font-semibold">
                      {((parseInt(blockData.gasUsed) / parseInt(blockData.gasLimit)) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border neon-glow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-green-100/90 flex items-center space-x-2 text-base sm:text-lg">
                  <Activity size={20} />
                  <span>Transaction Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 glass-morphism rounded-lg">
                    <div className="text-3xl font-bold text-green-100/90 mb-2">
                      {blockData.transactions.length}
                    </div>
                    <div className="text-green-400/60 text-sm">Total Transactions</div>
                  </div>
                  {blockData.transactions.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {blockData.transactions.slice(0, 5).map((tx, index) => (
                        <div key={index} className="p-2 glass-morphism rounded text-xs font-mono text-green-100/80 break-all">
                          {tx}
                        </div>
                      ))}
                      {blockData.transactions.length > 5 && (
                        <div className="text-center text-green-400/60 text-xs p-2">
                          +{blockData.transactions.length - 5} more transactions
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : !isScanning ? (
        <Card className="glass-morphism cyber-border neon-glow">
          <CardContent className="p-8 sm:p-16 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-600/80 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 neon-glow">
              <Layers className="text-white" size={32} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400/90 via-emerald-400/90 to-lime-400/90 bg-clip-text text-transparent mb-3 sm:mb-4">
              Block Explorer
            </h3>
            <p className="text-green-400/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6">
              Explore individual blocks on the MegaETH blockchain. Get detailed information about 
              block contents, transactions, gas usage, and mining details.
            </p>
            {latestBlock > 0 && (
              <div className="text-sm text-green-400/70">
                Latest block: #{latestBlock.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
