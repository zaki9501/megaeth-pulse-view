
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
    <header className="professional-card professional-shadow p-4 sm:p-6 m-4 sm:m-6 mb-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gradient">
              MegaETH Analytics
            </h2>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full professional-border">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-medium">Live Network</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search addresses, transactions, blocks..." 
              className="pl-12 pr-12 py-3 professional-input w-full text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            {isSearching ? (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Zap size={12} className="text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between sm:justify-start space-x-4">
            <div className="flex items-center space-x-2 professional-card px-4 py-2 professional-border">
              <Globe size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Mainnet</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center professional-shadow hover:scale-105 transition-transform duration-200 cursor-pointer">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
