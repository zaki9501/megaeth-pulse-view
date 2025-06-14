
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
    <Card className="glass-morphism cyber-border hover:bg-green-500/10 transition-all duration-300 group neon-glow hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-400/70 mb-1">{title}</p>
            <p className="text-2xl font-bold text-green-100 group-hover:text-white transition-colors">{value}</p>
            <div className={cn(
              "flex items-center space-x-1 mt-2 text-sm transition-all duration-300",
              isPositive ? "text-green-400 group-hover:text-green-300" : "text-red-400 group-hover:text-red-300"
            )}>
              {isPositive ? <TrendingUp size={16} className="group-hover:scale-110 transition-transform duration-300" /> : <TrendingDown size={16} className="group-hover:scale-110 transition-transform duration-300" />}
              <span>{change}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30 group-hover:scale-110 transition-all duration-300 neon-glow">
            <Icon className="text-green-400 group-hover:text-green-300 transition-colors" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
