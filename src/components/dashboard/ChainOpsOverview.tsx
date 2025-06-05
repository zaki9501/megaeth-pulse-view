
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, TrendingUp, Activity, Database, CheckCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { LiveChart } from "./LiveChart";
import { StatusIndicator } from "./StatusIndicator";

export const ChainOpsOverview = () => {
  const chainMetrics = [
    { title: "Block Height", value: "9,018,204", icon: Database, change: "+1.2%" },
    { title: "Block Time", value: "10.3 ms", icon: Clock, change: "-5.1%" },
    { title: "Gas Price", value: "152,35", icon: TrendingUp, change: "+2.4%" },
    { title: "TPS", value: "8,543", icon: Activity, change: "+15.7%" },
  ];

  const systemStatus: Array<{
    label: string;
    status: "online" | "good" | "warning" | "error" | "syncing";
    value: string;
  }> = [
    { label: "Sequencer Uptime", status: "online", value: "99.98%" },
    { label: "Latency Status", status: "good", value: "12ms" },
    { label: "L2→L1 Sync", status: "syncing", value: "5.2s" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chain Operations</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Real-time data</span>
        </div>
      </div>

      {/* Chain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chainMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* System Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="text-green-400" size={20} />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemStatus.map((status, index) => (
              <StatusIndicator key={index} {...status} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Transactions Per Second</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="tps" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Gas Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart type="gas" />
          </CardContent>
        </Card>
      </div>

      {/* Failed Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Failed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { hash: "0x89f3567263", error: "Out of Gas", time: "2s ago" },
              { hash: "0x12a4b67890", error: "Revert", time: "5s ago" },
              { hash: "0x56c2d89012", error: "Invalid Nonce", time: "12s ago" },
            ].map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="font-mono text-sm">{tx.hash}</span>
                  <span className="text-red-400 text-sm">{tx.error}</span>
                </div>
                <span className="text-gray-400 text-sm">{tx.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
