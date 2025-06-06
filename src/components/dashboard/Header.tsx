import { Search, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
export const Header = () => {
  return <header className="bg-gray-800 border-b border-gray-700 p-4">
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
            <Input placeholder="Search transactions, addresses..." className="pl-10 bg-gray-700 border-gray-600 text-white w-80" />
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
            <Link size={16} className="text-blue-400" />
            <span className="text-sm">Testnet
          </span>
          </div>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">M</span>
          </div>
        </div>
      </div>
    </header>;
};