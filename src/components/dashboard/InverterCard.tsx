
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

export interface InverterData {
  id: string;
  name: string;
  isOn: boolean;
  powerOutput: number;
  voltage: number;
  current: number;
  temperature: number;
}

interface InverterCardProps {
  data: InverterData;
}

const InverterCard = ({ data }: InverterCardProps) => {
  const statusClass = data.isOn ? "status-on" : "status-off";
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{data.name}</CardTitle>
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${statusClass} px-2 py-1`}
        >
          <Circle className="h-2 w-2 fill-current" />
          {data.isOn ? "Ligado" : "Desligado"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Potência</span>
            <span className="text-xl font-bold">{data.powerOutput.toFixed(2)} kW</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Voltagem</span>
            <span className="text-xl font-bold">{data.voltage.toFixed(1)} V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Corrente</span>
            <span className="text-xl font-bold">{data.current.toFixed(2)} A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Temperatura</span>
            <span className="text-xl font-bold">{data.temperature.toFixed(1)}°C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterCard;
