
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Map, Gauge, Activity, LineChart, Wrench, FileText, BarChart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Gauge },
  { title: "Mapa", url: "/map", icon: Map },
  { title: "Curva IV", url: "/iv-curve", icon: Activity },
  { title: "Performance", url: "/performance", icon: LineChart },
  { title: "Ordens de Serviço", url: "/service-orders", icon: Wrench },
  { title: "Relatórios", url: "/reports", icon: FileText },
  { title: "Projeções", url: "/projections", icon: BarChart },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-primary" />
          {state === "expanded" && (
            <h1 className="text-lg font-bold text-primary">SolarMonitor</h1>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
