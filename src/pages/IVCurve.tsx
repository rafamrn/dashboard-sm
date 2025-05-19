
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Checkbox } from "@/components/ui/checkbox";

interface InverterString {
  id: string;
  name: string;
  isSelected: boolean;
}

interface Inverter {
  id: string;
  name: string;
  isExpanded: boolean;
  status: "online" | "offline";
  strings: InverterString[];
}

interface IVCurveData {
  voltage: number;
  current: number;
  power: number;
}

const IVCurve = () => {
  const [inverters, setInverters] = useState<Inverter[]>([
    { 
      id: "inv1", 
      name: "Inversor 01", 
      isExpanded: false, 
      status: "online",
      strings: [
        { id: "inv1-st1", name: "String 01", isSelected: false },
        { id: "inv1-st2", name: "String 02", isSelected: false },
        { id: "inv1-st3", name: "String 03", isSelected: false },
      ]
    },
    { 
      id: "inv2", 
      name: "Inversor 02", 
      isExpanded: false, 
      status: "online",
      strings: [
        { id: "inv2-st1", name: "String 01", isSelected: false },
        { id: "inv2-st2", name: "String 02", isSelected: false },
        { id: "inv2-st3", name: "String 03", isSelected: false },
      ]
    },
    { 
      id: "inv3", 
      name: "Inversor 03", 
      isExpanded: false, 
      status: "online",
      strings: [
        { id: "inv3-st1", name: "String 01", isSelected: false },
        { id: "inv3-st2", name: "String 02", isSelected: false },
      ]
    },
    { 
      id: "inv4", 
      name: "Inversor 04", 
      isExpanded: false, 
      status: "offline",
      strings: [
        { id: "inv4-st1", name: "String 01", isSelected: false },
        { id: "inv4-st2", name: "String 02", isSelected: false },
      ]
    },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStrings, setSelectedStrings] = useState<InverterString[]>([]);
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
  
  const toggleInverterExpanded = (id: string) => {
    setInverters(
      inverters.map((inverter) => 
        inverter.id === id 
          ? { ...inverter, isExpanded: !inverter.isExpanded } 
          : inverter
      )
    );
  };

  const toggleStringSelection = (inverterId: string, stringId: string) => {
    setInverters(
      inverters.map((inverter) => {
        if (inverter.id === inverterId) {
          return {
            ...inverter,
            strings: inverter.strings.map((string) => 
              string.id === stringId 
                ? { ...string, isSelected: !string.isSelected }
                : string
            )
          };
        }
        return inverter;
      })
    );
  };
  
  const selectAllStrings = (inverterId: string) => {
    setInverters(
      inverters.map((inverter) => {
        if (inverter.id === inverterId && inverter.status === "online") {
          return {
            ...inverter,
            strings: inverter.strings.map((string) => ({ ...string, isSelected: true }))
          };
        }
        return inverter;
      })
    );
  };

  const unselectAllStrings = (inverterId: string) => {
    setInverters(
      inverters.map((inverter) => {
        if (inverter.id === inverterId) {
          return {
            ...inverter,
            strings: inverter.strings.map((string) => ({ ...string, isSelected: false }))
          };
        }
        return inverter;
      })
    );
  };
  
  const startTest = () => {
    // Recolher todas as strings selecionadas
    const strings: InverterString[] = [];
    inverters.forEach(inverter => {
      if (inverter.status === "online") {
        inverter.strings.forEach(string => {
          if (string.isSelected) {
            strings.push({ 
              ...string, 
              name: `${inverter.name} - ${string.name}` 
            });
          }
        });
      }
    });
    
    if (strings.length === 0) return;
    
    setSelectedStrings(strings);
    setDialogOpen(true);
    setTestInProgress(true);
    
    // Simulate test completion after 2 seconds
    setTimeout(() => {
      setTestInProgress(false);
    }, 2000);
  };
  
  const hasSelectedStrings = inverters.some(inverter => 
    inverter.strings.some(string => string.isSelected)
  );
  
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
          <CardTitle>Selecione o Inversor e Strings para Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inverters.map((inverter) => (
              <Collapsible
                key={inverter.id}
                open={inverter.isExpanded}
                onOpenChange={() => inverter.status === "online" && toggleInverterExpanded(inverter.id)}
                className={`border rounded-lg ${
                  inverter.status === "offline" ? "opacity-60" : ""
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Circle 
                      className={`h-4 w-4 ${
                        inverter.status === "online" ? "fill-green-500" : "fill-gray-400"
                      }`} 
                    />
                    <span className="font-medium">{inverter.name}</span>
                    {inverter.status === "offline" && (
                      <span className="text-sm text-muted-foreground ml-2">(Offline)</span>
                    )}
                  </div>
                  
                  {inverter.status === "online" && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {inverter.isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                
                <CollapsibleContent>
                  <div className="border-t px-4 py-3">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium">Strings disponíveis:</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => selectAllStrings(inverter.id)}
                        >
                          Selecionar todas
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => unselectAllStrings(inverter.id)}
                        >
                          Limpar seleção
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {inverter.strings.map((string) => (
                        <div 
                          key={string.id}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Checkbox 
                            id={string.id} 
                            checked={string.isSelected} 
                            onCheckedChange={() => toggleStringSelection(inverter.id, string.id)}
                          />
                          <label 
                            htmlFor={string.id}
                            className="text-sm flex-grow cursor-pointer"
                          >
                            {string.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          
          <Button 
            className="w-full mt-6" 
            disabled={!hasSelectedStrings}
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
                ? "Testando Strings Selecionadas..."
                : "Resultado da Curva IV"
              }
            </DialogTitle>
            <DialogDescription>
              {testInProgress 
                ? "Coletando dados das strings. Por favor, aguarde..."
                : `Análise completa da curva IV e dados técnicos para ${selectedStrings.length} string(s)`
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
                  <CardTitle className="text-lg">
                    Curva IV - {selectedStrings.map(s => s.name).join(", ")}
                  </CardTitle>
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
