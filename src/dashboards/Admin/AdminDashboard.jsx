import React, { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  // const location = useLocation();
  const { user } = location.state || {};
  console.log(user);

  return (
    <div className="flex flex-col relative min-h-screen w-full">
      <div className="h-full w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
