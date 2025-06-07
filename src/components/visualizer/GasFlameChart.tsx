
import { useState, useEffect } from "react";
import { Flame, TrendingUp } from "lucide-react";

interface GasFlameChartProps {
  gasData: number;
}

export const GasFlameChart = ({ gasData }: GasFlameChartProps) => {
  const [flameHeight, setFlameHeight] = useState(0);
  const [gasHistory, setGasHistory] = useState<number[]>([]);

  useEffect(() => {
    const intensity = Math.min((gasData / 2000000) * 100, 100);
    setFlameHeight(intensity);

    // Update gas history
    setGasHistory(prev => [...prev.slice(-10), gasData]);
  }, [gasData]);

  const generateFlameParticles = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="absolute bottom-0 w-2 h-8 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 rounded-full opacity-70 animate-pulse"
        style={{
          left: `${20 + i * 8}%`,
          height: `${Math.random() * flameHeight + 20}%`,
          animationDelay: `${i * 0.2}s`,
          animationDuration: `${0.8 + Math.random() * 0.4}s`
        }}
      />
    ));
  };

  return (
    <div className="h-48 relative bg-gradient-to-t from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      {/* Flame Container */}
      <div className="absolute bottom-0 left-0 right-0 h-full">
        {generateFlameParticles()}
        
        {/* Main Flame */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 bg-gradient-to-t from-orange-600 via-red-500 to-yellow-400 rounded-full transition-all duration-1000 opacity-80"
          style={{ height: `${flameHeight}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-400/50 to-yellow-300/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Gas Meter */}
      <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm border border-orange-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Flame className="text-orange-400" size={16} />
          <span className="text-orange-400 font-mono text-sm">GAS INTENSITY</span>
        </div>
        <div className="text-2xl font-bold text-white font-mono">
          {(gasData / 1000000).toFixed(1)}M
        </div>
        <div className="text-xs text-gray-400">GWEI CONSUMED</div>
      </div>

      {/* Gas History Graph */}
      <div className="absolute top-4 right-4 w-24 h-16 bg-gray-800/80 rounded-lg p-2 backdrop-blur-sm border border-orange-500/30">
        <div className="flex items-end justify-between h-full space-x-1">
          {gasHistory.slice(-6).map((gas, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-orange-500 to-yellow-400 rounded-sm flex-1"
              style={{ height: `${(gas / 2000000) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Heat Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Scanning Grid */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-orange-400"
            style={{ bottom: `${i * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};
