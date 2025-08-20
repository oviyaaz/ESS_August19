import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, ChevronDown, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const SuperAdminPurchasedIcons = () => {
  const [selectedFeatures, setSelectedFeatures] = useState(['User-Management', 'HRMS']);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(JSON.parse(sessionStorage.getItem("userdata")));
  const navigate = useNavigate();

  // SuperAdmin feature map
  const superAdminFeatureMap = {
    "User-Management": { icon: <Users size={24} />, color: "bg-blue-500" },
    "HRMS": { icon: <Briefcase size={24} />, color: "bg-green-500" },
  };

  const handleNavigateToStore = () => {
    navigate("/superadmin/icons");
  };

 const handleFeatureClick = (featureName) => {
  const routeMap = {
    "User-Management": "/superadmin/user-management",
    "HRMS": "/superadmin/hrms",
  };

  if (routeMap[featureName]) {
    navigate(routeMap[featureName]);
  } else {
    console.warn("No route defined for feature:", featureName);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-3">Welcome, Super Admin!</h2>
          <div className="mb-4">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Super Administrator
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            {selectedFeatures.length > 0
              ? `You have ${selectedFeatures.length} purchased features in your dashboard.`
              : "Your dashboard looks a bit empty right now."
            }
          </p>
        </div>

        {selectedFeatures.length > 0 ? (
          <>
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Purchased Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedFeatures.map((feature, index) => {
                  const featureData = superAdminFeatureMap[feature] || {
                    icon: <Package size={24} />,
                    color: "bg-gray-500"
                  };

                  return (
                    <div
                      key={`${feature}-${index}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 cursor-pointer transform hover:scale-105"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`${featureData.color} text-white rounded-full w-12 h-12 flex items-center justify-center mb-3`}>
                          {featureData.icon}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 text-center leading-tight mb-3">
                          {feature}
                        </h4>
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleNavigateToStore}
              >
                <span className="text-base">Super-Admin Store</span>
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-12 flex justify-center">
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="text-gray-400 text-6xl">📦</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Click on the Admin Store button below to explore and purchase administrative features for your dashboard.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleNavigateToStore}
              >
                <span className="text-base">Visit Super-Admin Store</span>
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SuperAdminPurchasedIcons;