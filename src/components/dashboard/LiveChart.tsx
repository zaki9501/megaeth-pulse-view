
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

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
  const [chartData, setChartData] = useState<Array<{ time: number; value: number }>>([]);

  useEffect(() => {
    if (data.length === 0) {
      // Fallback to mock data if no real data available
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.floor(Math.random() * (type === "tps" ? 1000 : 100)) + (type === "tps" ? 500 : 50)
      }));
      setChartData(mockData);
      return;
    }

    // Convert real blockchain data to chart format
    const processedData = data.slice(-20).map((block, index) => {
      let value: number;
      
      if (type === "tps") {
        // Calculate transaction count (since we get hashes, not full transactions)
        value = block.transactionCount || block.transactions.length;
      } else {
        // Calculate gas usage percentage
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        value = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0;
      }

      return {
        time: index,
        value: Math.round(value)
      };
    });

    setChartData(processedData);
  }, [data, type]);

  // Update chart data periodically if using mock data
  useEffect(() => {
    if (data.length > 0) return; // Don't update if we have real data

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: prevData[prevData.length - 1].time + 1,
          value: Math.floor(Math.random() * (type === "tps" ? 1000 : 100)) + (type === "tps" ? 500 : 50)
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

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={getStrokeColor()} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: getStrokeColor() }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
