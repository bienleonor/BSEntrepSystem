// src/pages/UserDetails.jsx
import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import OverviewSection from "../components/dashboard/OverviewSection";
import { getToken, getUserId } from "../utils/token";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UserDetails() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birthdate: "",
    contact_no: "",
    
  });

  const token = getToken();
  const userId = getUserId();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const {
    first_name,
    middle_name,
    last_name,
    birthdate,
    contact_no
   
  } = formData;

  // 🔍 Required field check
  if (!first_name || !middle_name || !last_name || !birthdate || !contact_no) {
    toast.warn('⚠️ Please fill out all fields before submitting.');
    return;
  }

  // 📞 Phone number validation
  const contactRegex = /^\d{1,11}$/;
  if (!contactRegex.test(contact_no)) {
    toast.error('❌ Phone number must be numeric and up to 11 digits.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/insertUserDetailsController/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Error:", result.error);
      toast.error(`❌ Failed to save: ${result.error || 'Unknown error'}`);
    } else {
      toast.success("✅ User details saved successfully!");
    }
  } catch (error) {
    console.error("Submit error:", error);
    toast.error("❌ An error occurred while saving user details.");
  }
};



  return (
    <DashboardLayout>
       <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4 text-center text-white">User Details</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bronze p-4 rounded-md shadow-sm"
      >
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="form-input"
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              className="form-input"
              value={formData.middle_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Surname"
              className="form-input"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Birthdate */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
          <input
            type="date"
            name="birthdate"
            className="form-input w-full"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="contact_no"
            placeholder="09"
            className="form-input w-full"
            value={formData.contact_no}
            onChange={handleChange}
          />
        </div>

        {/* Type of User */}
        

        {/* Submit Button */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Save Details
          </button>
        </div>
      </form>

      <div className="mt-8">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
