
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Maximize, Minimize, Map, Gauge, BarChart, LogOut, Activity, LineChart, FileText, Settings } from "lucide-react";
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
    <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6" />
          <h1 className="text-xl font-bold">SolarMonitor</h1>
        </div>
        
        <div className="hidden md:flex items-center text-sm mr-4">
          <span className="bg-primary-foreground/20 rounded-lg px-3 py-1 font-medium">
            {formattedDate} | {formattedTime}
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-4">
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            variant={isActive("/map") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </Link>
          </Button>
          
          <Button
            variant={isActive("/iv-curve") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/iv-curve" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Curva IV
            </Link>
          </Button>
          
          <Button
            variant={isActive("/performance") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/performance" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Performance
            </Link>
          </Button>
          
          <Button
            variant={isActive("/reports") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </Link>
          </Button>
        </nav>
        
        <div className="flex items-center space-x-2">
          <Toggle 
            pressed={isFullscreen} 
            onPressedChange={toggleFullscreen}
            size="sm" 
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Toggle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Toggle 
                size="sm" 
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Toggle>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/projections" className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  <span>Projeções</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
            <Link to="/">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
