
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PowerChart from "./PowerChart";

type Period = "daily" | "monthly" | "annual";

const ChartSelector = () => {
  const [period, setPeriod] = useState<Period>("daily");
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <h3 className="text-lg font-medium">Geração de Energia</h3>
        
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
      
      <PowerChart period={period} />
    </div>
  );
};

export default ChartSelector;
