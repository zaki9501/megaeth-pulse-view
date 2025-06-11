
import { BarChart, Activity, Users, Settings, ChevronLeft, ChevronRight, User, Code, Eye, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: "chain-ops", label: "Dashboard", icon: Activity },
    { id: "leaderboard", label: "Leaderboard", icon: BarChart },
    { id: "whale-tracker", label: "Wallet Tracker", icon: Users },
    { id: "portfolio", label: "Portfolio", icon: User },
    { id: "contract-tools", label: "Contract Tools", icon: Code },
    { id: "visualizer", label: "Visualizer", icon: Eye },
    { id: "dev-tools", label: "Dev Tools", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile menu button
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg md:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-400">MegaOps</h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors",
                    activeTab === item.id && "bg-blue-600/20 border-r-2 border-blue-400 text-blue-400"
                  )}
                >
                  <Icon size={20} />
                  <span className="ml-3">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-50 hidden md:block",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-400">MegaOps</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors",
                activeTab === item.id && "bg-blue-600/20 border-r-2 border-blue-400 text-blue-400",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
