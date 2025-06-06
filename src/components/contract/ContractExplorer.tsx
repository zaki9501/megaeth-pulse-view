
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Code, Database, Zap, FileText, AlertCircle } from "lucide-react";
import { megaethAPI } from "@/services/megaethApi";

interface ContractData {
  address: string;
  bytecode: string;
  isContract: boolean;
  codeSize: number;
}

export const ContractExplorer = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [storageSlot, setStorageSlot] = useState("0");
  const [storageValue, setStorageValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeContract = async () => {
    if (!contractAddress.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [bytecode, isContract] = await Promise.all([
        megaethAPI.getCode(contractAddress),
        megaethAPI.isContract(contractAddress)
      ]);

      setContractData({
        address: contractAddress,
        bytecode,
        isContract,
        codeSize: (bytecode.length - 2) / 2 // Remove 0x prefix and divide by 2
      });
    } catch (err) {
      console.error('Failed to analyze contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze contract');
    } finally {
      setIsLoading(false);
    }
  };

  const readStorage = async () => {
    if (!contractData?.address || !contractData.isContract) return;
    
    try {
      const value = await megaethAPI.getStorageAt(contractData.address, `0x${parseInt(storageSlot).toString(16)}`);
      setStorageValue(value);
    } catch (err) {
      console.error('Failed to read storage:', err);
      setError(err instanceof Error ? err.message : 'Failed to read storage');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Smart Contract Explorer</h1>
      </div>

      {/* Contract Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 text-blue-400" size={20} />
            Contract Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter contract address (0x...)"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={analyzeContract}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {contractData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 text-green-400" size={20} />
                Contract Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Address</label>
                  <div className="font-mono text-blue-400 break-all bg-gray-700 p-2 rounded">
                    {contractData.address}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Type</label>
                  <div className={`flex items-center space-x-2 ${contractData.isContract ? 'text-green-400' : 'text-yellow-400'}`}>
                    <Code size={16} />
                    <span>{contractData.isContract ? 'Smart Contract' : 'Externally Owned Account (EOA)'}</span>
                  </div>
                </div>

                {contractData.isContract && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Code Size</label>
                    <div className="text-white">
                      {contractData.codeSize.toLocaleString()} bytes
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Storage Reader */}
          {contractData.isContract && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 text-purple-400" size={20} />
                  Storage Reader
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Storage slot (0, 1, 2...)"
                    value={storageSlot}
                    onChange={(e) => setStorageSlot(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <button
                    onClick={readStorage}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    Read
                  </button>
                </div>
                
                {storageValue && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Value at slot {storageSlot}</label>
                    <div className="font-mono text-green-400 bg-gray-700 p-2 rounded break-all">
                      {storageValue}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Decimal: {parseInt(storageValue, 16)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Bytecode Viewer */}
      {contractData?.isContract && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2 text-orange-400" size={20} />
              Contract Bytecode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 max-h-80 overflow-y-auto">
              <pre className="font-mono text-sm text-green-400 break-all whitespace-pre-wrap">
                {contractData.bytecode}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
