
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  }>>([]);

  useEffect(() => {
    if (data.length === 0) {
      // Fallback to mock data if no real data available
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.floor(Math.random() * (type === "tps" ? 1000 : 100)) + (type === "tps" ? 500 : 50),
        blockNumber: 1000000 + i,
        timestamp: Date.now() - (19 - i) * 2000
      }));
      setChartData(mockData);
      return;
    }

    // Convert real blockchain data to chart format
    const processedData = data.slice(-20).map((block, index) => {
      let value: number;
      
      if (type === "tps") {
        value = block.transactionCount || block.transactions.length;
      } else {
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        value = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0;
      }

      return {
        time: index,
        value: Math.round(value),
        blockNumber: block.number,
        timestamp: block.timestamp * 1000,
        gasUsed: parseInt(block.gasUsed, 16),
        gasLimit: parseInt(block.gasLimit, 16)
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

  const getYAxisLabel = () => {
    return type === "tps" ? "Transactions" : "Gas Usage %";
  };

  const getStrokeColor = () => {
    return type === "tps" ? "#3B82F6" : "#10B981";
  };

  const getFillColor = () => {
    return type === "tps" ? "#3B82F620" : "#10B98120";
  };

  const chartConfig = {
    value: {
      label: type === "tps" ? "Transactions" : "Gas Usage %",
      color: getStrokeColor(),
    },
  };

  const formatTooltipLabel = (label: any, payload: any) => {
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      if (data.blockNumber) {
        return `Block #${data.blockNumber.toLocaleString()}`;
      }
    }
    return `Point ${label}`;
  };

  const formatTooltipValue = (value: any, name: any, props: any) => {
    const data = props.payload;
    
    if (type === "tps") {
      return [
        `${value} transactions`,
        "Transactions"
      ];
    } else {
      const gasUsed = data.gasUsed?.toLocaleString() || "N/A";
      const gasLimit = data.gasLimit?.toLocaleString() || "N/A";
      return [
        <>
          <div>{value.toFixed(1)}% usage</div>
          <div className="text-xs text-muted-foreground">
            {gasUsed} / {gasLimit} gas
          </div>
        </>,
        "Gas Usage"
      ];
    }
  };

  return (
    <div className="h-80">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getStrokeColor()} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getStrokeColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
              }}
              domain={type === "gas" ? [0, 100] : ['dataMin - 10', 'dataMax + 10']}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={formatTooltipLabel}
                  formatter={formatTooltipValue}
                  className="w-56"
                />
              }
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={getStrokeColor()} 
              strokeWidth={3}
              dot={{ fill: getStrokeColor(), strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: getStrokeColor(),
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
              fill={`url(#gradient-${type})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
