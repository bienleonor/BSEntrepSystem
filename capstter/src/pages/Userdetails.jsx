import { useState, useEffect } from "react";
import { getUserId } from "../utils/token";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import loginImage from "../assets/landing.png";
import "react-toastify/dist/ReactToastify.css";

export default function UserDetails() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birthdate: "",
    contact_no: "",
    section_id: "",
    group_id: "",
    year_id: "",
  });

  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [Years, setYears] = useState([]);

  const userId = getUserId();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Fetch sections, groups, and school years
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [sectionsRes, groupsRes, YearsRes] = await Promise.all([
          axiosInstance.get("/access-code/sections"),
          axiosInstance.get("/access-code/groups"),
          axiosInstance.get("/access-code/schoolyears"),
        ]);
        setSections(sectionsRes.data);
        setGroups(groupsRes.data);
        setYears(YearsRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("❌ Failed to load dropdown options.");
      }
    };
    fetchOptions();
  }, []);

  // Fetch existing user details if available
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get(`/user-details/${userId}`);
        if (res.data) {
          setFormData({
            first_name: res.data.first_name || "",
            middle_name: res.data.middle_name || "",
            last_name: res.data.last_name || "",
            birthdate: res.data.birthdate || "",
            contact_no: res.data.contact_no || "",
            section_id: res.data.section_id || "",
            group_id: res.data.group_id || "",
            year_id: res.data.year_id || "",
          });
        }
      } catch (err) {
        console.log("No existing user details found.");
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, middle_name, last_name, birthdate, contact_no, section_id, group_id, year_id } = formData;
    if (!first_name || !middle_name || !last_name || !birthdate || !contact_no || !section_id || !group_id || !year_id) {
      toast.warn("⚠️ Please fill out all fields before submitting.");
      return;
    }

    const contactRegex = /^\d{1,11}$/;
    if (!contactRegex.test(contact_no)) {
      toast.error("❌ Phone number must be numeric and up to 11 digits.");
      return;
    }

    try {
      await axiosInstance.post(`/users-details/insertUserDetailsController/${userId}`, formData);

      toast.success("✅ User details saved successfully!");

      // Update user object in local storage / auth context
      const updatedUser = { ...user, user_details_completed: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(localStorage.getItem("token")); // refresh context

      setTimeout(() => navigate("/chooserole"), 800);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        `❌ Failed to save: ${error.response?.data?.error || "Unknown error occurred"}`
      );
    }
  };

  return (
  <div
    className="bg-cover bg-center min-h-screen w-full flex flex-col items-center justify-center px-6"
    style={{ backgroundImage: `url(${loginImage})` }}
  >
    <ToastContainer position="top-center" autoClose={3000} />

    <h1 className="text-2xl font-bold mb-4 text-center text-white">
      User Details
    </h1>

    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bronze p-6 rounded-md shadow-lg max-w-3xl w-full"
    >
      {/* Full Name */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input type="text" name="first_name" placeholder="First Name" className="form-input" value={formData.first_name} onChange={handleChange} />
          <input type="text" name="middle_name" placeholder="Middle Name" className="form-input" value={formData.middle_name} onChange={handleChange} />
          <input type="text" name="last_name" placeholder="Surname" className="form-input" value={formData.last_name} onChange={handleChange} />
        </div>
      </div>

      {/* Birthdate */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
        <input type="date" name="birthdate" className="form-input w-full" value={formData.birthdate} onChange={handleChange} />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="text" name="contact_no" placeholder="09" className="form-input w-full" value={formData.contact_no} onChange={handleChange} />
      </div>

      {/* Section Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
        <select name="section_id" className="form-input w-full" value={formData.section_id} onChange={handleChange}>
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec.section_id} value={sec.section_id}>{sec.sec_name}</option>
          ))}
        </select>
      </div>

      {/* Group Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
        <select name="group_id" className="form-input w-full" value={formData.group_id} onChange={handleChange}>
          <option value="">Select Group</option>
          {groups.map((grp) => (
            <option key={grp.group_id} value={grp.group_id}>{grp.group_name}</option>
          ))}
        </select>
      </div>

      {/* School Year Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
        <select name="year_id" className="form-input w-full" value={formData.year_id} onChange={handleChange}>
          <option value="">Select School Year</option>
          {Years.map((sy) => (
            <option key={sy.year_id} value={sy.year_id}>{sy.school_year}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 text-center">
        <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition">
          Save Details & Continue
        </button>
      </div>
    </form>
  </div>
);

}
