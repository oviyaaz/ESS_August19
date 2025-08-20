import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SuperAdminHeader from "./SuperAdminHeader";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/superadmin/purchased-icons");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SuperAdminHeader currentPage="dashboard" onLogoClick={handleLogoClick} />

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Render nested routes here */}
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
