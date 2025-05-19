import React, { useState, useEffect } from "react";
import { Sun, BatteryFull, Gauge, ArrowUp } from "lucide-react";
import InverterCard, { InverterData } from "@/components/dashboard/InverterCard";
import StatusGauge from "@/components/dashboard/StatusGauge";
import StringBox from "@/components/dashboard/StringBox";
import SummaryCard from "@/components/dashboard/SummaryCard";
import ChartSelector from "@/components/dashboard/ChartSelector";
import PerformancePieChart from "@/components/dashboard/PerformancePieChart";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState("OPERANDO");
  const [powerOutput, setPowerOutput] = useState(75);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerOutput((prev) => {
        const variation = Math.random() * 6 - 3;
        return Math.max(0, Math.min(100, prev + variation));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mock data for inverters
  const inverters: InverterData[] = [
    {
      id: "inv1",
      name: "Inversor 01",
      isOn: true,
      powerOutput: 27.5,
      voltage: 380,
      current: 25.4,
      temperature: 42.3
    },
    {
      id: "inv2",
      name: "Inversor 02",
      isOn: true,
      powerOutput: 27.3,
      voltage: 380,
      current: 25.1,
      temperature: 43.1
    }
  ];
  
  // Mock data for string boxes
  const stringBox1Data = [
    { id: "ST1-A", voltage: 595.1, current: 14.52 },
    { id: "ST1-B", voltage: 594.8, current: 14.35 },
    { id: "ST1-C", voltage: 593.2, current: 14.48 },
  ];
  
  const stringBox2Data = [
    { id: "ST2-A", voltage: 596.3, current: 14.27 },
    { id: "ST2-B", voltage: 595.9, current: 14.38 },
    { id: "ST2-C", voltage: 594.5, current: 14.19 },
  ];
  
  const totalEnergyToday = 149.8;
  const totalEnergyMonth = 3245.6;
  const totalEnergyYear = 24312.5;
  
  // Expected vs actual performance data
  const actualPerformance = totalEnergyToday;
  const expectedPerformance = 175.0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitoramento da Usina</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real da usina solar fotovoltaica
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            className={`text-lg h-10 px-4 ${
              systemStatus === "OPERANDO" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
            }`}
          >
            {systemStatus}
          </Badge>
        </div>
      </div>
      
      {/* Energy charts and performance */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChartSelector />
        </div>
        <div>
          <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
            <h3 className="text-2xl font-semibold leading-none tracking-tight mb-6">Performance Diária</h3>
            <div className="flex flex-col items-center space-y-6">
              <StatusGauge 
                value={powerOutput} 
                maxValue={100} 
                label="Nível de Produção" 
                unit="%" 
              />
              <PerformancePieChart 
                actualValue={actualPerformance}
                expectedValue={expectedPerformance}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Energia Gerada Hoje"
          value={`${totalEnergyToday.toFixed(1)} kWh`}
          icon={<Sun />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <SummaryCard 
          title="Energia Gerada no Mês"
          value={`${totalEnergyMonth.toFixed(1)} kWh`}
          icon={<BatteryFull />}
          trend={{ value: 2.1, isPositive: true }}
        />
        <SummaryCard 
          title="Energia Gerada no Ano"
          value={`${totalEnergyYear.toFixed(1)} kWh`}
          icon={<Gauge />}
        />
        <SummaryCard 
          title="Potência Atual"
          value={`${(inverters.reduce((sum, inv) => sum + inv.powerOutput, 0)).toFixed(1)} kW`}
          icon={<ArrowUp />}
          description="Total de todos os inversores"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Inverters */}
        {inverters.map((inverter) => (
          <InverterCard key={inverter.id} data={inverter} />
        ))}
        
        {/* System status card */}
        <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
          <h3 className="font-medium mb-4">Estado do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Estado de Operação</span>
              <Badge className="bg-success text-success-foreground">AUTOMÁTICO</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Nível de Combustível</span>
              <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Tensão do Sistema</span>
              <span className="font-semibold">387.4 V</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <StringBox title="String Box 01" data={stringBox1Data} />
        <StringBox title="String Box 02" data={stringBox2Data} />
      </div>
    </div>
  );
};

export default Dashboard;
