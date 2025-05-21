
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Maximize, Minimize, Map, Gauge, BarChart, LogOut, Activity, LineChart, FileText, Settings, Wrench } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update current date and time every second for a more real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check for fullscreen changes triggered by other methods (Esc key, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // Toggle theme mode
  const toggleTheme = () => {
    const newThemeMode = !isDarkMode;
    setIsDarkMode(newThemeMode);
    
    if (newThemeMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const formattedDate = format(currentDateTime, "dd/MM/yyyy");
  const formattedTime = format(currentDateTime, "HH:mm:ss");
  
  return (
    <header className="bg-primary text-primary-foreground shadow-md py-1 px-2 h-12">
      <div className="flex items-center justify-between max-w-[2100px] mx-auto h-full">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <h1 className="text-base font-bold">SolarMonitor</h1>
        </div>
        
        <nav className="hidden md:flex items-center justify-center space-x-1 flex-1">
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/dashboard" className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              <span className="text-xs">Dashboard</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/map") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/map" className="flex items-center gap-1">
              <Map className="h-3 w-3" />
              <span className="text-xs">Mapa</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/iv-curve") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/iv-curve" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="text-xs">Curva IV</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/performance") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/performance" className="flex items-center gap-1">
              <LineChart className="h-3 w-3" />
              <span className="text-xs">Performance</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/service-orders") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/service-orders" className="flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              <span className="text-xs">Ordens de Serviço</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/reports") ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            asChild
          >
            <Link to="/reports" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span className="text-xs">Relatórios</span>
            </Link>
          </Button>
        </nav>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center text-xs mr-2">
            <span className="bg-primary-foreground/20 rounded-lg px-2 py-1 font-medium">
              {formattedDate} | {formattedTime}
            </span>
          </div>
        
          <Toggle 
            pressed={isFullscreen} 
            onPressedChange={toggleFullscreen}
            size="sm" 
            variant="outline"
            className="h-7 w-7 p-0"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
          </Toggle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Toggle 
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0"
                aria-label="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </Toggle>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleTheme} className="text-xs">
                {isDarkMode ? (
                  <Sun className="h-3.5 w-3.5 mr-2" />
                ) : (
                  <Moon className="h-3.5 w-3.5 mr-2" />
                )}
                <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-xs">
                <Link to="/projections" className="flex items-center">
                  <BarChart className="h-3.5 w-3.5 mr-2" />
                  <span>Projeções</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
            <Link to="/">
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
