
import { BarChart, Activity, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) => {
  const menuItems = [
    { id: "chain-ops", label: "Dashboard", icon: Activity },
    { id: "leaderboard", label: "Leaderboard", icon: BarChart },
    { id: "whale-tracker", label: "Wallet Tracker", icon: Users },
    { id: "dev-tools", label: "Dev Tools", icon: Settings },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-50",
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
