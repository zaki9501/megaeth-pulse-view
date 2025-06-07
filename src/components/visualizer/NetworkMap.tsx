
import { useState, useEffect } from "react";
import { Circle, ArrowRight } from "lucide-react";

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
    // Generate network nodes
    const mockNodes: NetworkNode[] = [
      {
        id: 'center',
        address: walletAddress,
        x: 50,
        y: 50,
        type: 'wallet',
        connections: ['node1', 'node2', 'node3', 'node4'],
        txCount: 47
      },
      {
        id: 'node1',
        address: '0x742d35cc...8c5b',
        x: 80,
        y: 30,
        type: 'contract',
        connections: ['center'],
        txCount: 12
      },
      {
        id: 'node2',
        address: '0x8ba1f109...9c4d',
        x: 20,
        y: 25,
        type: 'wallet',
        connections: ['center'],
        txCount: 8
      },
      {
        id: 'node3',
        address: '0x1f9840a8...5ad5',
        x: 75,
        y: 75,
        type: 'dex',
        connections: ['center'],
        txCount: 23
      },
      {
        id: 'node4',
        address: '0xa0b86991...d426',
        x: 25,
        y: 70,
        type: 'contract',
        connections: ['center'],
        txCount: 5
      }
    ];

    setNodes(mockNodes);

    // Simulate active connections
    const interval = setInterval(() => {
      const randomNode = mockNodes[Math.floor(Math.random() * mockNodes.length)];
      setActiveConnection(randomNode.id);
      
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
        <div className="text-white font-bold text-lg">{nodes.length - 1}</div>
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
