import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const OvertimeCalculation = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [overtimeData, setOvertimeData] = useState([]);
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [totals, setTotals] = useState({
    totalEmployees: 0,
    totalOvertimeHours: 0,
    totalOvertimeDays: 0,
    totalOvertimePay: 0,
    averageOvertimeHours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_API}/overtime-summary/?month=${monthParam}`),
          axios.get(`${import.meta.env.VITE_BASE_API}/department-overtime-summary/?month=${monthParam}`),
        ]);

        setOvertimeData(res1.data.data);
        setTotals(res1.data.totals);
        setDepartmentSummary(res2.data.data);
      } catch (err) {
        setError('Failed to load overtime data. Please try again.');
        console.error('Error fetching overtime data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const filteredData = useMemo(() => {
    return overtimeData.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === 'all' || employee.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [overtimeData, searchTerm, departmentFilter]);

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const getOvertimeColor = (hours) => {
    if (hours >= 10) return 'text-red-600';
    if (hours >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOvertimeBg = (hours) => {
    if (hours >= 10) return 'bg-red-100';
    if (hours >= 5) return 'bg-yellow-100';
    return 'bg-green-100';
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

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Overtime Hours', 'Overtime Days', 'Overtime Rate', 'Total Overtime Pay'];
    const rows = filteredData.map(emp => [
      emp.employeeId,
      emp.name,
      emp.department,
      emp.totalOvertimeHours,
      emp.overtimeDays,
      emp.overtimeRate,
      emp.totalOvertimePay,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overtime_summary_${selectedYear}_${selectedMonth + 1}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = [...new Set(overtimeData.map((emp) => emp.department))];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Overtime Summary</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-lg font-semibold text-gray-900 min-w-40 text-center">
            {months[selectedMonth]} {selectedYear}
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Next Month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              <p className="text-sm font-medium text-green-600">Total Overtime Hours</p>
              <p className="text-3xl font-bold text-green-900">{totals.totalOvertimeHours.toFixed(1)}h</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Total Overtime Days</p>
              <p className="text-3xl font-bold text-yellow-900">{totals.totalOvertimeDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Overtime Pay</p>
              <p className="text-3xl font-bold text-purple-900">${totals.totalOvertimePay.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
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
            onChange={(e) => handleSearch(e.target.value)}
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

      {/* Export Button */}
      <button
        onClick={exportToCSV}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export to CSV
      </button>

      {/* Overtime Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime Hours
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime Days
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Overtime Pay
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((employee, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">
                      {employee.employeeId} • {employee.department}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getOvertimeBg(employee.totalOvertimeHours)}`}
                        style={{ width: `${Math.min((employee.totalOvertimeHours / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {employee.totalOvertimeHours.toFixed(1)}h
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getOvertimeBg(
                      employee.overtimeDays
                    )} ${getOvertimeColor(employee.overtimeDays)}`}
                  >
                    {employee.overtimeDays} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    ${employee.overtimeRate.toFixed(2)}/hr
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getOvertimeColor(employee.totalOvertimePay)}`}>
                    ${employee.totalOvertimePay.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department-wise Summary */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Overtime Summary</h3>
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
                  <span className="text-gray-600">Avg Overtime Hours:</span>
                  <span className={`font-medium ${getOvertimeColor(dept.averageOvertimeHours)}`}>
                    {dept.averageOvertimeHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Overtime Hours:</span>
                  <span className="font-medium text-green-600">{dept.totalOvertimeHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Overtime Pay:</span>
                  <span className="font-medium text-purple-600">${dept.totalOvertimePay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OvertimeCalculation;