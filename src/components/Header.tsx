import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Maximize, Minimize, LogOut, Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    <header className="bg-primary text-primary-foreground shadow-md py-2 px-4">
      <div className="flex items-center justify-between max-w-[2100px] mx-auto">
        <div className="flex items-center space-x-2">
          <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/20" />
        </div>
        
        {/* Center logo */}
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">SolarMonitor</h1>
        </div>
        
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
