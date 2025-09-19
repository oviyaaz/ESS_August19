import React, { useState } from 'react';
import AttendanceManagementScreen from './AttendanceManagement/AttendanceManagementScreen';


const HRMSScreen = () => {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">SuperAdmin HRMS Dashboard</h1>

      {/* Tabs */}
      <nav className="flex space-x-4 border-b mb-6">
        {['attendance', 'leave', 'payroll'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div>
        {activeTab === 'attendance' && <AttendanceManagementScreen />}
        {activeTab === 'leave' && <LeaveManagementScreen />}
        {activeTab === 'payroll' && <PayrollManagementScreen />}
      </div>
    </div>
  );
};

export default HRMSScreen;
