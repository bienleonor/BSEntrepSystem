import React, { useState } from 'react';
import NavBar from '../components/layout/NavBar';
import loginImage from '../assets/landing.png';
import { EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const { username, email, password } = form;

  // 🛡️ Required field check
  if (!username || !email || !password) {
    toast.error('❌ All fields are required');
    return;
  }

  // 🚫 Restrict special characters in username and email
  const textRegex = /^[a-zA-Z0-9_.@]+$/;
  if (!textRegex.test(username)) {
    toast.error('❌ Username contains invalid characters');
    return;
  }
  if (!textRegex.test(email)) {
    toast.error('❌ Email contains invalid characters');
    return;
  }

  // 🔐 Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    toast.error(
      '❌ Password must be at least 8 characters long and include lowercase, uppercase, number, and special character'
    );
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('✅ Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      toast.error(data.error || '❌ Registration failed');
    }
  } catch (err) {
    toast.error('❌ Network error');
  }
};



  return (
   <>
  <NavBar />
  <ToastContainer position="top-center" autoClose={3000} />
  <div className="min-h-screen w-full bg-cover bg-center flex justify-center items-center px-4 sm:px-6 md:px-10 lg:px-20 py-10"
       style={{ backgroundImage: `url(${loginImage})` }}>
    <div className="bg-bronze p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-5xl font-bold mb-6 text-center text-white">REGISTER</h2>

        {/* You can remove these now */}
        {/* {error && <div className="text-red-500">{error}</div>} */}
        {/* {success && <div className="text-green-500">{success}</div>} */}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white">Username:</label>
          <input
            placeholder="username"
            type="text"
            id="username"
            value={form.username}
            onChange={handleChange}
            className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email address:</label>
          <input
            placeholder="email"
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white">Password:</label>
          <input
            placeholder="password"
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-lightblue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Register
        </button>
      </form>

      <Link to="/login">
        <span className="block text-center text-white-600 mt-2">
          <p className="text-center">already have an account?</p>Login
        </span>
      </Link>
    </div>
  </div>
</>

  );
}

export default Register;