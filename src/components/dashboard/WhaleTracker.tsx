
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";

export const WhaleTracker = () => {
  const whaleActivities = [
    {
      type: "bridge",
      wallet: "Whale X",
      amount: "100,000 METH",
      direction: "L1 → L2",
      time: "2 minutes ago",
      icon: ArrowDownLeft,
      color: "text-green-400"
    },
    {
      type: "transfer", 
      wallet: "0x1a2b3c...",
      amount: "50,000 METH",
      direction: "Transfer",
      time: "5 minutes ago", 
      icon: ArrowUpRight,
      color: "text-blue-400"
    },
    {
      type: "deploy",
      wallet: "Builder Y",
      amount: "Contract Deploy",
      direction: "MegaSwap",
      time: "12 minutes ago",
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      type: "bridge",
      wallet: "Whale Z",
      amount: "250,000 METH", 
      direction: "L2 → L1",
      time: "18 minutes ago",
      icon: ArrowUpRight,
      color: "text-red-400"
    }
  ];

  const topWallets = [
    { address: "0x742d35Cc123", balance: "2.33M METH", label: "Whale Joe" },
    { address: "0x108M", balance: "1.08M", label: "MegaLost" },
    { address: "0x103M", balance: "1.03M", label: "MegaLend" },
    { address: "0x085M", balance: "0.85M", label: "PlasiPets" },
    { address: "0x567M", balance: "0.567M", label: "EthMail" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallet Tracker</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live tracking</span>
        </div>
      </div>

      {/* Live Activity Feed */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Live Whale Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {whaleActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-gray-600 ${activity.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{activity.wallet}</div>
                      <div className="text-sm text-gray-400">{activity.direction}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{activity.amount}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Top Wallets by Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topWallets.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-mono text-sm">{wallet.address}</div>
                      <div className="text-xs text-gray-400">{wallet.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{wallet.balance}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>New Active Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { address: "0x9a8b7c6d...", firstSeen: "5 min ago", dapp: "MegaSwap" },
                { address: "0x5e4f3g2h...", firstSeen: "12 min ago", dapp: "PlasiPets" },
                { address: "0x1i2j3k4l...", firstSeen: "25 min ago", dapp: "MegaLend" },
                { address: "0x7m8n9o0p...", firstSeen: "1 hour ago", dapp: "EthMail" }
              ].map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-mono text-sm">{wallet.address}</div>
                    <div className="text-xs text-gray-400">First seen: {wallet.firstSeen}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-400">{wallet.dapp}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
