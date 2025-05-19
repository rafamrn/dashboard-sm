
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, Maximize2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
  const [flowAnimation, setFlowAnimation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
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
      y: 65,
      details: {
        powerOutput: 12.1,
        voltage: 595,
        temperature: 36.5
      }
    },
    { 
      id: "string2", 
      name: "String Box 02", 
      isOn: true, 
      x: 60, 
      y: 65,
      details: {
        powerOutput: 11.9,
        voltage: 596,
        temperature: 35.8
      }
    },
    { 
      id: "qdac", 
      name: "QDAC", 
      isOn: true, 
      x: 90, 
      y: 85,
      details: {
        powerOutput: 54.2,
        voltage: 380,
        temperature: 40.2
      }
    },
    { 
      id: "qdat", 
      name: "QDAT", 
      isOn: true, 
      x: 10, 
      y: 85,
      details: {
        powerOutput: 0,
        voltage: 220,
        temperature: 32.6
      } 
    },
    { 
      id: "qdac-01", 
      name: "QDAC-01", 
      isOn: true, 
      x: 80, 
      y: 85,
      details: {
        powerOutput: 27.1,
        voltage: 380,
        temperature: 39.8
      }
    }
  ];
  
  // Animation for energy flow
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowAnimation((prev) => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleInverterClick = (inverter: InverterLocation, e?: React.MouseEvent) => {
    setSelectedInverter(inverter);
    
    // Se estiver em tela cheia, mostrar popup no local do clique
    if (isFullscreen && e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setPopupPosition({
        x: e.clientX,
        y: e.clientY
      });
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };
  
  const toggleFullscreen = () => {
    const mapElement = document.getElementById("map-container");
    if (!mapElement) return;
    
    if (!isFullscreen) {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Fechar popup quando sair do modo tela cheia
      if (!document.fullscreenElement) {
        setShowPopup(false);
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  
  // Fechar popup quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showPopup && !(e.target as HTMLElement).closest('.popup-info') && 
          !(e.target as HTMLElement).closest('.map-element')) {
        setShowPopup(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);
  
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
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  {isFullscreen ? "Sair de Tela Cheia" : "Tela Cheia"}
                </Button>
              </div>
              <div id="map-container" className="relative w-full h-[500px] border rounded-lg bg-blue-50 dark:bg-blue-950/20 overflow-hidden">
                {/* Plant map background with grid */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-blue-100 dark:border-blue-900/30"></div>
                  ))}
                </div>
                
                {/* Plant map elements */}
                <div className="absolute inset-0">
                  {/* Main connections with animated energy flow */}
                  <svg className="w-full h-full">
                    {/* Horizontal connections */}
                    <line x1="25%" y1="40%" x2="70%" y2="40%" stroke="red" strokeWidth="2" />
                    <line x1="15%" y1="65%" x2="60%" y2="65%" stroke="red" strokeWidth="2" />
                    
                    {/* Vertical connections */}
                    <line x1="25%" y1="40%" x2="15%" y2="65%" stroke="red" strokeWidth="2" />
                    <line x1="70%" y1="40%" x2="60%" y2="65%" stroke="red" strokeWidth="2" />
                    <line x1="15%" y1="65%" x2="10%" y2="85%" stroke="red" strokeWidth="2" />
                    <line x1="60%" y1="65%" x2="90%" y2="85%" stroke="red" strokeWidth="2" />
                    
                    {/* Energy flow animations */}
                    {/* Horizontal flow 1 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="25%" 
                        to="70%" 
                        dur="3s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="40%" 
                        to="40%" 
                        dur="3s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    
                    {/* Horizontal flow 2 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="15%" 
                        to="60%" 
                        dur="4s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="65%" 
                        to="65%" 
                        dur="4s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    
                    {/* Vertical flow 1 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="25%" 
                        to="15%" 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="40%" 
                        to="65%" 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    
                    {/* Vertical flow 2 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="70%" 
                        to="60%" 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="40%" 
                        to="65%" 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    
                    {/* Vertical flow 3 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="15%" 
                        to="10%" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="65%" 
                        to="85%" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    
                    {/* Vertical flow 4 */}
                    <circle r="3" fill="yellow" opacity="0.8">
                      <animate 
                        attributeName="cx" 
                        from="60%" 
                        to="90%" 
                        dur="3s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="cy" 
                        from="65%" 
                        to="85%" 
                        dur="3s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  </svg>
                  
                  {/* Inverters and other elements */}
                  {inverters.map((inverter) => (
                    <div 
                      key={inverter.id}
                      className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center cursor-pointer border-2 map-element ${
                        inverter.isOn ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"
                      } ${selectedInverter?.id === inverter.id ? "ring-4 ring-blue-300" : ""}`}
                      style={{ left: `${inverter.x}%`, top: `${inverter.y}%` }}
                      onClick={(e) => handleInverterClick(inverter, e)}
                    >
                      <span className="text-white text-xs font-bold">{inverter.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  
                  {/* Popup for fullscreen mode */}
                  {showPopup && selectedInverter && (
                    <div 
                      className="absolute z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[250px] popup-info"
                      style={{ 
                        left: `${popupPosition.x}px`, 
                        top: `${popupPosition.y}px`,
                        transform: 'translate(10px, 10px)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Circle className={`h-3 w-3 ${selectedInverter.isOn ? "fill-green-500" : "fill-red-500"}`} />
                        <h3 className="font-medium">{selectedInverter.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <span className="text-sm font-medium">{selectedInverter.isOn ? "Ligado" : "Desligado"}</span>
                        </div>
                        
                        {selectedInverter.details && (
                          <>
                            <div className="grid grid-cols-2 gap-1">
                              <span className="text-sm text-muted-foreground">Potência:</span>
                              <span className="text-sm font-medium">{selectedInverter.details.powerOutput} kW</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <span className="text-sm text-muted-foreground">Tensão:</span>
                              <span className="text-sm font-medium">{selectedInverter.details.voltage} V</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <span className="text-sm text-muted-foreground">Temperatura:</span>
                              <span className="text-sm font-medium">{selectedInverter.details.temperature}°C</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Selected inverter details (when not in fullscreen) */}
          {selectedInverter && !isFullscreen && (
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
                    className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
