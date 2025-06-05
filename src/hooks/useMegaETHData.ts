
import { useState, useEffect } from 'react';
import { megaethAPI } from '@/services/megaethApi';

interface ChainMetrics {
  blockHeight: number;
  blockTime: number;
  gasPrice: number;
  tps: number;
  lastUpdated: Date;
}

interface BlockData {
  number: number;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  transactions: any[];
}

export const useMegaETHData = () => {
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics>({
    blockHeight: 0,
    blockTime: 0,
    gasPrice: 0,
    tps: 0,
    lastUpdated: new Date()
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<BlockData[]>([]);

  const fetchChainData = async () => {
    try {
      setError(null);
      
      // Fetch current block number
      const currentBlock = await megaethAPI.getBlockNumber();
      
      // Fetch current gas price
      const gasPriceWei = await megaethAPI.getGasPrice();
      const gasPriceGwei = megaethAPI.weiToGwei(gasPriceWei);
      
      // Fetch latest block details
      const latestBlock = await megaethAPI.getBlock('latest');
      
      // Calculate block time (simplified - using timestamp difference)
      let blockTime = 0;
      if (recentBlocks.length > 0) {
        const lastBlock = recentBlocks[recentBlocks.length - 1];
        blockTime = (parseInt(latestBlock.timestamp, 16) - lastBlock.timestamp) * 1000; // Convert to ms
      }
      
      // Calculate TPS (transactions per second based on latest block)
      const tps = latestBlock.transactions ? latestBlock.transactions.length : 0;
      
      setChainMetrics({
        blockHeight: currentBlock,
        blockTime: blockTime || 50, // Default to 50ms if no previous data
        gasPrice: gasPriceGwei,
        tps: tps,
        lastUpdated: new Date()
      });

      // Update recent blocks for trend analysis
      const newBlockData: BlockData = {
        number: parseInt(latestBlock.number, 16),
        timestamp: parseInt(latestBlock.timestamp, 16),
        gasUsed: latestBlock.gasUsed,
        gasLimit: latestBlock.gasLimit,
        transactions: latestBlock.transactions || []
      };

      setRecentBlocks(prev => {
        const updated = [...prev, newBlockData].slice(-20); // Keep last 20 blocks
        return updated;
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch chain data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchChainData();

    // Set up polling every 2 seconds to get near real-time data
    const interval = setInterval(fetchChainData, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    chainMetrics,
    recentBlocks,
    isLoading,
    error,
    refetch: fetchChainData
  };
};
