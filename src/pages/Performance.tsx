
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformancePieChart from "@/components/dashboard/PerformancePieChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";

type Period = "daily" | "monthly" | "annual";

const Performance = () => {
  const [period, setPeriod] = useState<Period>("daily");

  // Mock data for inverters
  const inverters = [
    { 
      id: "inv1", 
      name: "Inversor 01", 
      actual: 72.5, 
      expected: 80.0 
    },
    { 
      id: "inv2", 
      name: "Inversor 02", 
      actual: 77.3, 
      expected: 80.0 
    },
    { 
      id: "inv3", 
      name: "Inversor 03", 
      actual: 73.8, 
      expected: 80.0 
    },
    { 
      id: "inv4", 
      name: "Inversor 04", 
      actual: 65.2, 
      expected: 80.0 
    }
  ];
  
  // Calculate total performance
  const totalActual = inverters.reduce((sum, inv) => sum + inv.actual, 0);
  const totalExpected = inverters.reduce((sum, inv) => sum + inv.expected, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance da Usina</h1>
          <p className="text-muted-foreground">
            Análise detalhada da performance dos inversores
          </p>
        </div>
        <Tabs 
          value={period} 
          onValueChange={(value) => setPeriod(value as Period)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
            <TabsTrigger value="daily">Diário</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="annual">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Overall performance chart */}
      <PerformanceChart period={period} />
      
      {/* Total plant performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Performance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformancePieChart 
              title="Usina Completa"
              actualValue={totalActual}
              expectedValue={totalExpected}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Individual inverter performance */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Performance por Inversor</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {inverters.map((inverter) => (
          <div key={inverter.id}>
            <PerformancePieChart
              inverterName={inverter.name}
              actualValue={inverter.actual}
              expectedValue={inverter.expected}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
