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

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/auth/login", form);

      if (!data.token) {
        toast.error(data.error || "Login failed");
        return;
      }

      // Save token via context
      login(data.token);

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
        className="bg-cover bg-center h-screen w-full flex justify-left items-center px-6"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="bg-bronze p-8 rounded-2xl w-full max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

            <div>
              <label htmlFor="username" className="text-white">Username:</label>
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

            <div className="relative">
              <label htmlFor="password" className="text-white">Password:</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="password"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-lightblue text-white py-2 rounded-lg mt-4"
            >
              Login
            </button>
          </form>

          <Link to="/register">
            <p className="text-center text-white mt-3">
              Don't have an account? <span className="underline cursor-pointer">Register</span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
