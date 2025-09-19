import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, User, Calendar, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const ShiftWiseAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShiftAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/shift-wise-attendance`, {
          params: { from_date: selectedDate, to_date: selectedDate, shift_id: selectedShift !== 'all' ? selectedShift : undefined }
        });

        setShifts(response.data.shifts || []);
      } catch (error) {
        console.error("Error fetching shift-wise attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftAttendance();
  }, [selectedDate, selectedShift]);

  const filteredShifts = shifts.map(shift => ({
    ...shift,
    attendance_records: shift.attendance_records.filter(employee => {
      const matchesSearch = employee.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || employee.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    })
  }));

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'half day':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      'half day': 'bg-blue-100 text-blue-800'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleManualCheckIn = (shiftId, employeeId) => {
    setShifts(prev => prev.map(shift =>
      shift.shift_id === shiftId
        ? {
            ...shift,
            attendance_records: shift.attendance_records.map(emp =>
              emp.user_id === employeeId
                ? { ...emp, check_in: new Date().toLocaleTimeString(), status: 'present' }
                : emp
            )
          }
        : shift
    ));
  };

  const handleManualCheckOut = (shiftId, employeeId) => {
    setShifts(prev => prev.map(shift =>
      shift.shift_id === shiftId
        ? {
            ...shift,
            attendance_records: shift.attendance_records.map(emp =>
              emp.user_id === employeeId
                ? { ...emp, check_out: new Date().toLocaleTimeString() }
                : emp
            )
          }
        : shift
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Shift-Wise Attendance</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Today: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half day">Half Day</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="all">All Shifts</option>
              {shifts.map(shift => (
                <option key={shift.shift_id} value={shift.shift_id}>
                  {shift.shift_number} ({shift.shift_start_time} - {shift.shift_end_time})
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Shift-wise Attendance Tables */}
      <div className="space-y-8">
        {loading ? (
          <p className="text-gray-500 p-4">Loading shift-wise attendance data...</p>
        ) : filteredShifts.length === 0 ? (
          <p className="text-gray-500 p-4">No attendance data available.</p>
        ) : (
          filteredShifts.map(shift => (
            <div key={shift.shift_id}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {shift.shift_number} ({shift.shift_start_time} - {shift.shift_end_time})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shift.attendance_records.map(employee => (
                      <tr key={employee.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {employee.user_name?.[0] || "U"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.user_name}</div>
                              <div className="text-sm text-gray-500">{employee.employee_id} • {employee.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(employee.status)}
                            <span className={getStatusBadge(employee.status)}>
                              {employee.status.replace(' ', '-').toUpperCase()}
                            </span>
                            {employee.late_by && <span className="text-xs text-red-500">Late by {employee.late_by}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.check_in || "Not checked in"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.check_out || "Not checked out"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.working_hours || "00:00:00"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.location || "No location"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!employee.check_in && (
                              <button
                                onClick={() => handleManualCheckIn(shift.shift_id, employee.user_id)}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                              >
                                Check In
                              </button>
                            )}
                            {employee.check_in && !employee.check_out && (
                              <button
                                onClick={() => handleManualCheckOut(shift.shift_id, employee.user_id)}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                              >
                                Check Out
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-800">View Details</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Shift Summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Present</p>
                      <p className="text-2xl font-bold text-green-900">{shift.summary.present_count}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Absent</p>
                      <p className="text-2xl font-bold text-red-900">{shift.summary.absent_count}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Late</p>
                      <p className="text-2xl font-bold text-yellow-900">{shift.summary.late_count}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Half Day</p>
                      <p className="text-2xl font-bold text-blue-900">{shift.summary.halfday_count}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShiftWiseAttendance;