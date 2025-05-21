
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";

const Layout = () => {
  // Set dark mode as default on initial load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-y-auto">
        <div className="w-full h-full px-4">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
