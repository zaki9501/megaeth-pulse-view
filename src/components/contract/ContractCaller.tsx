
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Play, AlertCircle } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

export const ContractCaller = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [functionData, setFunctionData] = useState("");
  const [callResult, setCallResult] = useState<string>("");
  const [gasEstimate, setGasEstimate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCall = async () => {
    if (!contractAddress.trim() || !functionData.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const transaction = {
        to: contractAddress,
        data: functionData
      };

      const [result, gasEst] = await Promise.all([
        megaethAPI.call(transaction),
        megaethAPI.estimateGas(transaction).catch(() => "N/A")
      ]);

      setCallResult(result);
      setGasEstimate(gasEst);
    } catch (err) {
      console.error('Failed to execute call:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute call');
    } finally {
      setIsLoading(false);
    }
  };

  const commonFunctions = [
    { name: "name()", data: "0x06fdde03", description: "Get token name" },
    { name: "symbol()", data: "0x95d89b41", description: "Get token symbol" },
    { name: "decimals()", data: "0x313ce567", description: "Get token decimals" },
    { name: "totalSupply()", data: "0x18160ddd", description: "Get total supply" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 text-yellow-400" size={20} />
            Function Caller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Contract Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Function Data (Hex)</label>
            <input
              type="text"
              placeholder="0x..."
              value={functionData}
              onChange={(e) => setFunctionData(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <button
            onClick={executeCall}
            disabled={isLoading || !contractAddress || !functionData}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            <Play size={16} />
            <span>{isLoading ? 'Executing...' : 'Execute Call'}</span>
          </button>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {callResult && (
            <div className="space-y-2">
              <label className="text-sm text-gray-400 block">Result</label>
              <div className="font-mono text-green-400 bg-gray-700 p-3 rounded break-all">
                {callResult}
              </div>
              {gasEstimate !== "N/A" && (
                <div className="text-sm text-gray-400">
                  Estimated Gas: {parseInt(gasEstimate, 16).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Functions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Common ERC-20 Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonFunctions.map((func, index) => (
              <button
                key={index}
                onClick={() => setFunctionData(func.data)}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-left transition-colors"
              >
                <div className="font-semibold text-white">{func.name}</div>
                <div className="text-sm text-gray-400">{func.description}</div>
                <div className="text-xs text-blue-400 font-mono mt-1">{func.data}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
