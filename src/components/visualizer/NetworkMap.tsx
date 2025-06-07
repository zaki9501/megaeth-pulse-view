
import { useState, useEffect } from "react";
import { Circle, ArrowRight } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

interface NetworkNode {
  id: string;
  address: string;
  x: number;
  y: number;
  type: 'wallet' | 'contract' | 'dex';
  connections: string[];
  txCount: number;
}

interface NetworkMapProps {
  walletAddress: string;
}

export const NetworkMap = ({ walletAddress }: NetworkMapProps) => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [activeConnection, setActiveConnection] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!walletAddress) return;
      
      try {
        const currentBlock = await megaethAPI.getBlockNumber();
        const connectedAddresses = new Map<string, { count: number; isContract: boolean }>();
        
        // Analyze last 10 blocks for network connections
        for (let i = 0; i < 10; i++) {
          const blockNum = currentBlock - i;
          try {
            const block = await megaethAPI.getBlock(blockNum);
            
            if (block && block.transactions) {
              for (const txHash of block.transactions.slice(0, 3)) {
                try {
                  const tx = await megaethAPI.getTransactionByHash(txHash);
                  
                  if (tx && (tx.from?.toLowerCase() === walletAddress.toLowerCase() || 
                           tx.to?.toLowerCase() === walletAddress.toLowerCase())) {
                    
                    const otherAddress = tx.from?.toLowerCase() === walletAddress.toLowerCase() ? tx.to : tx.from;
                    
                    if (otherAddress && otherAddress !== walletAddress.toLowerCase()) {
                      const existing = connectedAddresses.get(otherAddress) || { count: 0, isContract: false };
                      
                      // Check if it's a contract (simplified check)
                      const isContract = await megaethAPI.isContract(otherAddress);
                      
                      connectedAddresses.set(otherAddress, {
                        count: existing.count + 1,
                        isContract
                      });
                    }
                  }
                } catch (error) {
                  console.log(`Error analyzing network transaction:`, error);
                }
              }
            }
          } catch (error) {
            console.log(`Error fetching block for network:`, error);
          }
        }
        
        // Create network nodes from real data
        const networkNodes: NetworkNode[] = [
          {
            id: 'center',
            address: walletAddress,
            x: 50,
            y: 50,
            type: 'wallet',
            connections: [],
            txCount: connectedAddresses.size
          }
        ];
        
        // Add connected addresses as nodes
        const positions = [
          { x: 80, y: 30 },
          { x: 20, y: 25 },
          { x: 75, y: 75 },
          { x: 25, y: 70 },
          { x: 85, y: 50 },
          { x: 15, y: 50 }
        ];
        
        let nodeIndex = 0;
        for (const [address, data] of Array.from(connectedAddresses.entries()).slice(0, 6)) {
          const pos = positions[nodeIndex] || { x: 50 + (nodeIndex * 10), y: 30 + (nodeIndex * 15) };
          
          networkNodes.push({
            id: `node${nodeIndex + 1}`,
            address: `${address.slice(0, 10)}...${address.slice(-4)}`,
            x: pos.x,
            y: pos.y,
            type: data.isContract ? 'contract' : 'wallet',
            connections: ['center'],
            txCount: data.count
          });
          
          networkNodes[0].connections.push(`node${nodeIndex + 1}`);
          nodeIndex++;
        }
        
        // Fallback to mock data if no real connections found
        if (networkNodes.length === 1) {
          const mockNodes: NetworkNode[] = [
            {
              id: 'center',
              address: walletAddress,
              x: 50,
              y: 50,
              type: 'wallet',
              connections: ['node1', 'node2'],
              txCount: 0
            },
            {
              id: 'node1',
              address: 'No connections',
              x: 75,
              y: 35,
              type: 'wallet',
              connections: ['center'],
              txCount: 0
            },
            {
              id: 'node2',
              address: 'found yet',
              x: 25,
              y: 65,
              type: 'wallet',
              connections: ['center'],
              txCount: 0
            }
          ];
          setNodes(mockNodes);
        } else {
          setNodes(networkNodes);
        }
        
      } catch (error) {
        console.error('Error fetching network data:', error);
      }
    };

    fetchNetworkData();

    // Simulate active connections
    const interval = setInterval(() => {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setActiveConnection(randomNode?.id || null);
      
      setTimeout(() => setActiveConnection(null), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, [walletAddress]);

  const getNodeColor = (type: string, isActive: boolean) => {
    const colors = {
      wallet: isActive ? 'border-purple-400 bg-purple-500/30' : 'border-purple-500 bg-purple-600/20',
      contract: isActive ? 'border-cyan-400 bg-cyan-500/30' : 'border-cyan-500 bg-cyan-600/20',
      dex: isActive ? 'border-green-400 bg-green-500/30' : 'border-green-500 bg-green-600/20'
    };
    return colors[type as keyof typeof colors] || colors.wallet;
  };

  const renderConnection = (from: NetworkNode, to: NetworkNode, isActive: boolean) => {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    return (
      <line
        key={`${from.id}-${to.id}`}
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={isActive ? '#00ffff' : '#4b5563'}
        strokeWidth={isActive ? '2' : '1'}
        strokeDasharray={isActive ? '0' : '5,5'}
        className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}
      />
    );
  };

  const centerNode = nodes.find(n => n.id === 'center');

  return (
    <div className="relative h-64 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {/* Render connections */}
        {centerNode && nodes.filter(n => n.id !== 'center').map(node => 
          renderConnection(centerNode, node, activeConnection === node.id || activeConnection === 'center')
        )}
        
        {/* Orbital rings */}
        <circle
          cx="50%"
          cy="50%"
          r="25%"
          fill="none"
          stroke="#374151"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.3"
        />
        <circle
          cx="50%"
          cy="50%"
          r="35%"
          fill="none"
          stroke="#374151"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.2"
        />
      </svg>

      {/* Render nodes */}
      {nodes.map(node => (
        <div
          key={node.id}
          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            getNodeColor(node.type, activeConnection === node.id)
          } ${activeConnection === node.id ? 'scale-125 shadow-lg shadow-current/50' : ''}`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Circle size={12} fill="currentColor" />
          
          {/* Pulse effect for active nodes */}
          {activeConnection === node.id && (
            <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75" />
          )}
          
          {/* Node info tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs font-mono opacity-0 hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            <div className="text-white">{node.address}</div>
            <div className="text-gray-400">{node.txCount} txs</div>
            <div className={`text-${node.type === 'wallet' ? 'purple' : node.type === 'contract' ? 'cyan' : 'green'}-400`}>
              {node.type.toUpperCase()}
            </div>
          </div>
        </div>
      ))}

      {/* Network stats */}
      <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm border border-green-500/30">
        <div className="text-green-400 font-mono text-sm mb-1">NETWORK NODES</div>
        <div className="text-white font-bold text-lg">{Math.max(nodes.length - 1, 0)}</div>
        <div className="text-xs text-gray-400">CONNECTED</div>
      </div>

      {/* Activity indicator */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs font-mono">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-400">MAPPING</span>
      </div>
    </div>
  );
};
