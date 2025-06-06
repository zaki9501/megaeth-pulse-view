import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart, ComposedChart } from "recharts";
import { useState, useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Fuel } from "lucide-react";

interface LiveChartProps {
  type: "tps" | "gas";
  data?: Array<{
    number: number;
    timestamp: number;
    gasUsed: string;
    gasLimit: string;
    transactions: string[];
    transactionCount: number;
  }>;
}

export const LiveChart = ({ type, data = [] }: LiveChartProps) => {
  const [chartData, setChartData] = useState<Array<{ 
    time: number; 
    value: number; 
    blockNumber?: number;
    timestamp?: number;
    gasUsed?: number;
    gasLimit?: number;
    efficiency?: number;
    trend?: "up" | "down" | "stable";
  }>>([]);
  const [viewMode, setViewMode] = useState<"line" | "bar" | "area" | "combined">("combined");

  useEffect(() => {
    if (data.length === 0) {
      // Enhanced mock data with more realistic patterns
      const mockData = Array.from({ length: 20 }, (_, i) => {
        const baseValue = type === "tps" ? 800 : 65;
        const variance = type === "tps" ? 300 : 25;
        const value = Math.floor(Math.random() * variance) + baseValue;
        const prevValue = i > 0 ? baseValue + (Math.random() * variance) : value;
        
        const trend: "up" | "down" | "stable" = value > prevValue ? "up" : value < prevValue ? "down" : "stable";
        
        return {
          time: i,
          value,
          blockNumber: 1000000 + i,
          timestamp: Date.now() - (19 - i) * 2000,
          gasUsed: type === "gas" ? Math.floor(value * 300000) : undefined,
          gasLimit: type === "gas" ? 30000000 : undefined,
          efficiency: type === "gas" ? value : Math.floor(Math.random() * 20) + 80,
          trend
        };
      });
      setChartData(mockData);
      return;
    }

    // Enhanced real data processing
    const processedData = data.slice(-20).map((block, index) => {
      let value: number;
      let efficiency: number;
      
      if (type === "tps") {
        value = block.transactionCount || block.transactions.length;
        efficiency = Math.min((value / 1000) * 100, 100);
      } else {
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        value = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0;
        efficiency = value;
      }

      const prevValue = index > 0 ? (type === "tps" ? 
        (data[index - 1]?.transactionCount || 0) : 
        ((parseInt(data[index - 1]?.gasUsed || "0", 16) / parseInt(data[index - 1]?.gasLimit || "1", 16)) * 100)
      ) : value;

      const trend: "up" | "down" | "stable" = value > prevValue ? "up" : value < prevValue ? "down" : "stable";

      return {
        time: index,
        value: Math.round(value),
        blockNumber: block.number,
        timestamp: block.timestamp * 1000,
        gasUsed: parseInt(block.gasUsed, 16),
        gasLimit: parseInt(block.gasLimit, 16),
        efficiency: Math.round(efficiency),
        trend
      };
    });

    setChartData(processedData);
  }, [data, type]);

  // Update chart data periodically if using mock data
  useEffect(() => {
    if (data.length > 0) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastItem = prevData[prevData.length - 1];
        newData.push({
          time: lastItem.time + 1,
          value: Math.floor(Math.random() * (type === "tps" ? 1000 : 100)) + (type === "tps" ? 500 : 50),
          blockNumber: (lastItem.blockNumber || 1000000) + 1,
          timestamp: Date.now()
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [type, data.length]);

  const getMetrics = () => {
    if (chartData.length === 0) return { avg: 0, max: 0, min: 0, trend: 0 };
    
    const values = chartData.map(d => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const trend = values[values.length - 1] - values[values.length - 2] || 0;
    
    return { avg: Math.round(avg), max, min, trend };
  };

  const metrics = getMetrics();
  const isPositiveTrend = metrics.trend > 0;

  const chartConfig = {
    value: {
      label: type === "tps" ? "Transactions" : "Gas Usage %",
      color: type === "tps" ? "#3B82F6" : "#10B981",
    },
    efficiency: {
      label: type === "tps" ? "Network Efficiency" : "Gas Efficiency",
      color: type === "tps" ? "#8B5CF6" : "#F59E0B",
    },
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (viewMode) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              domain={type === "gas" ? [0, 100] : ['dataMin - 10', 'dataMax + 10']}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="value" 
              fill={chartConfig.value.color}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.8}
            />
          </BarChart>
        );
      
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`area-gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.value.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartConfig.value.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartConfig.value.color}
              fillOpacity={1}
              fill={`url(#area-gradient-${type})`}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "combined":
        return (
          <ComposedChart {...commonProps}>
            <defs>
              <linearGradient id={`combined-gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.value.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartConfig.value.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              fill={`url(#combined-gradient-${type})`}
              stroke={chartConfig.value.color}
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke={chartConfig.efficiency.color}
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.value.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartConfig.value.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartConfig.value.color}
              strokeWidth={3}
              dot={{ fill: chartConfig.value.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: chartConfig.value.color }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Header with Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {type === "tps" ? <Activity className="text-blue-400" size={20} /> : <Fuel className="text-green-400" size={20} />}
            <span className="font-semibold">
              {type === "tps" ? "Transaction Analytics" : "Gas Usage Analytics"}
            </span>
          </div>
          <Badge variant={isPositiveTrend ? "default" : "secondary"} className="flex items-center space-x-1">
            {isPositiveTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{isPositiveTrend ? "+" : ""}{metrics.trend}</span>
          </Badge>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
          {["line", "bar", "area", "combined"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === mode 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Average</div>
          <div className="text-lg font-semibold">{metrics.avg}{type === "gas" ? "%" : ""}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Maximum</div>
          <div className="text-lg font-semibold">{metrics.max}{type === "gas" ? "%" : ""}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Minimum</div>
          <div className="text-lg font-semibold">{metrics.min}{type === "gas" ? "%" : ""}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Trend</div>
          <div className={`text-lg font-semibold ${isPositiveTrend ? "text-green-400" : "text-red-400"}`}>
            {isPositiveTrend ? "↗" : "↘"} {Math.abs(metrics.trend)}{type === "gas" ? "%" : ""}
          </div>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700/50 p-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartConfig.value.color }}></div>
          <span className="text-gray-400">{chartConfig.value.label}</span>
        </div>
        {viewMode === "combined" && (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-1 rounded-full`} style={{ backgroundColor: chartConfig.efficiency.color }}></div>
            <span className="text-gray-400">{chartConfig.efficiency.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};
