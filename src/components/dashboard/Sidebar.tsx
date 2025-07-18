
import { BarChart, Activity, Users, Settings, ChevronLeft, ChevronRight, User, Code, Eye, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: "chain-ops", label: "Dashboard", icon: Activity, route: "/" },
    { id: "leaderboard", label: "Leaderboard", icon: BarChart, route: "/" },
    { id: "portfolio", label: "Portfolio", icon: User, route: "/portfolio" },
    { id: "contract-tools", label: "Contract Tools", icon: Code, route: "/contract-tools" },
    { id: "visualizer", label: "Visualizer", icon: Eye, route: "/visualizer", disabled: true },
    { id: "dev-tools", label: "Dev Tools", icon: Settings, route: "/", disabled: true },
  ];

  const handleTabClick = (tabId: string, route: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    // Navigate to the appropriate route
    if (route !== location.pathname) {
      navigate(route);
    }
  };

  // Mobile menu button
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-3 professional-card professional-shadow rounded-xl md:hidden hover:scale-105 transition-transform duration-200"
        >
          {mobileMenuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
        </button>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className={cn(
          "fixed left-0 top-0 h-full w-80 glass-effect z-50 transform transition-all duration-300 ease-out md:hidden professional-shadow",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center professional-shadow">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                MegaETH
              </h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-muted/50 rounded-xl transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-6 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isDisabled = item.disabled;
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && handleTabClick(item.id, item.route)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium professional-shadow" 
                      : isDisabled
                        ? "text-muted-foreground opacity-60 cursor-not-allowed bg-muted/30"
                        : "hover:bg-muted/50 text-foreground"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  disabled={isDisabled}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                  {isDisabled && (
                    <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border">Coming Soon</span>
                  )}
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
      "fixed left-0 top-0 h-full glass-effect transition-all duration-300 ease-out z-50 hidden md:block professional-shadow professional-border",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center professional-shadow">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              MegaETH
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-200 hover:scale-110"
        >
          {collapsed ? <ChevronRight size={18} className="text-foreground" /> : <ChevronLeft size={18} className="text-foreground" />}
        </button>
      </div>
      
      <nav className="mt-6 px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && handleTabClick(item.id, item.route)}
              className={cn(
                "w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground font-medium professional-shadow" 
                  : isDisabled
                    ? "text-muted-foreground opacity-60 cursor-not-allowed bg-muted/30"
                    : "hover:bg-muted/50 text-foreground",
                collapsed && "justify-center px-2"
              )}
              style={{
                animationDelay: `${index * 30}ms`
              }}
              disabled={isDisabled}
            >
              <Icon size={20} className={cn(!collapsed && "mr-3")} />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.label}</span>
              )}
              {isDisabled && !collapsed && (
                <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border">Coming Soon</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
