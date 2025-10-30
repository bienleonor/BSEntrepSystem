import React, { useState } from 'react';
import NavBar from '../components/layout/NavBar';
import loginImage from '../assets/landing.png';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        toast.success('✅ Login successful!');
        setTimeout(() => navigate('/UserDetails'), 1500);
      } else {
        toast.error(data.error || '❌ Login failed');
      }
    } catch (err) {
      toast.error('❌ Network error');
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
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username:
              </label>
              <input
                placeholder="username"
                type="text"
                id="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password:
              </label>
              <input
                placeholder="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative bottom-4 left-2 text-white">
              <input type="checkbox" /> Remember me
            </div>

            <button
              type="submit"
              className="w-full bg-lightblue hover:bg-blue-700 text-white font-semibold py-2 px-4 
                         rounded-lg shadow-md transition duration-300 relative bottom-4"
            >
              Login
            </button>
          </form>

          <Link to="/register">
            <span className="block text-center text-white mt-2">
              Don't have an account? <a className="text-white-600 mx-2">Register</a>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
