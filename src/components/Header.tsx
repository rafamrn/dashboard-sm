
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Map, Gauge, LogOut } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
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
        </nav>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
          <Link to="/">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sair</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
