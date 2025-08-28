import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const MonthlyAttendanceSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [monthlyData, setMonthlyData] = useState([]);
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [totals, setTotals] = useState({
    totalEmployees: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    overallAttendanceRate: 0, 
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      try {
        const res1 = await axios.get(
          `${import.meta.env.VITE_BASE_API}/monthly-summary/?month=${monthParam}`
        );
        setMonthlyData(res1.data.data);
        setTotals({
          totalEmployees: res1.data.totals.totalEmployees,
          totalPresent: res1.data.totals.totalPresent,
          totalAbsent: res1.data.totals.totalAbsent,
          totalLate: res1.data.totals.totalLate,
          overallAttendanceRate: res1.data.totals.overallAttendanceRate, 
        });

        const res2 = await axios.get(
          `${import.meta.env.VITE_BASE_API}/department-summary/?month=${monthParam}`
        );
        setDepartmentSummary(res2.data.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const filteredData = monthlyData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getAttendanceRateColor = (rate) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceRateBg = (rate) => {
    if (rate >= 95) return 'bg-green-100';
    if (rate >= 85) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const departments = [...new Set(monthlyData.map((emp) => emp.department))];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance Summary</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-lg font-semibold text-gray-900 min-w-40 text-center">
            {months[selectedMonth]} {selectedYear}
          </div>
          <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Employees</p>
              <p className="text-3xl font-bold text-blue-900">{totals.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
  <p className="text-sm font-medium text-green-600">Total Present</p>
  <p className="text-3xl font-bold text-green-900">
    {totals.totalPresent + totals.totalLate}
  </p>
</div>

            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Absent</p>
              <p className="text-3xl font-bold text-red-900">{totals.totalAbsent}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Late Arrivals</p>
              <p className="text-3xl font-bold text-yellow-900">{totals.totalLate}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Average Attendance</p>
              <p className="text-3xl font-bold text-purple-900">
                {totals.overallAttendanceRate}%

              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absent Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Late Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Half Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((employee, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{employee.avatar}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">
                        {employee.employeeId} • {employee.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    <div className="flex-shrink-0 w-16 bg-green-100 rounded-full h-2">
      <div
        className="bg-green-500 h-2 rounded-full"
        style={{ width: `${((employee.presentDays + employee.lateDays) / employee.totalDays) * 100}%` }}
      ></div>
    </div>
    <span className="ml-3 text-sm font-medium text-gray-900">
      {employee.presentDays + employee.lateDays}/{employee.totalDays}
    </span>
  </div>
</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.absentDays === 0
                        ? 'bg-green-100 text-green-800'
                        : employee.absentDays <= 2
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.absentDays} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.lateDays === 0
                        ? 'bg-green-100 text-green-800'
                        : employee.lateDays <= 3
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.lateDays} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{employee.halfDays} days</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600">{employee.overtimeHours}h</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceRateBg(
                        employee.attendanceRate
                      )} ${getAttendanceRateColor(employee.attendanceRate)}`}
                    >
                      {employee.attendanceRate.toFixed(1)}%
                    </div>
                    {employee.attendanceRate >= 95 && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {employee.attendanceRate < 85 && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department-wise Summary */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentSummary.map((dept, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{dept.department}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Employees:</span>
                  <span className="font-medium">{dept.employees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Attendance:</span>
                  <span className={`font-medium ${getAttendanceRateColor(dept.avgAttendance)}`}>
                    {dept.avgAttendance.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Present:</span>
                  <span className="font-medium text-green-600">{dept.totalPresent + dept.totalLate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Absents:</span>
                  <span className="font-medium text-red-600">{dept.totalAbsent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Late Arrivals:</span>
                  <span className="font-medium text-yellow-600">{dept.totalLate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceSummary;
