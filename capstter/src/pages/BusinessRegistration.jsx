import React, { useState, useEffect } from 'react';
import loginImage from '../assets/landing.png';
import { getToken } from '../utils/token';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function BusinessRegistration() {
  const [businessName, setBusinessName] = useState('');
  const [businessCatId, setBusinessCatId] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
 useEffect(() => {
  const token = getToken();

  fetch('http://localhost:5000/api/business/categories', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error('Unexpected response format:', data);
        setCategories([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load categories:', err);
      setCategories([]);
      setLoading(false);
    });
}, []);


  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = getToken();
  if (!token) {
    toast.error('❌ You must be logged in to register a business.');
    return;
  }

  const payload = {
    business_name: businessName,
    business_cat_id: businessCatId,
    
  };

  try {
    const res = await fetch('http://localhost:5000/api/business/registerbusiness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      toast.success(`✅ Registered! Business ID: ${result.business_id}`);
      setBusinessName('');
      setBusinessCatId('');
    } else {
      toast.error(`❌ ${result.error}`);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    toast.error('❌ Internal server error.');
  }
};



  return (
  <>
    <ToastContainer position="top-center" autoClose={3000} />

    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center px-6"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="bg-bronze p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-5xl font-bold mb-6 text-center text-white">Business Registration</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-white">
              What is your Business Name?
            </label>
            <input
              placeholder="Business Name"
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="BusinessCategory" className="block text-sm font-medium text-white">
              Business Category:
            </label>
            <select
              id="BusinessCategory"
              value={businessCatId}
              onChange={(e) => setBusinessCatId(e.target.value)}
              className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a category</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.business_cat_id} value={cat.business_cat_id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Register
          </button>

          {message && (
            <p className="mt-4 text-center text-white font-semibold">{message}</p>
          )}
        </form>
      </div>
    </div>
  </>
);

}
