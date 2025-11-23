//BusinessRegistration.jsx
import React, { useState, useEffect } from 'react';
import loginImage from '../assets/landing.png';
import { getToken } from '../utils/token';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function BusinessRegistration() {
  const [businessName, setBusinessName] = useState('');
  const [businessCatId, setBusinessCatId] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories with Axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const { data } = await axiosInstance.get('/business/categories');

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        toast.error('❌ Failed to load business categories.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) return toast.error("❌ You must be logged in to register a business.");

    try {
      // 1️⃣ REGISTER BUSINESS
      const registerRes = await axiosInstance.post(
        "/business/registerbusiness",
        { business_name: businessName, business_cat_id: businessCatId }
      );

      const businessId = registerRes.data.business_id;
      toast.success(`✅ Registered! Business ID: ${businessId}`);

      // Save Business
      localStorage.setItem("selectedBusinessId", businessId);

      // 2️⃣ GET USER ID FROM TOKEN
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const userId = tokenData.user_id;

      // 3️⃣ FETCH USER DETAILS PROPERLY
      const userDetailsRes = await axiosInstance.get(`/users-details/${userId}`);
      
      if (!userDetailsRes.data) {
        toast.error("❌ No user details found! Cannot generate access code.");
        return;
      }

      const {
        year_id,
        section_id,
        group_id
      } = userDetailsRes.data;

      console.log("USER DETAILS FOR ACCESS CODE:", { year_id, section_id, group_id });

      // 4️⃣ VALIDATE USER DETAILS FIELDS
      if (!year_id || !section_id || !group_id) {
        console.log("Missing:", { year_id, section_id, group_id });
        toast.error("❌ Missing: year, section, or group. Update your profile first.");
        return;
      }

      // 5️⃣ GENERATE ACCESS CODE
      const accessCodeRes = await axiosInstance.post("/access-code/generate", {
        business_id: businessId,
        year_id,
        section_id,
        group_id
      });

      toast.success(`🔑 Access code generated: ${accessCodeRes.data.code}`);

      // Reset form + redirect
      setBusinessName("");
      setBusinessCatId("");
      navigate("/UserDashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("❌ Failed to register business or generate access code.");
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
          <h2 className="text-5xl font-bold mb-6 text-center text-white">
            Business Registration
          </h2>
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
                  categories.map((cat) => (
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

            {message && <p className="mt-4 text-center text-white font-semibold">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
