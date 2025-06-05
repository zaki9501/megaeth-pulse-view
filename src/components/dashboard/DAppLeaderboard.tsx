
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
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Data range</span>
          <div className="flex space-x-1">
            {timeRanges.map(range => (
              <Button key={range} variant="outline" size="sm" className="bg-gray-700 border-gray-600">
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
            className={category === "All" ? "bg-blue-600" : "bg-gray-700 border-gray-600"}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Top dApps</span>
            <div className="flex space-x-4 text-sm text-gray-400">
              <span>Gas Use (24h)</span>
              <span>Unique Users</span>
              <span>Volume</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {dapps.map((dapp, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors group">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm w-6">{dapp.rank}</span>
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center text-sm">
                    {dapp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{dapp.name}</span>
                      {dapp.status && <span>{dapp.status}</span>}
                    </div>
                    <span className="text-sm text-gray-400">{dapp.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="font-semibold">{dapp.gasUsed}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{dapp.uniqueUsers}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{dapp.volume}</div>
                  </div>
                  <div className="w-16 h-8 bg-gray-700 rounded flex items-center justify-center">
                    <div className="w-12 h-2 bg-blue-600 rounded"></div>
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
