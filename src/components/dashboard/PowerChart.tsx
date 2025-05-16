
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

type PowerChartProps = {
  period: "daily" | "monthly" | "annual";
};

// Sample data for different periods
const dailyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  power: Math.random() * 35 + (i > 6 && i < 19 ? 15 : 2) // Higher during day
}));

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  energy: Math.random() * 150 + 50
}));

const annualData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(0, i).toLocaleString('default', { month: 'short' });
  return {
    month,
    energy: Math.random() * 3500 + 1000
  };
});

const PowerChart = ({ period }: PowerChartProps) => {
  const renderChart = () => {
    switch (period) {
      case 'daily':
        return (
          <ChartContainer 
            config={{
              power: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-80"
          >
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-power)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-power)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis unit=" kW" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="power" 
                name="power"
                stroke="var(--color-power)" 
                fillOpacity={1}
                fill="url(#powerGradient)" 
              />
            </AreaChart>
          </ChartContainer>
        );
      
      case 'monthly':
        return (
          <ChartContainer 
            config={{
              energy: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-80"
          >
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-energy)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-energy)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" />
              <YAxis unit=" kWh" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="energy" 
                name="energy"
                stroke="var(--color-energy)" 
                fillOpacity={1}
                fill="url(#energyGradient)" 
              />
            </AreaChart>
          </ChartContainer>
        );
        
      case 'annual':
        return (
          <ChartContainer 
            config={{
              energy: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-80"
          >
            <AreaChart data={annualData}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-energy)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-energy)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis unit=" kWh" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="energy" 
                name="energy"
                stroke="var(--color-energy)" 
                fillOpacity={1}
                fill="url(#energyGradient)" 
              />
            </AreaChart>
          </ChartContainer>
        );
      
      default:
        return null;
    }
  };
  
  const getChartTitle = () => {
    switch (period) {
      case 'daily':
        return 'Potência por Hora do Dia (kW)';
      case 'monthly':
        return 'Geração por Dia do Mês (kWh)';
      case 'annual':
        return 'Geração por Mês do Ano (kWh)';
      default:
        return 'Geração de Energia';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{getChartTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default PowerChart;
