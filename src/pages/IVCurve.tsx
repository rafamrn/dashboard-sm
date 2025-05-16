
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface Inverter {
  id: string;
  name: string;
  isSelected: boolean;
  status: "online" | "offline";
}

interface IVCurveData {
  voltage: number;
  current: number;
  power: number;
}

const IVCurve = () => {
  const [inverters, setInverters] = useState<Inverter[]>([
    { id: "inv1", name: "Inversor 01", isSelected: false, status: "online" },
    { id: "inv2", name: "Inversor 02", isSelected: false, status: "online" },
    { id: "inv3", name: "Inversor 03", isSelected: false, status: "online" },
    { id: "inv4", name: "Inversor 04", isSelected: false, status: "offline" },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInverter, setSelectedInverter] = useState<Inverter | null>(null);
  const [testInProgress, setTestInProgress] = useState(false);
  
  // Mock IV curve data
  const mockIVCurveData: IVCurveData[] = [
    { voltage: 0, current: 9.2, power: 0 },
    { voltage: 100, current: 9.1, power: 910 },
    { voltage: 200, current: 9.0, power: 1800 },
    { voltage: 300, current: 8.8, power: 2640 },
    { voltage: 400, current: 8.5, power: 3400 },
    { voltage: 500, current: 7.8, power: 3900 },
    { voltage: 600, current: 6.5, power: 3900 },
    { voltage: 700, current: 4.8, power: 3360 },
    { voltage: 800, current: 2.5, power: 2000 },
    { voltage: 900, current: 0.5, power: 450 },
    { voltage: 1000, current: 0, power: 0 },
  ];
  
  // Technical parameters
  const technicalParameters = {
    voc: 1000, // Open circuit voltage (V)
    isc: 9.2,  // Short circuit current (A)
    vmp: 550,  // Max power voltage (V)
    imp: 7.1,  // Max power current (A)
    pmax: 3900, // Max power (W)
    ff: 0.78,  // Fill factor
    temperature: 25, // Operating temperature (°C)
    irradiance: 850, // Irradiance (W/m²)
  };
  
  const toggleInverterSelection = (id: string) => {
    setInverters(
      inverters.map((inverter) => 
        inverter.id === id 
          ? { ...inverter, isSelected: !inverter.isSelected } 
          : inverter
      )
    );
  };
  
  const startTest = () => {
    const selectedInv = inverters.find(inv => inv.isSelected);
    if (!selectedInv) return;
    
    setSelectedInverter(selectedInv);
    setDialogOpen(true);
    setTestInProgress(true);
    
    // Simulate test completion after 2 seconds
    setTimeout(() => {
      setTestInProgress(false);
    }, 2000);
  };
  
  const hasSelectedInverters = inverters.some(inverter => inverter.isSelected);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Curva IV</h1>
        <p className="text-muted-foreground">
          Análise da curva IV dos inversores instalados
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Selecione o Inversor para Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {inverters.map((inverter) => (
              <div 
                key={inverter.id}
                className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-colors
                  ${inverter.isSelected ? "border-primary bg-primary/5" : ""}
                  ${inverter.status === "offline" ? "opacity-60" : "hover:bg-gray-50 dark:hover:bg-gray-800"}
                `}
                onClick={() => inverter.status === "online" && toggleInverterSelection(inverter.id)}
              >
                <div className="flex items-center gap-3">
                  <Circle 
                    className={`h-4 w-4 ${
                      inverter.status === "online" ? "fill-green-500" : "fill-gray-400"
                    }`} 
                  />
                  <span>{inverter.name}</span>
                  {inverter.status === "offline" && (
                    <span className="text-sm text-muted-foreground ml-2">(Offline)</span>
                  )}
                </div>
                {inverter.isSelected && <Check className="h-5 w-5 text-primary" />}
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full mt-6" 
            disabled={!hasSelectedInverters}
            onClick={startTest}
          >
            Iniciar Teste
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {testInProgress 
                ? `Testando ${selectedInverter?.name}...`
                : `Resultado da Curva IV - ${selectedInverter?.name}`
              }
            </DialogTitle>
            <DialogDescription>
              {testInProgress 
                ? "Coletando dados do inversor. Por favor, aguarde..."
                : "Análise completa da curva IV e dados técnicos"
              }
            </DialogDescription>
          </DialogHeader>
          
          {testInProgress ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Processando dados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* IV Curve Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Curva IV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockIVCurveData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="voltage" label={{ value: 'Tensão (V)', position: 'insideBottom', offset: -5 }} />
                        <YAxis yAxisId="left" label={{ value: 'Corrente (A)', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Potência (W)', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="current" stroke="#8884d8" name="Corrente" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="power" stroke="#82ca9d" name="Potência" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Technical Data */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Dados Técnicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Tensão de Circuito Aberto (Voc)</TableCell>
                        <TableCell>{technicalParameters.voc}</TableCell>
                        <TableCell>V</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Corrente de Curto-Circuito (Isc)</TableCell>
                        <TableCell>{technicalParameters.isc}</TableCell>
                        <TableCell>A</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tensão de Potência Máxima (Vmp)</TableCell>
                        <TableCell>{technicalParameters.vmp}</TableCell>
                        <TableCell>V</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Corrente de Potência Máxima (Imp)</TableCell>
                        <TableCell>{technicalParameters.imp}</TableCell>
                        <TableCell>A</TableCell>
                        <TableCell className="text-yellow-500">Atenção</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Potência Máxima (Pmax)</TableCell>
                        <TableCell>{technicalParameters.pmax}</TableCell>
                        <TableCell>W</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fator de Preenchimento (FF)</TableCell>
                        <TableCell>{technicalParameters.ff}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Temperatura</TableCell>
                        <TableCell>{technicalParameters.temperature}</TableCell>
                        <TableCell>°C</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Irradiância</TableCell>
                        <TableCell>{technicalParameters.irradiance}</TableCell>
                        <TableCell>W/m²</TableCell>
                        <TableCell className="text-green-500">Normal</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IVCurve;
