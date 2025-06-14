
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
    { id: "chain-ops", label: "Dashboard", icon: Activity, color: "from-blue-500 to-cyan-500" },
    { id: "leaderboard", label: "Leaderboard", icon: BarChart, color: "from-green-500 to-emerald-500" },
    { id: "whale-tracker", label: "Wallet Tracker", icon: Users, color: "from-purple-500 to-violet-500" },
    { id: "portfolio", label: "Portfolio", icon: User, color: "from-orange-500 to-red-500" },
    { id: "contract-tools", label: "Contract Tools", icon: Code, color: "from-pink-500 to-rose-500" },
    { id: "visualizer", label: "Visualizer", icon: Eye, color: "from-indigo-500 to-purple-500" },
    { id: "dev-tools", label: "Dev Tools", icon: Settings, color: "from-teal-500 to-cyan-500" },
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
        {/* Enhanced Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl border border-white/20 md:hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur animate-pulse" />
          </div>
        </button>

        {/* Enhanced Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Enhanced Mobile sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-white/20 z-50 transform transition-all duration-500 ease-out md:hidden shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MegaOps
              </h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-6 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-4 mb-2 text-left rounded-2xl transition-all duration-300 group hover:scale-105 relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r " + item.color + " shadow-lg shadow-purple-500/25 text-white" 
                      : "hover:bg-white/10 text-gray-300 hover:text-white"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                  )}
                  <div className="relative z-10 flex items-center w-full">
                    <Icon size={22} className="mr-4" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </>
    );
  }

  // Enhanced Desktop sidebar
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-white/20 transition-all duration-500 ease-out z-50 hidden md:block shadow-2xl",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MegaOps
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 group"
        >
          <div className="relative">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </div>
        </button>
      </div>
      
      <nav className="mt-8 px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-4 mb-3 text-left rounded-2xl transition-all duration-300 group hover:scale-105 relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r " + item.color + " shadow-lg shadow-purple-500/25 text-white" 
                  : "hover:bg-white/10 text-gray-300 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
              )}
              <div className="relative z-10 flex items-center">
                <Icon size={22} className={cn(!collapsed && "mr-4")} />
                {!collapsed && (
                  <span className="font-medium animate-fade-in">{item.label}</span>
                )}
                {!collapsed && isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
