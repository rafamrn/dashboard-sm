
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Maximize, Minimize, Map, Gauge, BarChart, LogOut, Activity } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
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
  
  return (
    <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6" />
          <h1 className="text-xl font-bold">SolarMonitor</h1>
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
            variant={isActive("/projections") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/projections" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Projeções
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
          
          <Toggle 
            pressed={isDarkMode} 
            onPressedChange={toggleTheme}
            size="sm" 
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Toggle>
          
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
