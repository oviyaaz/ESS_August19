import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Briefcase, 
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  FileText,
  TrendingUp,
  UserPlus
} from 'lucide-react';

// Mock data for employees
const initialEmployees = [
  {
    id: 1,
    employeeId: 'EMP001',
    name: 'Alice Brown',
    position: 'Software Developer',
    department: 'Engineering',
    salary: '$75,000',
    status: 'Active',
    joinDate: '2024-01-10',
    manager: 'John Doe',
    email: 'alice.brown@company.com',
    phone: '+1 234-567-8910'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    name: 'Bob Wilson',
    position: 'Product Manager',
    department: 'Product',
    salary: '$90,000',
    status: 'Active',
    joinDate: '2024-02-15',
    manager: 'Jane Smith',
    email: 'bob.wilson@company.com',
    phone: '+1 234-567-8911'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    name: 'Carol Davis',
    position: 'UX Designer',
    department: 'Design',
    salary: '$70,000',
    status: 'On Leave',
    joinDate: '2024-03-20',
    manager: 'Mike Johnson',
    email: 'carol.davis@company.com',
    phone: '+1 234-567-8912'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    name: 'David Chen',
    position: 'Marketing Specialist',
    department: 'Marketing',
    salary: '$65,000',
    status: 'Active',
    joinDate: '2024-01-25',
    manager: 'Sarah Lee',
    email: 'david.chen@company.com',
    phone: '+1 234-567-8913'
  }
];

const HRMSScreen = ({ onBack }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTab, setSelectedTab] = useState('employees');

  // Get unique departments for filter
  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewEmployee = (employeeId) => {
    console.log('View employee:', employeeId);
    // Implement view functionality
  };

  const handleEditEmployee = (employeeId) => {
    console.log('Edit employee:', employeeId);
    // Implement edit functionality
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  const departmentCount = departments.length;

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'employees':
        return (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees by name, ID, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 w-4 h-4" />
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.employeeId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : employee.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {employee.position}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      {employee.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {employee.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Manager: {employee.manager}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewEmployee(employee.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                        title="Edit Employee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
                    <div className="text-sm text-gray-500">Total Employees</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{activeEmployees}</div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{onLeaveEmployees}</div>
                    <div className="text-sm text-gray-500">On Leave</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{departmentCount}</div>
                    <div className="text-sm text-gray-500">Departments</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h3>
              <div className="space-y-4">
                {departments.map(dept => {
                  const deptEmployees = employees.filter(emp => emp.department === dept).length;
                  const percentage = ((deptEmployees / totalEmployees) * 100).toFixed(1);
                  return (
                    <div key={dept} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{dept}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Human Resource Management System
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('employees')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Employees
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HRMSScreen;