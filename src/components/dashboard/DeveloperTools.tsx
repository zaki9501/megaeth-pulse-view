
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Zap } from "lucide-react";

export const DeveloperTools = () => {
  const verifiedContracts = [
    { name: "TotalForm", address: "0x742d35...", verified: true, deployedAt: "2 hours ago" },
    { name: "NFTMarket", address: "0x108f87...", verified: false, deployedAt: "4 hours ago" },
    { name: "MilelaK", address: "0x103g45...", verified: true, deployedAt: "6 hours ago" },
  ];

  const deploymentLogs = [
    { timestamp: "14:23:05", level: "info", message: "Contract verification successful", contract: "MegaSwap.sol" },
    { timestamp: "14:22:58", level: "warning", message: "Notice mismatch", contract: "VotifIcon" },
    { timestamp: "14:22:45", level: "success", message: "hotline_ror-rods deployed", contract: "NeavaSwap.sol" },
    { timestamp: "14:22:30", level: "error", message: "mcratio deployment failed", contract: "Creotheheari.test" },
  ];

  const latestDeployments = [
    { name: "Decreased Vitrileen", status: "success", time: "2 min ago" },
    { name: "MegaSwap.sol", status: "pending", time: "5 min ago" },
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="text-green-400" size={16} />;
      case "error":
        return <XCircle className="text-red-400" size={16} />;
      case "warning":
        return <Clock className="text-yellow-400" size={16} />;
      default:
        return <Zap className="text-blue-400" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
          Dev Tools
        </h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all duration-300 font-semibold neon-glow">
            Console
          </button>
          <button className="px-4 py-2 glass-morphism cyber-border text-green-300 rounded-lg hover:bg-green-500/20 hover:text-green-100 transition-all duration-300">
            Department
          </button>
          <button className="px-4 py-2 glass-morphism cyber-border text-green-300 rounded-lg hover:bg-green-500/20 hover:text-green-100 transition-all duration-300">
            Top Tools
          </button>
        </div>
      </div>

      {/* Contract Verification */}
      <Card className="glass-morphism cyber-border neon-glow">
        <CardHeader>
          <CardTitle className="text-green-100">Contract Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verifiedContracts.map((contract, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass-morphism cyber-border rounded-lg hover:bg-green-500/10 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  {contract.verified ? (
                    <CheckCircle className="text-green-400 group-hover:scale-110 transition-transform duration-300" size={20} />
                  ) : (
                    <Clock className="text-yellow-400 animate-pulse group-hover:scale-110 transition-transform duration-300" size={20} />
                  )}
                  <div>
                    <div className="font-semibold text-green-100 group-hover:text-white transition-colors">{contract.name}</div>
                    <div className="text-sm text-green-400/70 font-mono">{contract.address}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${contract.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {contract.verified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-sm text-green-400/70">{contract.deployedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="text-green-100">Deployment Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/80 border border-green-500/30 rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
              {deploymentLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 mb-2 hover:bg-green-500/5 p-1 rounded transition-colors">
                  <span className="text-green-500/70">{log.timestamp}</span>
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <span className="text-green-100">{log.message}</span>
                    <span className="text-emerald-400 ml-2">{log.contract}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism cyber-border neon-glow">
          <CardHeader>
            <CardTitle className="text-green-100">Latest Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestDeployments.map((deployment, index) => (
                <div key={index} className="flex items-center justify-between p-4 glass-morphism cyber-border rounded-lg hover:bg-green-500/10 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    {deployment.status === "success" ? (
                      <CheckCircle className="text-green-400 group-hover:scale-110 transition-transform duration-300" size={20} />
                    ) : (
                      <Clock className="text-yellow-400 animate-spin group-hover:scale-110 transition-transform duration-300" size={20} />
                    )}
                    <span className="font-semibold text-green-100 group-hover:text-white transition-colors">{deployment.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${deployment.status === "success" ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deployment.status === "success" ? 'Deployed' : 'Deploying...'}
                    </div>
                    <div className="text-sm text-green-400/70">{deployment.time}</div>
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
