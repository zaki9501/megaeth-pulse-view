interface RPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}

interface RPCResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

class MegaETHAPI {
  private readonly rpcUrl = 'https://carrot.megaeth.com/rpc';
  private requestId = 1;

  private async makeRPCCall<T>(method: string, params: any[] = []): Promise<T> {
    const request: RPCRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.requestId++
    };

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RPCResponse<T> = await response.json();
      
      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }

      return data.result as T;
    } catch (error) {
      console.error(`Failed to call ${method}:`, error);
      throw error;
    }
  }

  async getBlockNumber(): Promise<number> {
    const result = await this.makeRPCCall<string>('eth_blockNumber');
    return parseInt(result, 16);
  }

  async getBalance(address: string, blockTag: string = 'latest'): Promise<string> {
    const result = await this.makeRPCCall<string>('eth_getBalance', [address, blockTag]);
    return result;
  }

  async getGasPrice(): Promise<string> {
    const result = await this.makeRPCCall<string>('eth_gasPrice');
    return result;
  }

  async getBlock(blockNumber: string | number = 'latest'): Promise<any> {
    const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
    return await this.makeRPCCall('eth_getBlockByNumber', [blockParam, false]);
  }

  async getBlockWithTransactionHashes(blockNumber: string | number = 'latest'): Promise<any> {
    const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
    return await this.makeRPCCall('eth_getBlockByNumber', [blockParam, false]);
  }

  async getTransactionCount(address: string, blockTag: string = 'latest'): Promise<number> {
    const result = await this.makeRPCCall<string>('eth_getTransactionCount', [address, blockTag]);
    return parseInt(result, 16);
  }

  async getTransactionByHash(hash: string): Promise<any> {
    return await this.makeRPCCall('eth_getTransactionByHash', [hash]);
  }

  async getTransactionReceipt(hash: string): Promise<any> {
    return await this.makeRPCCall('eth_getTransactionReceipt', [hash]);
  }

  async getCode(address: string, blockTag: string = 'latest'): Promise<string> {
    return await this.makeRPCCall<string>('eth_getCode', [address, blockTag]);
  }

  async getStorageAt(address: string, position: string, blockTag: string = 'latest'): Promise<string> {
    return await this.makeRPCCall<string>('eth_getStorageAt', [address, position, blockTag]);
  }

  async call(transaction: any, blockTag: string = 'latest'): Promise<string> {
    return await this.makeRPCCall<string>('eth_call', [transaction, blockTag]);
  }

  async estimateGas(transaction: any): Promise<string> {
    return await this.makeRPCCall<string>('eth_estimateGas', [transaction]);
  }

  async isContract(address: string): Promise<boolean> {
    const code = await this.getCode(address);
    return code !== '0x' && code.length > 2;
  }

  async getBlockByHash(blockHash: string): Promise<any> {
    return await this.makeRPCCall('eth_getBlockByHash', [blockHash, false]);
  }

  // Helper method to convert Wei to Ether
  weiToEther(wei: string): number {
    return parseInt(wei, 16) / Math.pow(10, 18);
  }

  // Helper method to format gas price in Gwei
  weiToGwei(wei: string): number {
    return parseInt(wei, 16) / Math.pow(10, 9);
  }
}

export const megaethAPI = new MegaETHAPI();
