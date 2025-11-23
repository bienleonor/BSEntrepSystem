import { useState } from "react";
import NavBar from "../components/layout/NavBar";
import loginImage from "../assets/landing.png";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
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

      if (!data.token) {
        toast.error(data.error || "Login failed");
        return;
      }

      // Save token
      login(data.token);

      // Save user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // Save businesses for selection
      localStorage.setItem("businesses", JSON.stringify(data.businesses));

      // IMPORTANT: clear previous selected business
      localStorage.removeItem("selectedBusinessId");

      // Auto-select business if only one exists
      if (data.businesses.length === 1) {
        const onlyBiz = data.businesses[0].business_id;
        localStorage.setItem("selectedBusinessId", onlyBiz);

        toast.success("Login successful!");
        return setTimeout(() => navigate("/UserDashboard"), 1000);
      }

      // Otherwise send to business selector page
      toast.success("Login successful!");
      setTimeout(() => navigate("/busmanage"), 1000);
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
      className="h-screen w-full bg-cover bg-center flex items-center justify-start px-4"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      {/* pushes the login box to about 15% from the left */}
      <div className="ml-[40%] backdrop-blur-md bg-bronze p-10 rounded-2xl shadow-xl w-full max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Login
          </h2>

          <div>
            <label htmlFor="username" className="text-white font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg bg-white/90 border focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-white font-medium">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg bg-white/90 border focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl mt-3"
          >
            Login
          </button>
        </form>

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
