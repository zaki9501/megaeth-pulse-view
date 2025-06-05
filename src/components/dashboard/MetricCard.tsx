
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  change: string;
}

export const MetricCard = ({ title, value, icon: Icon, change }: MetricCardProps) => {
  const isPositive = change.startsWith("+");
  
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={cn(
              "flex items-center space-x-1 mt-2 text-sm",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{change}</span>
            </div>
          </div>
          <div className="bg-blue-600/20 p-3 rounded-lg">
            <Icon className="text-blue-400" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
