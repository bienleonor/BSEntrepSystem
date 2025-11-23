import { useState } from "react";
import NavBar from "../components/layout/NavBar";
import loginImage from "../assets/landing.png";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/UseAuth";
import axiosInstance from "../utils/axiosInstance";


const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value });

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/auth/login", form);

      // 1️⃣ Ensure token exists
      if (!data.token) {
        toast.error(data.error || "Login failed");
        return;
      }

      // 2️⃣ Save token & set auth context
      login(data.token);

      // 3️⃣ Save user info locally
      const user = data.user;
      const businesses = data.businesses || [];
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("businesses", JSON.stringify(businesses));
      localStorage.removeItem("selectedBusinessId");

      toast.success("✅ Login successful!");

      // 4️⃣ Decide next route based on scenarios

      // First-time login: user details not completed
      if (!user.user_details_completed) {
        return navigate("/userdetails");
      }

      // User has no role selected yet
      if (!user.role_selected) {
        return navigate("/chooserole");
      }

      // Business Owner flows
      if (user.role === "SuperAdmin"|| user.role === "user") {
        if (businesses.length === 0) {
          // Owner has no business yet → redirect to business registration
          return navigate("/businessregistration");
        } else if (businesses.length === 1) {
          // Owner has exactly one business → set and go to dashboard
          localStorage.setItem("selectedBusinessId", businesses[0].business_id);
          return navigate("/UserDashboard");
        } else {
          // Owner has multiple businesses → choose one
          return navigate("/busmanage");
        }
      }

      // Employee flows
      if (user.role === "employee") {
        if (businesses.length === 0) {
          // Employee not affiliated with a business → enter access code
          return navigate("/access-code");
        } else if (businesses.length === 1) {
          // Employee affiliated with exactly one business → set and dashboard
          localStorage.setItem("selectedBusinessId", businesses[0].business_id);
          return navigate("/UserDashboard");
        } else {
          // Employee affiliated with multiple businesses → choose one
          return navigate("/busmanage");
        }
      }

      // Fallback if role unknown
      toast.error("Unknown user role. Please contact admin.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Network error");
    }
  };

return (
  <>
    <NavBar />
    <ToastContainer position="top-center" autoClose={3000} />

    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center px-6"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      {/* Slightly left on large screens, centered on small screens */}
      <div className="bg-bronze p-8 rounded-2xl w-full max-w-md 
                      lg:-translate-x-70 md:-translate-x-16 sm:translate-x-0 transform transition-transform duration-300">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Login
          </h2>

          {/* Username */}
          <div>
            <label htmlFor="username" className="text-white">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="text-white">
              Password:
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="password"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />

            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl mt-3"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <Link to="/register">
          <p className="text-center text-white mt-5">
            Don’t have an account?{" "}
            <span className="underline cursor-pointer">Register</span>
          </p>
        </Link>
      </div>
    </div>
  </>
);
};



export default Login;
