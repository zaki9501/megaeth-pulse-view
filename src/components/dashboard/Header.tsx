
import { Search, Link, Zap, Globe } from "lucide-react";
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
      if (query.startsWith('0x')) {
        if (query.length === 42) {
          navigate(`/address/${query}`);
        } else if (query.length === 66) {
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
    <header className="glass-morphism cyber-border p-4 sm:p-6 shadow-lg neon-glow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              MegaETH Analytics
            </h2>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full cyber-border">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Live Network</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
            <Input 
              placeholder="Search addresses, transactions, blocks..." 
              className="pl-12 pr-12 py-3 glass-morphism cyber-border text-green-100 placeholder-green-500/70 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 hover:bg-black/30 w-full text-sm sm:text-base neon-glow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            {isSearching ? (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center neon-glow">
                  <Zap size={12} className="text-black" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between sm:justify-start space-x-4">
            <div className="flex items-center space-x-2 glass-morphism cyber-border rounded-xl px-4 py-2">
              <Globe size={16} className="text-green-400" />
              <span className="text-sm font-medium text-green-100">Mainnet</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer neon-glow">
              <span className="text-black font-bold">M</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
