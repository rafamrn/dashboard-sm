import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PowerChart from "./PowerChart";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

type Period = "daily" | "monthly" | "annual";

const ChartSelector = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [year, setYear] = useState<Date>(new Date());
  
  // Formatar a exibição conforme o período selecionado
  const formatDate = () => {
    switch (period) {
      case "daily":
        return format(date, "dd/MM/yyyy");
      case "monthly":
        return format(month, "MMMM/yyyy");
      case "annual":
        return format(year, "yyyy");
      default:
        return "";
    }
  };
  
  // Custom month picker
  const handleMonthSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Keep only month and year, reset day to 1
      const firstDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      setMonth(firstDayOfMonth);
    }
  };

  // Custom year picker
  const handleYearSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Keep only year, reset month to January and day to 1
      const firstDayOfYear = new Date(newDate.getFullYear(), 0, 1);
      setYear(firstDayOfYear);
    }
  };

  const getMonthsFromYear = (selectedYear: number) => {
    return Array.from({ length: 12 }, (_, i) => new Date(selectedYear, i, 1));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <h3 className="text-lg font-medium">Geração de Energia</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {period === "daily" && (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              )}
              {period === "monthly" && (
                <div className="p-3">
                  <div className="text-center font-medium py-2">
                    {format(month, "yyyy")}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthDate = new Date(month.getFullYear(), i, 1);
                      const isSelected = i === month.getMonth();
                      return (
                        <Button
                          key={i}
                          variant={isSelected ? "default" : "outline"}
                          className={cn("h-9", isSelected && "bg-primary text-primary-foreground")}
                          onClick={() => handleMonthSelect(monthDate)}
                        >
                          {format(monthDate, "MMM")}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              {period === "annual" && (
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 10 }, (_, i) => {
                      const yearValue = new Date().getFullYear() - 5 + i;
                      const yearDate = new Date(yearValue, 0, 1);
                      const isSelected = yearValue === year.getFullYear();
                      return (
                        <Button
                          key={i}
                          variant={isSelected ? "default" : "outline"}
                          className={cn("h-9", isSelected && "bg-primary text-primary-foreground")}
                          onClick={() => handleYearSelect(yearDate)}
                        >
                          {yearValue}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
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
      </div>
      
      <PowerChart period={period} selectedDate={date} selectedMonth={month} selectedYear={year} />
    </div>
  );
};

export default ChartSelector;
