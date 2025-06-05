
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

interface LiveChartProps {
  type: "tps" | "gas";
}

export const LiveChart = ({ type }: LiveChartProps) => {
  const [data, setData] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.floor(Math.random() * (type === "tps" ? 10000 : 100)) + (type === "tps" ? 5000 : 50)
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: prevData[prevData.length - 1].time + 1,
          value: Math.floor(Math.random() * (type === "tps" ? 10000 : 100)) + (type === "tps" ? 5000 : 50)
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
