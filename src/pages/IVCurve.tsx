
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileDown, X } from "lucide-react";

// Mock data for inverters and their strings
const inverters = [
  {
    id: "inv1",
    name: "Inversor 01",
    strings: [
      { id: "str1-1", name: "String 1.1" },
      { id: "str1-2", name: "String 1.2" },
      { id: "str1-3", name: "String 1.3" }
    ]
  },
  {
    id: "inv2",
    name: "Inversor 02",
    strings: [
      { id: "str2-1", name: "String 2.1" },
      { id: "str2-2", name: "String 2.2" },
      { id: "str2-3", name: "String 2.3" }
    ]
  },
  {
    id: "inv3",
    name: "Inversor 03",
    strings: [
      { id: "str3-1", name: "String 3.1" },
      { id: "str3-2", name: "String 3.2" }
    ]
  }
];

// Generate IV Curve data points
const generateIVCurveData = (stringId: string) => {
  // Generate different curve patterns based on stringId for variety
  const seed = parseInt(stringId.replace(/\D/g, ''));
  const baseVoltage = 30 + (seed % 10); // Between 30-40
  const baseCurrent = 8 + (seed % 4);   // Between 8-12
  
  return Array.from({ length: 40 }, (_, i) => {
    const voltage = i * baseVoltage / 20;
    // Create the characteristic IV curve shape with some variance
    const currentFactor = Math.min(1, Math.max(0, 1 - Math.pow((voltage - baseVoltage/2) / (baseVoltage/2), 8 + (seed % 6))));
    const current = baseCurrent * currentFactor;
    const power = voltage * current;
    
    return {
      voltage: parseFloat(voltage.toFixed(2)),
      current: parseFloat(current.toFixed(2)),
      power: parseFloat(power.toFixed(2))
    };
  });
};

const IVCurve = () => {
  const [selectedInverter, setSelectedInverter] = useState("");
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{ stringId: string, data: any[] }[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Get available strings for selected inverter
  const availableStrings = selectedInverter 
    ? inverters.find(inv => inv.id === selectedInverter)?.strings || []
    : [];
  
  // Handle string selection
  const handleStringSelection = (stringId: string) => {
    if (selectedStrings.includes(stringId)) {
      setSelectedStrings(selectedStrings.filter(id => id !== stringId));
    } else {
      setSelectedStrings([...selectedStrings, stringId]);
    }
  };
  
  // Handle "Test All" functionality
  const selectAllStrings = () => {
    if (availableStrings.length === selectedStrings.length) {
      setSelectedStrings([]);
    } else {
      setSelectedStrings(availableStrings.map(str => str.id));
    }
  };
  
  // Run IV Curve Test
  const runTest = () => {
    setIsTestRunning(true);
    
    // Simulate test taking time
    setTimeout(() => {
      const results = selectedStrings.map(stringId => ({
        stringId,
        data: generateIVCurveData(stringId)
      }));
      
      setTestResults(results);
      setIsTestRunning(false);
      setShowResults(true);
    }, 2000);
  };
  
  // Export report as PDF
  const downloadReport = () => {
    window.print();
  };
  
  // Get string name by ID
  const getStringName = (stringId: string) => {
    for (const inverter of inverters) {
      const string = inverter.strings.find(s => s.id === stringId);
      if (string) {
        return `${inverter.name} - ${string.name}`;
      }
    }
    return stringId;
  };
  
  return (
    <div className="space-y-6 print:m-0 print:p-4">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Teste de Curva I-V</h1>
        <p className="text-muted-foreground">
          Realizar e analisar testes de curva I-V nas strings dos inversores
        </p>
      </div>
      
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Configuração do Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Inversor</label>
              <Select 
                value={selectedInverter} 
                onValueChange={(value) => {
                  setSelectedInverter(value);
                  setSelectedStrings([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um inversor" />
                </SelectTrigger>
                <SelectContent>
                  {inverters.map(inverter => (
                    <SelectItem key={inverter.id} value={inverter.id}>
                      {inverter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Selecionar Strings</label>
                {selectedInverter && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllStrings}
                    disabled={!selectedInverter}
                  >
                    {availableStrings.length === selectedStrings.length ? "Desmarcar Todos" : "Selecionar Todos"}
                  </Button>
                )}
              </div>
              
              {selectedInverter ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableStrings.map(string => (
                    <Button
                      key={string.id}
                      variant={selectedStrings.includes(string.id) ? "default" : "outline"}
                      className="justify-start w-full"
                      onClick={() => handleStringSelection(string.id)}
                    >
                      {string.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Selecione um inversor primeiro</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={runTest} 
            disabled={selectedStrings.length === 0 || isTestRunning}
          >
            {isTestRunning ? "Executando..." : "Iniciar Teste"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Resultados do Teste de Curva I-V</span>
              <Button variant="ghost" size="icon" onClick={() => setShowResults(false)} className="print:hidden">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 py-4">
            {testResults.map((result, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold">{getStringName(result.stringId)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Curva I-V</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={result.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="voltage" 
                              label={{ value: 'Tensão (V)', position: 'insideBottomRight', offset: -5 }} 
                            />
                            <YAxis 
                              label={{ value: 'Corrente (A)', angle: -90, position: 'insideLeft' }} 
                            />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="current" 
                              name="Corrente" 
                              stroke="#3b82f6" 
                              dot={false} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Curva P-V</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={result.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="voltage" 
                              label={{ value: 'Tensão (V)', position: 'insideBottomRight', offset: -5 }} 
                            />
                            <YAxis 
                              label={{ value: 'Potência (W)', angle: -90, position: 'insideLeft' }} 
                            />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="power" 
                              name="Potência" 
                              stroke="#22c55e" 
                              dot={false} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Parâmetros da String</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Voc (Tensão de Circuito Aberto)</p>
                        <p className="text-xl font-bold">{result.data[0].voltage.toFixed(1)} V</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Isc (Corrente de Curto-Circuito)</p>
                        <p className="text-xl font-bold">{result.data[result.data.length - 1].current.toFixed(2)} A</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pmax (Potência Máxima)</p>
                        <p className="text-xl font-bold">
                          {Math.max(...result.data.map(d => d.power)).toFixed(1)} W
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">FF (Fator de Forma)</p>
                        <p className="text-xl font-bold">
                          {(Math.max(...result.data.map(d => d.power)) / (result.data[0].voltage * result.data[result.data.length - 1].current) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <DialogFooter className="print:hidden mt-4">
            <Button className="w-full md:w-auto gap-2" onClick={downloadReport}>
              <FileDown className="h-4 w-4" /> Baixar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IVCurve;
