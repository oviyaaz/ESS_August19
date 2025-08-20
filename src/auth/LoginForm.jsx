import { useState } from "react";
import { Eye, EyeOff, Lock, User, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";


const apiBaseUrl = import.meta.env.VITE_BASE_API;

export default function LoginForm() {
  const router = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchDetails = async (loginUser) => {
    try {
      const res = await fetch(`${apiBaseUrl}/user/details/`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("API Base URL:", import.meta.env.VITE_BASE_API);

      if (loginUser.designation?.toLowerCase() === "superadmin") {
        const superadmin = data.superadmins?.find(
          (u) => u.user_id === loginUser.user_id,
        );
        if (superadmin) return superadmin;

        return {
          user_id: loginUser.user_id,
          username: loginUser.user_id,
          designation: loginUser.designation,
          role: "superadmin",
        };
      }

      return (
        data.admins.find((u) => u.user_id === loginUser.user_id) ||
        data.managers.find((u) => u.manager_id === loginUser.user_id) ||
        data.hrs.find((u) => u.user_id === loginUser.user_id) ||
        data.employees.find((u) => u.user_id === loginUser.user_id) ||
        data.supervisors.find((u) => u.user_id === loginUser.user_id)
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details. Please try again later.");
      return null;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      username: data.username,
      user_id: data.user_id,
      password: data.password,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/user/common_login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");

      const loginUser = await res.json();
      console.log("Login response:", loginUser);

      if (loginUser && loginUser.designation) {
        sessionStorage.setItem("loginUser", JSON.stringify(loginUser));
        const user = await fetchDetails(loginUser);

        if (user) {
          sessionStorage.setItem("userdata", JSON.stringify(user));

          const routes = {
            admin: "/admin",
            superadmin: "/superadmin",
            manager: "/manager",
            user: "/user",
            officer: "/officer",
          };

          const roleKey = loginUser.role?.toLowerCase();
          const designationKey = loginUser.designation
            ?.toLowerCase()
            .replace(/\s+/g, "");
          const route = routes[roleKey] || routes[designationKey];

          if (route) {
            router(route);
            toast.success(`Welcome Back ${data.username} 👋`);
          } else {
            toast.error("Role not recognized. Please contact support.");
          }
        } else {
          throw new Error("Invalid credentials or no role");
        }
      } else {
        throw new Error("Invalid credentials or no designation");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex overflow-clip min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-[#ffd54f]" />
            <p className="mt-2 text-sm font-medium">Authenticating...</p>
          </div>
        </div>
      )}

      <div className="h-full w-full overflow-hidden">
        <div className="h-full grid grid-cols-2 lg:grid-cols-3">
          {/* Form Section */}
          <div className="p-10 h-screen col-span-2 lg:col-span-1 bg-gradient-to-l from-amber-200 to-blue-200">
            <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#e0e0e0] text-lg font-semibold text-gray-800 mb-12">
              ESS
            </div>

            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-8">Sign in to your employee account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* User ID */}
              <div className="space-y-2">
                <label htmlFor="user_id" className="text-gray-500 text-sm">
                  User ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="user_id"
                    className="pl-10 h-12 rounded-xl border w-full bg-white focus:border-amber-400 focus:ring-amber-400 transition-all"
                    placeholder="Enter your user ID"
                    {...register("user_id", { required: true })}
                  />
                </div>
                {errors.user_id && (
                  <p className="text-sm text-red-500">User ID is required</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-gray-500 text-sm">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    className="pl-10 h-12 rounded-xl border w-full bg-[#fff] focus:border-amber-400 focus:ring-amber-400 transition-all"
                    placeholder="Enter your username"
                    {...register("username", { required: true })}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">Username is required</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-500 text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 h-12 rounded-xl border w-full bg-[#fff] focus:border-amber-400 focus:ring-amber-400 transition-all"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">Password is required</p>
                )}
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#ffd54f] hover:bg-[#ffca28] text-gray-900 font-semibold"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="hidden lg:block relative bg-[#2c2c2c] md:col-span-2 overflow-hidden">
            <ImageSlider />
          </div>
        </div>
      </div>
    </div>
  );
}

const ImageSlider = () => {
  return (
    <div className="text-white">
      <Swiper loop={true} autoplay={{ delay: 1000, disableOnInteraction: false }}>
        {[
          "/BannerImages/banner1.jpg",
          "/BannerImages/banner2.jpg",
          "/BannerImages/banner3.jpg",
          "/BannerImages/banner4.jpg",
        ].map((image, index) => (
          <SwiperSlide key={index}>
            <div className="h-screen relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-amber-200/30 to-amber-50/10"></div>
              <img
                src={image}
                alt={image}
                loading="lazy"
                className="max-w-full h-full object-cover object-center bg-gradient-to-b from-amber-200 to-amber-50 "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
