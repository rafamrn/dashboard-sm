
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";

type PowerChartProps = {
  period: "daily" | "monthly" | "annual";
  selectedDate: Date;
  selectedMonth: Date;
  selectedYear: Date;
};

const PowerChart = ({ period, selectedDate, selectedMonth, selectedYear }: PowerChartProps) => {
  // Gerar dados com base no período e data selecionados
  const chartData = useMemo(() => {
    const selectedDay = format(selectedDate, "dd");
    const selectedMonthStr = format(selectedMonth, "MM");
    const selectedYearStr = format(selectedYear, "yyyy");
    
    switch (period) {
      case 'daily':
        // Gerar dados para o dia selecionado
        return Array.from({ length: 24 }, (_, i) => {
          const hour = i.toString().padStart(2, "0");
          // Pseudo-random consistente para o mesmo dia
          const seed = parseInt(`${selectedDay}${selectedMonthStr}${selectedYearStr}${hour}`);
          const rand = (Math.sin(seed) * 10000) % 1;
          return {
            time: `${hour}:00`,
            power: Math.abs(rand * 35 + (i > 6 && i < 19 ? 15 : 2)) // Maior durante o dia
          };
        });
      
      case 'monthly':
        // Gerar dados para o mês selecionado
        const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          // Pseudo-random consistente para o mesmo mês/ano
          const seed = parseInt(`${day}${selectedMonthStr}${selectedYearStr}`);
          const rand = (Math.sin(seed) * 10000) % 1;
          return {
            day: day,
            energy: Math.abs(rand * 150 + 50)
          };
        });
        
      case 'annual':
        // Gerar dados para o ano selecionado
        return Array.from({ length: 12 }, (_, i) => {
          const month = new Date(0, i).toLocaleString('default', { month: 'short' });
          // Pseudo-random consistente para o mesmo ano
          const seed = parseInt(`${i+1}${selectedYearStr}`);
          const rand = (Math.sin(seed) * 10000) % 1;
          return {
            month,
            energy: Math.abs(rand * 3500 + 1000)
          };
        });
      
      default:
        return [];
    }
  }, [period, selectedDate, selectedMonth, selectedYear]);

  const renderChart = () => {
    switch (period) {
      case 'daily':
        return (
          <ChartContainer 
            config={{
              power: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            </ResponsiveContainer>
          </ChartContainer>
        );
      
      case 'monthly':
        return (
          <ChartContainer 
            config={{
              energy: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'annual':
        return (
          <ChartContainer 
            config={{
              energy: { theme: { light: '#3b82f6', dark: '#60a5fa' } }
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            </ResponsiveContainer>
          </ChartContainer>
        );
      
      default:
        return null;
    }
  };
  
  const getChartTitle = () => {
    switch (period) {
      case 'daily':
        return `Potência por Hora do Dia ${format(selectedDate, "dd/MM/yyyy")} (kW)`;
      case 'monthly':
        return `Geração por Dia do Mês ${format(selectedMonth, "MM/yyyy")} (kWh)`;
      case 'annual':
        return `Geração por Mês do Ano ${format(selectedYear, "yyyy")} (kWh)`;
      default:
        return 'Geração de Energia';
    }
  };
  
  return (
    <Card className="w-full h-full">
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
