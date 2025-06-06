
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Clock, Fuel, Hash, User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { megaethAPI } from "@/services/megaethApi";

interface TransactionDetailsProps {
  transactionHash: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TransactionData {
  hash: string;
  blockNumber: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed?: string;
  status?: string;
  input: string;
  nonce: string;
  timestamp?: number;
}

export const TransactionDetails = ({ transactionHash, isOpen, onClose }: TransactionDetailsProps) => {
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && transactionHash) {
      fetchTransactionDetails();
    }
  }, [isOpen, transactionHash]);

  const fetchTransactionDetails = async () => {
    if (!transactionHash) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch transaction data
      const txData = await megaethAPI.getTransactionByHash(transactionHash);
      
      if (!txData) {
        throw new Error("Transaction not found");
      }
      
      setTransaction(txData);
      
      // Fetch transaction receipt
      try {
        const receiptData = await megaethAPI.getTransactionReceipt(transactionHash);
        setReceipt(receiptData);
      } catch (receiptError) {
        console.log("Receipt not available yet");
      }
      
    } catch (err) {
      console.error("Failed to fetch transaction details:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transaction details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: string) => {
    if (!value) return "0";
    const ethValue = megaethAPI.weiToEther(value);
    return `${ethValue.toFixed(6)} ETH`;
  };

  const formatGasPrice = (gasPrice: string) => {
    if (!gasPrice) return "0";
    const gwei = megaethAPI.weiToGwei(gasPrice);
    return `${gwei.toFixed(2)} Gwei`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Hash className="text-blue-400" size={20} />
            <span>Transaction Details</span>
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {transaction && (
          <div className="space-y-6">
            {/* Transaction Hash */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Hash</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="font-mono text-sm break-all">{transaction.hash}</span>
                  <button
                    onClick={() => copyToClipboard(transaction.hash)}
                    className="ml-2 p-1 hover:bg-gray-600 rounded"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            {receipt && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={receipt.status === "0x1" ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {receipt.status === "0x1" ? "Success" : "Failed"}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="text-green-400" size={18} />
                    <span>From & To</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">From</p>
                    <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="font-mono text-sm">{formatAddress(transaction.from)}</span>
                      <button
                        onClick={() => copyToClipboard(transaction.from)}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">To</p>
                    <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="font-mono text-sm">{formatAddress(transaction.to || "Contract Creation")}</span>
                      {transaction.to && (
                        <button
                          onClick={() => copyToClipboard(transaction.to)}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Fuel className="text-blue-400" size={18} />
                    <span>Value & Gas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Value:</span>
                    <span className="font-semibold">{formatValue(transaction.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Limit:</span>
                    <span>{parseInt(transaction.gas, 16).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Price:</span>
                    <span>{formatGasPrice(transaction.gasPrice)}</span>
                  </div>
                  {receipt && receipt.gasUsed && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Used:</span>
                      <span>{parseInt(receipt.gasUsed, 16).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nonce:</span>
                    <span>{parseInt(transaction.nonce, 16)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Block Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="text-purple-400" size={18} />
                  <span>Block Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Block Number:</span>
                    <span className="font-semibold">{parseInt(transaction.blockNumber, 16)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction Index:</span>
                    <span>{parseInt(transaction.transactionIndex, 16)}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-400 text-sm mb-1">Block Hash</p>
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="font-mono text-sm break-all">{transaction.blockHash}</span>
                    <button
                      onClick={() => copyToClipboard(transaction.blockHash)}
                      className="ml-2 p-1 hover:bg-gray-600 rounded"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input Data */}
            {transaction.input && transaction.input !== "0x" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Input Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                      {transaction.input}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Logs (if available) */}
            {receipt && receipt.logs && receipt.logs.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Logs ({receipt.logs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {receipt.logs.map((log: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-700 rounded text-sm">
                        <div className="font-mono text-blue-400">{formatAddress(log.address)}</div>
                        <div className="text-gray-400 text-xs">Topics: {log.topics.length}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
