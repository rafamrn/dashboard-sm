
import React, { useState, useEffect } from "react";
import { Sun, BatteryFull, Gauge, ArrowUp, Thermometer } from "lucide-react";
import InverterCard, { InverterData } from "@/components/dashboard/InverterCard";
import StatusGauge from "@/components/dashboard/StatusGauge";
import StringBox from "@/components/dashboard/StringBox";
import SummaryCard from "@/components/dashboard/SummaryCard";
import ChartSelector from "@/components/dashboard/ChartSelector";
import PerformancePieChart from "@/components/dashboard/PerformancePieChart";
import PowerGauge from "@/components/dashboard/PowerGauge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState("OPERANDO");
  const [powerOutput, setPowerOutput] = useState(75);
  const [temperature, setTemperature] = useState(42.5);
  const [irradiance, setIrradiance] = useState(780);
  const [chartKey, setChartKey] = useState(0);
  
  // Simulate real-time data updates with more frequent changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerOutput((prev) => {
        const variation = Math.random() * 8 - 4;
        return Math.max(0, Math.min(100, prev + variation));
      });
      
      setTemperature((prev) => {
        const variation = Math.random() * 3 - 1.5;
        return Math.max(25, Math.min(60, prev + variation));
      });
      
      setIrradiance((prev) => {
        const variation = Math.random() * 50 - 25;
        return Math.max(200, Math.min(1200, prev + variation));
      });
      
      // Trigger chart re-render with animation
      setChartKey(prev => prev + 1);
    }, 2000); // Update more frequently for better animation effect
    
    return () => clearInterval(interval);
  }, []);
  
  // Create animated mock data for inverters with changing values
  const [inverters, setInverters] = useState<InverterData[]>([
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
  ]);
  
  // Update inverter data periodically
  useEffect(() => {
    const updateInverters = setInterval(() => {
      setInverters(prev => prev.map(inv => ({
        ...inv,
        powerOutput: Math.max(0, inv.powerOutput + (Math.random() * 1 - 0.5)),
        voltage: Math.max(370, Math.min(390, inv.voltage + (Math.random() * 2 - 1))),
        current: Math.max(24, Math.min(26, inv.current + (Math.random() * 0.4 - 0.2))),
        temperature: Math.max(40, Math.min(45, inv.temperature + (Math.random() * 0.6 - 0.3)))
      })));
    }, 3000);
    
    return () => clearInterval(updateInverters);
  }, []);
  
  // Mock data for string boxes with slight variations
  const [stringBox1Data, setStringBox1Data] = useState([
    { id: "ST1-A", voltage: 595.1, current: 14.52 },
    { id: "ST1-B", voltage: 594.8, current: 14.35 },
    { id: "ST1-C", voltage: 593.2, current: 14.48 },
  ]);
  
  const [stringBox2Data, setStringBox2Data] = useState([
    { id: "ST2-A", voltage: 596.3, current: 14.27 },
    { id: "ST2-B", voltage: 595.9, current: 14.38 },
    { id: "ST2-C", voltage: 594.5, current: 14.19 },
  ]);
  
  // Update string box data periodically
  useEffect(() => {
    const updateStringBoxes = setInterval(() => {
      setStringBox1Data(prev => prev.map(string => ({
        ...string,
        voltage: Math.max(590, Math.min(600, string.voltage + (Math.random() * 2 - 1))),
        current: Math.max(14, Math.min(15, string.current + (Math.random() * 0.15 - 0.075)))
      })));
      
      setStringBox2Data(prev => prev.map(string => ({
        ...string,
        voltage: Math.max(590, Math.min(600, string.voltage + (Math.random() * 2 - 1))),
        current: Math.max(14, Math.min(15, string.current + (Math.random() * 0.15 - 0.075)))
      })));
    }, 2500);
    
    return () => clearInterval(updateStringBoxes);
  }, []);
  
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
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Badge 
              className={`text-lg h-10 px-4 ${
                systemStatus === "OPERANDO" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
              }`}
            >
              {systemStatus}
            </Badge>
          </motion.div>
        </div>
      </div>
      
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Performance Diária</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-around gap-4">
          <motion.div 
            key={`power-gauge-${chartKey}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <PowerGauge 
              value={powerOutput} 
              maxValue={100} 
              label="Nível de Produção" 
              unit="%" 
            />
          </motion.div>
          <motion.div 
            key={`performance-chart-${chartKey}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <PerformancePieChart 
              actualValue={actualPerformance}
              expectedValue={expectedPerformance}
            />
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Energy charts with animation */}
      <div className="grid md:grid-cols-1">
        <motion.div 
          key={`chart-selector-${chartKey}`}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChartSelector />
        </motion.div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          <motion.div 
            key={`summary-today-${chartKey}`}
            initial={{ y: 5, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryCard 
              title="Energia Gerada Hoje"
              value={`${totalEnergyToday.toFixed(1)} kWh`}
              icon={<Sun />}
              trend={{ value: 5.2, isPositive: true }}
            />
          </motion.div>
          <motion.div
            key={`summary-month-${chartKey}`}
            initial={{ y: 5, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SummaryCard 
              title="Energia Gerada no Mês"
              value={`${totalEnergyMonth.toFixed(1)} kWh`}
              icon={<BatteryFull />}
              trend={{ value: 2.1, isPositive: true }}
            />
          </motion.div>
          <motion.div
            key={`summary-year-${chartKey}`}
            initial={{ y: 5, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SummaryCard 
              title="Energia Gerada no Ano"
              value={`${totalEnergyYear.toFixed(1)} kWh`}
              icon={<Gauge />}
            />
          </motion.div>
          <motion.div
            key={`summary-power-${chartKey}`}
            initial={{ y: 5, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SummaryCard 
              title="Potência Atual"
              value={`${(inverters.reduce((sum, inv) => sum + inv.powerOutput, 0)).toFixed(1)} kW`}
              icon={<ArrowUp />}
              description="Total de todos os inversores"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Inverters with animation */}
        {inverters.map((inverter, index) => (
          <motion.div 
            key={`inverter-${inverter.id}-${chartKey}`}
            initial={{ x: -10, opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <InverterCard key={inverter.id} data={inverter} />
          </motion.div>
        ))}
        
        {/* System status card with animation */}
        <motion.div
          key={`system-status-${chartKey}`}
          initial={{ x: -10, opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between h-full">
            <h3 className="font-medium mb-4">Estado do Sistema</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Estado de Operação</span>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge className="bg-success text-success-foreground">AUTOMÁTICO</Badge>
                </motion.div>
              </div>
              <div className="flex justify-between items-center">
                <span>Nível de Combustível</span>
                <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-yellow-500"
                    initial={{ width: '73%' }}
                    animate={{ width: ['73%', '76%', '74%', '75%'] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  ></motion.div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Tensão do Sistema</span>
                <motion.span 
                  className="font-semibold"
                  key={chartKey}
                  animate={{ opacity: [0.7, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {(387.4 + (Math.random() * 0.6 - 0.3)).toFixed(1)} V
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          key={`string-box-1-${chartKey}`}
          initial={{ y: 5, opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StringBox title="String Box 01" data={stringBox1Data} />
        </motion.div>
        <motion.div
          key={`string-box-2-${chartKey}`}
          initial={{ y: 5, opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StringBox title="String Box 02" data={stringBox2Data} />
        </motion.div>
      </div>
      
      {/* Weather Station Data at the bottom */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Estação Meteorológica</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-around gap-4">
          <motion.div 
            key={`temperature-gauge-${chartKey}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <PowerGauge 
              value={temperature}
              maxValue={80}
              label="Temperatura do Módulo" 
              unit="°C"
              color="#ef4444" 
            />
          </motion.div>
          <motion.div 
            key={`irradiance-gauge-${chartKey}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <PowerGauge 
              value={irradiance}
              maxValue={1200}
              label="Irradiância" 
              unit=" W/m²"
              color="#f59e0b" 
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
