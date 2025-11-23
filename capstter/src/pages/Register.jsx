import { useState } from "react";
import NavBar from "../components/layout/NavBar";
import loginImage from "../assets/landing.png";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = form;

    // Required fields
    if (!username || !email || !password) {
      toast.error("❌ All fields are required");
      return;
    }

    // No special chars allowed
    const textRegex = /^[a-zA-Z0-9_.@]+$/;
    if (!textRegex.test(username)) {
      toast.error("❌ Username contains invalid characters");
      return;
    }
    if (!textRegex.test(email)) {
      toast.error("❌ Email contains invalid characters");
      return;
    }

    // Password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "❌ Password must be 8+ chars and include lowercase, uppercase, number, and special character"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("✅ Registration successful!");

      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      toast.error("❌ Network error");
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className="min-h-screen w-full bg-cover bg-center flex justify-center items-center px-4 sm:px-6 md:px-10 py-10"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
     <div className="bg-bronze p-8 rounded-2xl w-full max-w-md 
                      lg:-translate-x-70 md:-translate-x-16 sm:translate-x-0 transform transition-transform duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Register
            </h2>

            <div>
              <label className="text-sm text-white">Username:</label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                required
                className="bg-white mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm text-white">Email:</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email"
                required
                className="bg-white mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm text-white">Password:</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="password"
                required
                className="bg-white mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-lightblue text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Register
            </button>

          </form>

          <Link to="/login">
            <p className="text-center text-white mt-3">
              Already have an account? <span className="underline">Login</span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
