import { useState, useEffect } from "react";
import {
  Users, Check, Settings, Database, Shield,
  BarChart3, UserCheck, Building, File
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseApi = import.meta.env.VITE_BASE_API;

const SuperAdminPurchaseHome = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [purchasedFeatures, setPurchasedFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(JSON.parse(sessionStorage.getItem("userdata")));
  const navigate = useNavigate();

  // Watch for session changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(sessionStorage.getItem("userdata")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch purchased features
  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const userId = userInfo?.id || userInfo?.user_id;
        if (!userId) return;

        const apiUrl = `${baseApi}/api/superadmin/${userId}/superadmin-features/`;
        const response = await axios.get(apiUrl);
        setPurchasedFeatures(response.data.features || []);
      } catch (error) {
        console.error("Error fetching superadmin features:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatures();
  }, [userInfo?.id, userInfo?.user_id]);

  // All available features
  const superAdminFeatures = [
    { name: "User-Management", icon: <Users size={20} /> },
    { name: "HRMS", icon: <Users size={20} /> },
    { name: "Admin Management", icon: <Shield size={20} /> },
    { name: "System Settings", icon: <Settings size={20} /> },
    { name: "Database Management", icon: <Database size={20} /> },
    { name: "System Analytics", icon: <BarChart3 size={20} /> },
    { name: "User Permissions", icon: <UserCheck size={20} /> },
    { name: "Organization Management", icon: <Building size={20} /> },
    { name: "Audit Logs", icon: <File size={20} /> },
    { name: "Backup & Restore", icon: <Database size={20} /> },
  ];

  // Toggle features
  const handlePurchaseFeature = (name) =>
    setSelectedFeatures((prev) => (prev.includes(name) ? prev : [...prev, name]));

  const handleUnpurchaseFeature = (name) =>
    setSelectedFeatures((prev) => prev.filter((f) => f !== name));

  // Final purchase
  const handlePurchaseAll = async () => {
    try {
      const userId = userInfo?.id || userInfo?.user_id;
      if (!userId) return;

      const apiUrl = `${baseApi}/api/superadmin/${userId}/update-superadmin-features/`;

      await axios.patch(apiUrl, {
        features: [...purchasedFeatures, ...selectedFeatures],
      });

      // Redirect to Purchased Features page
      navigate("/superadmin/purchased-icons");
    } catch (error) {
      console.error("Error purchasing features:", error);
      alert("Failed to purchase features. Please try again.");
    }
  };

  const isFeaturePurchased = (name) => purchasedFeatures.includes(name);
  const isFeatureSelected = (name) => selectedFeatures.includes(name);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading superadmin features...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          SuperAdmin Feature Store
        </h1>
        <p className="text-gray-600">Select and purchase features</p>
        <span className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Super Administrator
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center mb-8">
        {superAdminFeatures.map((item) => (
          <div key={item.name} className="relative">
            {/* Status badge */}
            {isFeaturePurchased(item.name) && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <Check size={12} />
              </div>
            )}
            {isFeatureSelected(item.name) && !isFeaturePurchased(item.name) && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <Check size={12} />
              </div>
            )}

            {/* Card */}
            <div
              className={`border-2 rounded-lg p-4 w-40 h-40 flex flex-col justify-between items-center
                ${isFeaturePurchased(item.name) ? "bg-green-50 border-green-200"
                  : isFeatureSelected(item.name) ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"}`}
            >
              <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-2
                ${isFeaturePurchased(item.name) ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">{item.name}</h3>
              <div>
                {isFeaturePurchased(item.name) ? (
                  <button className="bg-green-500 text-white px-4 py-1 rounded text-xs font-medium" disabled>
                    Purchased
                  </button>
                ) : (
                  <button
                    className={`${isFeatureSelected(item.name) ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-1 rounded text-xs font-medium`}
                    onClick={() =>
                      isFeatureSelected(item.name)
                        ? handleUnpurchaseFeature(item.name)
                        : handlePurchaseFeature(item.name)
                    }
                  >
                    {isFeatureSelected(item.name) ? "Remove" : "Select"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase button */}
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg disabled:opacity-50"
          onClick={handlePurchaseAll}
          disabled={selectedFeatures.length === 0}
        >
          Purchase Selected Features ({selectedFeatures.length})
        </button>
      </div>
    </div>
  );
};

export default SuperAdminPurchaseHome;
