
import { useState } from "react";
import { Database, Eye, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionVisualizer } from "./TransactionVisualizer";
import { BlockVisualizer } from "./BlockVisualizer";

export const WalletVisualizer = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                <Database className="text-primary" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary/80 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-foreground rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                MegaETH Visualizer
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground flex items-center space-x-2">
                <Eye size={16} />
                <span>Advanced Blockchain Visualization Platform</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1 sm:mr-2 animate-pulse" />
                  Network Online
                </Badge>
                <Badge variant="outline" className="border-accent/50 text-accent-foreground bg-accent/5">
                  <Cpu size={14} className="mr-1" />
                  Real-time Analysis
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Tabs */}
        <Card className="professional-card professional-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl text-foreground flex items-center space-x-2">
              <Database size={20} />
              <span>Blockchain Visualizers</span>
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Choose between transaction-level or block-level visualization analysis
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger 
                  value="transactions" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
                >
                  Transaction Visualizer
                </TabsTrigger>
                <TabsTrigger 
                  value="blocks" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
                >
                  Block Visualizer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="mt-6">
                <TransactionVisualizer />
              </TabsContent>
              
              <TabsContent value="blocks" className="mt-6">
                <BlockVisualizer />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
