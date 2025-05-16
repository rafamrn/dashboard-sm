
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PowerChart from "./PowerChart";
import PerformanceChart from "./PerformanceChart";

type Period = "daily" | "monthly" | "annual";
type ChartType = "power" | "performance";

const ChartSelector = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [chartType, setChartType] = useState<ChartType>("power");
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <Tabs 
          value={chartType} 
          onValueChange={(value) => setChartType(value as ChartType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
            <TabsTrigger value="power">Geração de Energia</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs 
          value={period} 
          onValueChange={(value) => setPeriod(value as Period)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="daily">Diário</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="annual">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {chartType === "power" ? (
        <PowerChart period={period} />
      ) : (
        <PerformanceChart period={period} />
      )}
    </div>
  );
};

export default ChartSelector;
