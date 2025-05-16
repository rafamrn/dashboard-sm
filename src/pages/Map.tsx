
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InverterLocation {
  id: string;
  name: string;
  isOn: boolean;
  x: number;
  y: number;
  details?: {
    powerOutput: number;
    voltage: number;
    temperature: number;
  };
}

const Map = () => {
  const [selectedInverter, setSelectedInverter] = useState<InverterLocation | null>(null);
  
  // Mock data for inverter locations
  const inverters: InverterLocation[] = [
    { 
      id: "inv1", 
      name: "Inversor 01", 
      isOn: true, 
      x: 25, 
      y: 40,
      details: {
        powerOutput: 27.5,
        voltage: 380,
        temperature: 42.3
      }
    },
    { 
      id: "inv2", 
      name: "Inversor 02", 
      isOn: true, 
      x: 70, 
      y: 40,
      details: {
        powerOutput: 27.3,
        voltage: 380,
        temperature: 43.1
      }
    },
    { 
      id: "string1", 
      name: "String Box 01", 
      isOn: true, 
      x: 15, 
      y: 65 
    },
    { 
      id: "string2", 
      name: "String Box 02", 
      isOn: true, 
      x: 60, 
      y: 65 
    },
    { 
      id: "qdac", 
      name: "QDAC", 
      isOn: true, 
      x: 90, 
      y: 85 
    },
    { 
      id: "qdat", 
      name: "QDAT", 
      isOn: true, 
      x: 10, 
      y: 85 
    },
    { 
      id: "qdac-01", 
      name: "QDAC-01", 
      isOn: true, 
      x: 80, 
      y: 85 
    }
  ];
  
  const handleInverterClick = (inverter: InverterLocation) => {
    setSelectedInverter(inverter);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mapa da Usina</h1>
        <p className="text-muted-foreground">
          Visualização da localização dos equipamentos na usina
        </p>
      </div>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Mapa da Usina</TabsTrigger>
          <TabsTrigger value="list">Lista de Equipamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map">
          <Card>
            <CardContent className="pt-6">
              <div className="relative w-full h-[500px] border rounded-lg bg-blue-50 overflow-hidden">
                {/* Plant map background with grid */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-blue-100"></div>
                  ))}
                </div>
                
                {/* Plant map elements */}
                <div className="absolute inset-0">
                  {/* Main connections */}
                  <svg className="w-full h-full">
                    <line x1="25%" y1="40%" x2="70%" y2="40%" stroke="red" strokeWidth="2" />
                    <line x1="15%" y1="65%" x2="60%" y2="65%" stroke="red" strokeWidth="2" />
                    <line x1="25%" y1="40%" x2="15%" y2="65%" stroke="red" strokeWidth="2" />
                    <line x1="70%" y1="40%" x2="60%" y2="65%" stroke="red" strokeWidth="2" />
                    <line x1="15%" y1="65%" x2="10%" y2="85%" stroke="red" strokeWidth="2" />
                    <line x1="60%" y1="65%" x2="90%" y2="85%" stroke="red" strokeWidth="2" />
                  </svg>
                  
                  {/* Inverters and other elements */}
                  {inverters.map((inverter) => (
                    <div 
                      key={inverter.id}
                      className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center cursor-pointer border-2 ${
                        inverter.isOn ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"
                      } ${selectedInverter?.id === inverter.id ? "ring-4 ring-blue-300" : ""}`}
                      style={{ left: `${inverter.x}%`, top: `${inverter.y}%` }}
                      onClick={() => handleInverterClick(inverter)}
                    >
                      <span className="text-white text-xs font-bold">{inverter.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Selected inverter details */}
          {selectedInverter && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Circle className={`h-3 w-3 ${selectedInverter.isOn ? "fill-green-500" : "fill-red-500"}`} />
                  {selectedInverter.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{selectedInverter.isOn ? "Ligado" : "Desligado"}</p>
                  </div>
                  
                  {selectedInverter.details && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Potência</p>
                        <p className="font-medium">{selectedInverter.details.powerOutput} kW</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tensão</p>
                        <p className="font-medium">{selectedInverter.details.voltage} V</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperatura</p>
                        <p className="font-medium">{selectedInverter.details.temperature}°C</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {inverters.map((inverter) => (
                  <div 
                    key={inverter.id}
                    className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handleInverterClick(inverter)}
                  >
                    <div className="flex items-center gap-3">
                      <Circle className={`h-4 w-4 ${inverter.isOn ? "fill-green-500" : "fill-red-500"}`} />
                      <span>{inverter.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {inverter.isOn ? "Ligado" : "Desligado"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Map;
