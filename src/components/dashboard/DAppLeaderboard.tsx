
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const DAppLeaderboard = () => {
  const timeRanges = ["24h", "7d", "30d"];
  const categories = ["All", "DeFi", "Gaming", "NFT", "Infra"];
  
  const dapps = [
    {
      rank: 1,
      name: "Whoadwap",
      category: "DeFi",
      gasUsed: "2900 METH",
      uniqueUsers: "192 METH",
      volume: "192 METH",
      trend: "up",
      status: "🔥",
      avatar: "🟢"
    },
    {
      rank: 2,
      name: "MegaLost",
      category: "Gaming",
      gasUsed: "530 MTH",
      uniqueUsers: "565 MTH",
      volume: "565 MTH", 
      trend: "up",
      status: "🔥",
      avatar: "🔵"
    },
    {
      rank: 3,
      name: "MegaLend",
      category: "DeFi",
      gasUsed: "182 Usd",
      uniqueUsers: "382 Volume",
      volume: "382 Volume",
      trend: "up",
      status: "",
      avatar: "🟡"
    },
    {
      rank: 4,
      name: "PlasiPets",
      category: "NFT",
      gasUsed: "5736",
      uniqueUsers: "223 Volume",
      volume: "223 Volume",
      trend: "down",
      status: "",
      avatar: "🔵"
    },
    {
      rank: 5,
      name: "EthMail",
      category: "Infra",
      gasUsed: "2360",
      uniqueUsers: "165 Volume",
      volume: "165 Volume",
      trend: "up",
      status: "",
      avatar: "⚫"
    },
    {
      rank: 6,
      name: "MegaBridge",
      category: "Infra",
      gasUsed: "200M",
      uniqueUsers: "146 Volume",
      volume: "146 Volume",
      trend: "up",
      status: "",
      avatar: "🔵"
    },
    {
      rank: 7,
      name: "Chartvide",
      category: "DeFi",
      gasUsed: "128.0",
      uniqueUsers: "1/0 Sparkling",
      volume: "1/0 Sparkling",
      trend: "up",
      status: "🆕",
      avatar: "🔵"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">
          DApp Leaderboard
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Data range</span>
          <div className="flex space-x-1">
            {timeRanges.map(range => (
              <Button 
                key={range} 
                variant="outline" 
                size="sm" 
                className="professional-button-secondary hover:bg-primary/10"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2">
        {categories.map(category => (
          <Button 
            key={category} 
            variant={category === "All" ? "default" : "outline"}
            size="sm"
            className={category === "All" ? 
              "professional-button" : 
              "professional-button-secondary hover:bg-primary/10"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="professional-card professional-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span>Top dApps</span>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>Gas Use (24h)</span>
              <span>Unique Users</span>
              <span>Volume</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {dapps.map((dapp, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-accent/50 rounded-lg transition-all duration-200 group border border-border/50 hover:border-primary/20">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground text-sm w-6 font-medium">{dapp.rank}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/20">
                    {dapp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{dapp.name}</span>
                      {dapp.status && <span>{dapp.status}</span>}
                    </div>
                    <span className="text-sm text-muted-foreground">{dapp.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="font-medium text-foreground">{dapp.gasUsed}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{dapp.uniqueUsers}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{dapp.volume}</div>
                  </div>
                  <div className="w-16 h-8 bg-secondary rounded flex items-center justify-center border border-border">
                    <div className="w-12 h-2 bg-primary rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
