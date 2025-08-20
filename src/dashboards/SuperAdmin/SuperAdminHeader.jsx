import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Search,
  User,
  Shield
} from "lucide-react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const SuperAdminHeader = ({ currentPage, onLogoClick }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const UserInfo = JSON.parse(sessionStorage.getItem("userdata")) || {};

  const HandleLogOut = async () => {
    try {
      await axios.post(`${apiBaseUrl}/admin/logout/`);
      sessionStorage.clear();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="header h-[50px] bg-white z-50 sticky top-0 left-0">
      <nav className="navbar flex justify-between items-center bg-white py-2 px-2 gap-6 border-b">
        {/* Left side logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div 
              onClick={onLogoClick}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex justify-between items-center sm:w-[100px] md:w-[200px] lg:w-[150px]">
                <strong className="leading-tight text-sm hidden md:block w-full">
                  Super Admin <br /> Dashboard
                </strong>
              </div>
            </div>
            
            {currentPage !== 'dashboard' && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>/</span>
                <span className="text-gray-800 capitalize">{currentPage.replace('-', ' ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex justify-end lg:justify-between w-full gap-4">
          {/* Search Bar */}
          <form className="bg-blue-50 px-4 rounded-md flex items-center">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              className="bg-blue-50 outline-none text-sm tracking-wider px-4"
            />
            <Search height={15} width={15} />
          </form>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="profile flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
            >
              <User height={30} width={30} />
              <div className="flex justify-between gap-4 items-center">
                <div className="flex-col leading-snug hidden md:flex">
                  <p className="text-sm font-bold capitalize">
                    {UserInfo?.username || "Super Admin"}
                  </p>
                  <p className="text-[10px] font-normal">Super Administrator</p>
                </div>
                <ChevronDown />
              </div>
            </button>

            {/* Dropdown content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
                <button
                  onClick={HandleLogOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-600 hover:text-white rounded-t-md flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminHeader;