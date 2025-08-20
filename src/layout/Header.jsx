import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ess_logo from "../assets/Images/ess_logo.png";
import { ChevronDown, Search, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const baseApi = import.meta.env.VITE_BASE_API;
const UserInfo = JSON.parse(sessionStorage.getItem("userdata"));

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

 const HandleLogOut = async () => {
    const res = await axios.post(`${baseApi}/admin/logout/`);
    localStorage.clear();
    toast("Logout so easy !!");
    navigate("/login");
  };

  return (
    <div className="header h-[50px] bg-white z-50 sticky top-0 left-0">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center bg-white py-2 px-2 gap-6 border-b">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={ess_logo} alt="Ess Logo" width={25} height={25} />
            <strong className="leading-tight text-sm hidden md:block">
              Employee <br /> Self Services
            </strong>
          </Link>
        </div>

        {/* Search + Profile */}
        <div className="flex justify-end lg:justify-between w-full relative">
          <form className="bg-blue-50 px-4 rounded-md flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-blue-50 outline-none text-sm tracking-wider px-4"
            />
            <Search height={15} width={15} />
          </form>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="profile flex items-center gap-2 p-1 rounded-full"
            >
              <User height={30} width={30} />
              <div className="hidden md:flex flex-col leading-snug">
                <p className="text-sm font-bold capitalize">
                  {UserInfo?.username || "Unknown"}
                </p>
                <p className="text-[10px] font-normal">Dashboard</p>
              </div>
              <ChevronDown />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white"
                  onClick={HandleLogOut}
                >
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

export default Header;
