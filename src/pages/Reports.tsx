import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();
  
  // Generate mock report data
  const generateReportData = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate data for each day in the month
    const dailyData = [];
    let totalEnergy = 0;
    let totalActual = 0;
    let totalExpected = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      
      // Skip future days
      if (dayDate > new Date()) continue;
      
      // Generate random but realistic data
      const energyExpected = Math.round(150 + Math.random() * 50); // kWh
      const variationPct = Math.random() * 20 - 10; // -10% to +10%
      const energyActual = Math.round(energyExpected * (1 + variationPct / 100));
      const performance = Math.round((energyActual / energyExpected) * 100);
      const peakPower = Math.round(25 + Math.random() * 10); // kW
      const operatingHours = Math.round(9 + Math.random() * 3); // hours
      
      totalEnergy += energyActual;
      totalActual += energyActual;
      totalExpected += energyExpected;
      
      dailyData.push({
        date: dayDate,
        energyActual,
        energyExpected,
        performance,
        peakPower,
        operatingHours
      });
    }
    
    // Monthly summary
    const averagePerformance = Math.round((totalActual / totalExpected) * 100);
    const performanceStatus = averagePerformance >= 95 ? "Excelente" : 
                            averagePerformance >= 90 ? "Bom" : 
                            averagePerformance >= 85 ? "Regular" : "Abaixo do esperado";
    
    return {
      dailyData,
      totalEnergy,
      averagePerformance,
      performanceStatus
    };
  };
  
  const reportData = generateReportData();
  
  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "O relatório está sendo preparado."
    });
    
    setTimeout(() => {
      setReportGenerated(true);
      toast({
        title: "Relatório pronto",
        description: "O relatório foi gerado com sucesso."
      });
    }, 1500);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Download iniciado",
      description: "O relatório está sendo baixado."
    });
    
    // In a real app, this would trigger the actual PDF download
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      toast({
        title: "Download concluído",
        description: "O relatório foi baixado com sucesso."
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Relatórios mensais de desempenho da usina solar
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium">Selecione o mês</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : "Selecione o mês"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={2022}
                toYear={2025}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button onClick={handleGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>
      
      {reportGenerated && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Relatório de Desempenho - {format(date, "MMMM yyyy")}</CardTitle>
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground">Energia Total Gerada</p>
                      <p className="text-3xl font-bold mt-2">{reportData.totalEnergy} kWh</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground">Performance Média</p>
                      <p className="text-3xl font-bold mt-2">{reportData.averagePerformance}%</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground">Status da Performance</p>
                      <p className={cn(
                        "text-3xl font-bold mt-2",
                        reportData.averagePerformance >= 95 ? "text-green-500" :
                        reportData.averagePerformance >= 90 ? "text-blue-500" :
                        reportData.averagePerformance >= 85 ? "text-yellow-500" : "text-red-500"
                      )}>
                        {reportData.performanceStatus}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Energia Gerada (kWh)</TableHead>
                    <TableHead>Energia Esperada (kWh)</TableHead>
                    <TableHead>Performance (%)</TableHead>
                    <TableHead>Potência de Pico (kW)</TableHead>
                    <TableHead>Horas de Operação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.dailyData.map((day) => (
                    <TableRow key={day.date.toISOString()}>
                      <TableCell>{format(day.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{day.energyActual}</TableCell>
                      <TableCell>{day.energyExpected}</TableCell>
                      <TableCell className={cn(
                        day.performance >= 95 ? "text-green-500" :
                        day.performance >= 90 ? "text-blue-500" :
                        day.performance >= 85 ? "text-yellow-500" : "text-red-500"
                      )}>
                        {day.performance}%
                      </TableCell>
                      <TableCell>{day.peakPower}</TableCell>
                      <TableCell>{day.operatingHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
