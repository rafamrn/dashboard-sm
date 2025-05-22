
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformancePieChart from "@/components/dashboard/PerformancePieChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import CircularGauge from "@/components/dashboard/CircularGauge";

type Period = "daily" | "monthly" | "annual";

const Performance = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [animateGauges, setAnimateGauges] = useState(true);

  // Trigger gauge animation when changing periods
  useEffect(() => {
    setAnimateGauges(true);
    const timer = setTimeout(() => setAnimateGauges(false), 1500);
    return () => clearTimeout(timer);
  }, [period]);

  // Mock data for inverters
  const inverters = [
    { 
      id: "inv1", 
      name: "Inversor 01", 
      actual: 72.5, 
      expected: 80.0,
      operationHours: 10.5,
      totalHours: 12.0,
      temperature: 42.5,
      efficiency: 86.3,
      voltage: 380.2
    },
    { 
      id: "inv2", 
      name: "Inversor 02", 
      actual: 77.3, 
      expected: 80.0,
      operationHours: 11.2,
      totalHours: 12.0,
      temperature: 44.1,
      efficiency: 89.5,
      voltage: 378.9
    },
    { 
      id: "inv3", 
      name: "Inversor 03", 
      actual: 73.8, 
      expected: 80.0,
      operationHours: 9.8,
      totalHours: 12.0,
      temperature: 43.8,
      efficiency: 84.7,
      voltage: 379.5
    },
    { 
      id: "inv4", 
      name: "Inversor 04", 
      actual: 65.2, 
      expected: 80.0,
      operationHours: 8.5,
      totalHours: 12.0,
      temperature: 45.2,
      efficiency: 79.8,
      voltage: 376.8
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
          <Card key={inverter.id} className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{inverter.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
              {/* Performance Pie Chart */}
              <PerformancePieChart
                inverterName={inverter.name}
                actualValue={inverter.actual}
                expectedValue={inverter.expected}
              />
              
              {/* Circular gauges section with animation */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                {/* Operation Hours Gauge */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-2">Horas de Operação</h3>
                  <CircularGauge
                    value={inverter.operationHours}
                    maxValue={inverter.totalHours}
                    label="Operação"
                    unit="h"
                    size="sm"
                    showAnimation={animateGauges}
                  />
                </div>
                
                {/* Temperature Gauge */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-2">Temperatura</h3>
                  <CircularGauge
                    value={inverter.temperature}
                    maxValue={60}
                    label="Temperatura"
                    unit="°C"
                    size="sm"
                    thresholds={{ warning: 50, critical: 80 }}
                    showAnimation={animateGauges}
                  />
                </div>
                
                {/* Efficiency Gauge */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-2">Eficiência</h3>
                  <CircularGauge
                    value={inverter.efficiency}
                    maxValue={100}
                    label="Eficiência"
                    unit="%"
                    size="sm"
                    thresholds={{ warning: 50, critical: 30 }}
                    showAnimation={animateGauges}
                  />
                </div>
                
                {/* Voltage Gauge */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-2">Tensão</h3>
                  <CircularGauge
                    value={inverter.voltage}
                    maxValue={400}
                    label="Tensão"
                    unit="V"
                    size="sm"
                    thresholds={{ warning: 50, critical: 30 }}
                    showAnimation={animateGauges}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Performance;
