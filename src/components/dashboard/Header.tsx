
import { Search, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.trim();
    setIsSearching(true);

    try {
      // Determine search type based on format
      if (query.startsWith('0x')) {
        if (query.length === 42) {
          // Wallet address or contract address
          navigate(`/address/${query}`);
        } else if (query.length === 66) {
          // Transaction hash
          navigate(`/transaction/${query}`);
        } else {
          toast.error("Invalid address or transaction hash format");
        }
      } else {
        toast.error("Please enter a valid wallet address (0x...) or transaction hash");
      }
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">MegaETH Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search addresses, transactions..." 
              className="pl-10 bg-gray-700 border-gray-600 text-white w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-blue-400 rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
            <Link size={16} className="text-blue-400" />
            <span className="text-sm">Mainnet</span>
          </div>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">M</span>
          </div>
        </div>
      </div>
    </header>
  );
};
