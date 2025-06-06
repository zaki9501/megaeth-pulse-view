
import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ContractExplorer } from "@/components/contract/ContractExplorer";
import { ContractCaller } from "@/components/contract/ContractCaller";

const ContractTools = () => {
  const [activeTab, setActiveTab] = useState("explorer");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "explorer":
        return <ContractExplorer />;
      case "caller":
        return <ContractCaller />;
      default:
        return <ContractExplorer />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex w-full">
      <Sidebar 
        activeTab="contract-tools" 
        setActiveTab={() => {}}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Smart Contract Tools</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("explorer")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "explorer"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                Contract Explorer
              </button>
              <button
                onClick={() => setActiveTab("caller")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "caller"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                Function Caller
              </button>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContractTools;
