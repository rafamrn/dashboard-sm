
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
