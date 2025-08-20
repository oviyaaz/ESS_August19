import { Routes, Route } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import AdminDashboard from "./dashboards/Admin/AdminDashboard";
import OfficerDashboard from "./dashboards/Officer/OfficerDashboard";
import ManagerDashboard from "./dashboards/Manager/ManagerDashboard";
import UserDashboard from "./dashboards/User/UserDashboard";
import DashboardLayout from "./layout/LayoutDashboard";
import { LayoutDashboardIcon, Users, Package } from "lucide-react";
import SuperAdminPurchaseHome from "./dashboards/SuperAdmin/SuperAdminPurchaseHome";
import SuperAdminPurchasedIcons from "./dashboards/SuperAdmin/SuperAdminPurchasedIcons";
import SuperAdminDashboard from "./dashboards/SuperAdmin/SuperAdminDashboard";
import UserManagement from "./dashboards/SuperAdmin/UserManagement";
import HRMSScreen from "./dashboards/SuperAdmin/HRMSScreen";

// Example: Sidebar links for Admin
const adminLinks = [
  { link: "/admin", name: "Dashboard", icon: <LayoutDashboardIcon /> },
  { link: "/admin/manager", name: "Managers", icon: <Users /> },
  { link: "/admin/inventory", name: "Inventory", icon: <Package /> },
];

// You can create similar arrays for superadmin, officer, manager, user
// or even load them dynamically based on role.

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LoginForm />} />

      {/* Dashboards with Layout */}
      <Route
        path="/admin"
        element={
          <DashboardLayout sideBarLinks={adminLinks}>
            <AdminDashboard />
          </DashboardLayout>
        }
      />
      <Route path="superadmin" element={<SuperAdminDashboard />}>
        {/* <Route index element={<SuperAdminPurchaseHome />} /> */}
        <Route path="purchased-icons" element={<SuperAdminPurchasedIcons />} />
        <Route path="icons" element={<SuperAdminPurchaseHome />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="hrms" element={<HRMSScreen />} />
      </Route>

      <Route path="/officer" element={<OfficerDashboard />} />
      <Route
        path="/manager"
        element={
          <DashboardLayout sideBarLinks={adminLinks}>
            <ManagerDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/user"
        element={
          <DashboardLayout sideBarLinks={adminLinks}>
            <UserDashboard />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}

export default App;
