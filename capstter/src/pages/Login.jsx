import React, { useState } from 'react';
import NavBar from '../components/layout/NavBar';
import loginImage from '../assets/landing.png';
import { EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/UserDetails'); // Change to your desired route
        console.log('Stored role:', getRole());
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <>
      <NavBar />
      <div
        className="bg-cover bg-center h-screen w-full flex justify-left items-center px-6"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="bg-bronze p-8 rounded-2xl w-full max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
            {error && <div className="text-red-500">{error}</div>}
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password:
              </label>
              <input
                placeholder="password"
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <EyeOff className="relative bottom-8 left-70" />
            </div>
            <div className="relative bottom-10 left-2 text-white">
              <input type="checkbox" /> Remember me
            </div>
            <button
              type="submit"
              className="w-full bg-lightblue hover:bg-blue-700 text-white font-semibold py-2 px-4 
                         rounded-lg shadow-md transition duration-300 relative bottom-8"
            >
              Login
            </button>
          </form>
          <Link to="/register">
            <span className="block text-center text-white  mt-2 ">Don't have an account?
              <a className="text-white-600 mx-2">Register</a></span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;