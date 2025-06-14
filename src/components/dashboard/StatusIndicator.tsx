
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  label: string;
  status: "online" | "good" | "warning" | "error" | "syncing";
  value: string;
}

export const StatusIndicator = ({ label, status, value }: StatusIndicatorProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "good":
        return "bg-green-400";
      case "warning":
      case "syncing":
        return "bg-yellow-400";
      case "error":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "good":
        return "Good";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      case "syncing":
        return "Syncing";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 glass-morphism cyber-border rounded-lg hover:bg-black/40 transition-all duration-300 neon-glow">
      <div>
        <p className="text-sm text-green-400/70">{label}</p>
        <p className="font-semibold text-green-100">{value}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className={cn("w-2 h-2 rounded-full", getStatusColor(status), status === "syncing" && "animate-pulse")}></div>
        <span className="text-sm text-green-300">{getStatusText(status)}</span>
      </div>
    </div>
  );
};
