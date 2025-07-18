
import { useState } from "react";
import { Search, Wallet, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WalletSearchProps {
  onWalletSelect: (address: string) => void;
  selectedWallet: string;
}

export const WalletSearch = ({ onWalletSelect, selectedWallet }: WalletSearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [recentWallets] = useState([
    { address: "0x742C4B3814bb8D453c41eE25a1d67A7c18d4E3dd", label: "Whale Wallet #1" },
    { address: "0x8ba1f109551bD432803012645Hac136c22C58877", label: "DeFi Trader" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", label: "DAI Contract" },
  ]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      onWalletSelect(searchInput.trim());
    }
  };

  const handleRecentWalletClick = (address: string) => {
    setSearchInput(address);
    onWalletSelect(address);
  };

  return (
    <Card className="professional-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>

          {/* Current Selection */}
          {selectedWallet && (
            <div className="flex items-center space-x-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <Wallet className="text-primary" size={20} />
              <span className="text-sm text-muted-foreground">Current:</span>
              <span className="font-mono text-foreground text-sm">
                {selectedWallet.slice(0, 10)}...{selectedWallet.slice(-8)}
              </span>
            </div>
          )}

          {/* Recent Wallets */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <History className="text-muted-foreground" size={16} />
              <span className="text-sm text-muted-foreground">Recent Searches</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {recentWallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentWalletClick(wallet.address)}
                  className="p-3 bg-accent/5 hover:bg-accent/10 border border-border rounded-lg text-left transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{wallet.label}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
