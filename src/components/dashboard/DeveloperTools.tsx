
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
        <h1 className="text-2xl font-bold">Dev Tools</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Console
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            Department
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            Top Tools
          </button>
        </div>
      </div>

      {/* Contract Verification */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Contract Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verifiedContracts.map((contract, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  {contract.verified ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <Clock className="text-yellow-400" size={20} />
                  )}
                  <div>
                    <div className="font-semibold">{contract.name}</div>
                    <div className="text-sm text-gray-400 font-mono">{contract.address}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${contract.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {contract.verified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-sm text-gray-400">{contract.deployedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
              {deploymentLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 mb-2">
                  <span className="text-gray-500">{log.timestamp}</span>
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <span className="text-white">{log.message}</span>
                    <span className="text-blue-400 ml-2">{log.contract}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Latest Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestDeployments.map((deployment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {deployment.status === "success" ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : (
                      <Clock className="text-yellow-400 animate-spin" size={20} />
                    )}
                    <span className="font-semibold">{deployment.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${deployment.status === "success" ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deployment.status === "success" ? 'Deployed' : 'Deploying...'}
                    </div>
                    <div className="text-sm text-gray-400">{deployment.time}</div>
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
