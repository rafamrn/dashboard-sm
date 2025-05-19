
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { FileDown, Calendar as CalendarIcon, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter 
} from "@/components/ui/table";

interface MonthReport {
  date: string;
  performance: number;
  expected: number;
  actual: number;
  irradiance: number;
}

const Reports = () => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Generate mock data for the selected month
  const generateMonthData = (selectedDate: Date): MonthReport[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      // Pseudo-random consistent data for the same day
      const seed = parseInt(`${day}${month + 1}${year}`);
      const rand = (Math.sin(seed) * 10000) % 1;
      
      const expected = Math.round(150 + (rand * 50));
      const actual = Math.round(expected * (0.7 + rand * 0.5));
      const performance = Math.round((actual / expected) * 100);
      const irradiance = Math.round(500 + rand * 300);
      
      return {
        date: format(new Date(year, month, day), "dd/MM/yyyy"),
        performance,
        expected,
        actual,
        irradiance
      };
    });
  };
  
  const monthData = generateMonthData(date);
  
  // Calculate monthly totals and averages
  const totalExpected = monthData.reduce((sum, day) => sum + day.expected, 0);
  const totalActual = monthData.reduce((sum, day) => sum + day.actual, 0);
  const averagePerformance = Math.round((totalActual / totalExpected) * 100);
  const averageIrradiance = Math.round(
    monthData.reduce((sum, day) => sum + day.irradiance, 0) / monthData.length
  );
  
  // Export to PDF function
  const exportPDF = () => {
    window.print();
  };
  
  // Export to CSV function
  const exportCSV = () => {
    // Create headers
    const headers = ["Data", "Performance (%)", "Esperado (kWh)", "Real (kWh)", "Irradiância (W/m²)"];
    
    // Format data
    const dataRows = monthData.map(row => 
      [row.date, row.performance, row.expected, row.actual, row.irradiance]
    );
    
    // Add summary row
    dataRows.push([
      `Total/Média (${format(date, "MMMM/yyyy")})`, 
      averagePerformance, 
      totalExpected,
      totalActual, 
      averageIrradiance
    ]);
    
    // Combine all data
    const csvContent = [
      headers.join(","),
      ...dataRows.map(row => row.join(","))
    ].join("\n");
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_${format(date, "MM-yyyy")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere e exporte relatórios de performance da usina
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "MMMM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={exportPDF}
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          
          <Button 
            className="gap-2"
            onClick={exportCSV}
          >
            <FileDown className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      <Card className="print:shadow-none print:border-none">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="flex justify-between items-center">
            <span>Relatório de Performance - {format(date, "MMMM/yyyy")}</span>
            <div className="print:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={exportPDF}
              >
                <FileDown className="h-4 w-4" />
                Baixar PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Relatório de Performance da Usina Solar</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Esperado (kWh)</TableHead>
                <TableHead className="text-right">Real (kWh)</TableHead>
                <TableHead className="text-right">Irradiância (W/m²)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthData.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>{day.date}</TableCell>
                  <TableCell className="text-right">{day.performance}%</TableCell>
                  <TableCell className="text-right">{day.expected}</TableCell>
                  <TableCell className="text-right">{day.actual}</TableCell>
                  <TableCell className="text-right">{day.irradiance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total/Média</TableCell>
                <TableCell className="text-right">{averagePerformance}%</TableCell>
                <TableCell className="text-right">{totalExpected}</TableCell>
                <TableCell className="text-right">{totalActual}</TableCell>
                <TableCell className="text-right">{averageIrradiance}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">
            Relatório gerado em {format(new Date(), "dd/MM/yyyy HH:mm")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reports;
