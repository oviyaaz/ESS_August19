import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DailyCheckInOut = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentLocation, setCurrentLocation] = useState(null);

  // Mock data for daily attendance
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      department: 'Development',
      checkIn: '09:15:00',
      checkOut: '18:30:00',
      location: { lat: 11.0168, lng: 76.9558, address: '123 Tech Park, Coimbatore' },
      status: 'present',
      workingHours: '09:15',
      lateBy: '00:15',
      avatar: 'JD'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      department: 'Design',
      checkIn: '08:45:00',
      checkOut: '17:45:00',
      location: { lat: 11.0168, lng: 76.9558, address: '123 Tech Park, Coimbatore' },
      status: 'present',
      workingHours: '09:00',
      lateBy: null,
      avatar: 'JS'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Mike Johnson',
      department: 'Marketing',
      checkIn: '10:30:00',
      checkOut: null,
      location: { lat: 11.0168, lng: 76.9558, address: '123 Tech Park, Coimbatore' },
      status: 'late',
      workingHours: '07:30',
      lateBy: '01:30',
      avatar: 'MJ'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Sarah Wilson',
      department: 'HR',
      checkIn: null,
      checkOut: null,
      location: null,
      status: 'absent',
      workingHours: '00:00',
      lateBy: null,
      avatar: 'SW'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'David Brown',
      department: 'Development',
      checkIn: '09:00:00',
      checkOut: '13:00:00',
      location: { lat: 11.0168, lng: 76.9558, address: '123 Tech Park, Coimbatore' },
      status: 'half-day',
      workingHours: '04:00',
      lateBy: null,
      avatar: 'DB'
    }
  ]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const filteredData = attendanceData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'half-day':
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
      'half-day': 'bg-blue-100 text-blue-800'
    };

    return `px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleManualCheckIn = (employeeId) => {
    setAttendanceData(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, checkIn: new Date().toLocaleTimeString(), status: 'present' }
        : emp
    ));
  };

  const handleManualCheckOut = (employeeId) => {
    setAttendanceData(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, checkOut: new Date().toLocaleTimeString() }
        : emp
    ));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Daily Check-In/Out</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Today: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <option value="half-day">Half Day</option>
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

      {/* Live Location Status */}
      {currentLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Live Location Tracking Active</span>
            <span className="text-green-600 text-sm">
              Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Attendance Table */}
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
            {filteredData.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{employee.avatar}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(employee.status)}
                    <span className={getStatusBadge(employee.status)}>
                      {employee.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {employee.lateBy && (
                      <span className="text-xs text-red-500">Late by {employee.lateBy}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.checkIn ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>{employee.checkIn}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not checked in</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.checkOut ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span>{employee.checkOut}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not checked out</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{employee.workingHours}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.location ? (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="max-w-32 truncate">{employee.location.address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No location</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {!employee.checkIn && (
                      <button
                        onClick={() => handleManualCheckIn(employee.id)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {employee.checkIn && !employee.checkOut && (
                      <button
                        onClick={() => handleManualCheckOut(employee.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Check Out
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-900">
                {filteredData.filter(emp => emp.status === 'present').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-900">
                {filteredData.filter(emp => emp.status === 'absent').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Late</p>
              <p className="text-2xl font-bold text-yellow-900">
                {filteredData.filter(emp => emp.status === 'late').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Half Day</p>
              <p className="text-2xl font-bold text-blue-900">
                {filteredData.filter(emp => emp.status === 'half-day').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckInOut;