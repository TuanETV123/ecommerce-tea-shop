import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/AdminSidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;