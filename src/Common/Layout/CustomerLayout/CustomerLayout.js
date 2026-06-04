import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavbar from "../../../Components/CustomerNavbar/CustomerNavbar";
import CustomerFooter from "../../../Components/CustomerFooter/CustomerFooter";

const CustomerLayout = () => {
  return (
    <div className="bg-background-light text-[#0d1b10] font-display min-h-screen flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;
