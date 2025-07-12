
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
    <Card className="professional-card hover:bg-accent/50 transition-all duration-200 group professional-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">{value}</p>
            <div className={cn(
              "flex items-center space-x-1 mt-2 text-sm transition-all duration-200",
              isPositive ? "text-primary" : "text-destructive"
            )}>
              {isPositive ? <TrendingUp size={16} className="group-hover:scale-110 transition-transform duration-200" /> : <TrendingDown size={16} className="group-hover:scale-110 transition-transform duration-200" />}
              <span>{change}</span>
            </div>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 group-hover:scale-110 transition-all duration-200">
            <Icon className="text-primary transition-colors" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
