import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { getToken } from "../../utils/token";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BusinessSettings() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [accessCode, setAccessCode] = useState("");

  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  useEffect(() => {
    const businessId = localStorage.getItem("selectedBusinessId");
    if (!businessId) return;

    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/business/settings", {
          params: { businessId },
        });

        if (res.data?.settings) {
          const s = res.data.settings;
          setBusinessName(s.business_name || "");
          setBusinessType(s.business_cat_id || "");

          if (s.logo) {
            const base = axiosInstance.defaults.baseURL.replace("/api", "");
            const full = s.logo.startsWith("http")
              ? s.logo
              : `${base}${s.logo}`;
            setLogoPreview(full);
          }
        }
      } catch (err) {
        console.error("Failed to load business settings", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = getToken();
        const res = await axiosInstance.get("/business/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchAccessCode = async () => {
      try {
        const res = await axiosInstance.get("/business/access-code", {
          params: { businessId },
        });
        console.log("Access Code Response: ", res.data);

        setAccessCode(res.data?.code || "");
      } catch (err) {
        console.error("Failed to load access code", err);
      }
    };

    // Run all async functions
    fetchSettings();
    fetchCategories();
    fetchAccessCode();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const businessId = localStorage.getItem("selectedBusinessId");

    formData.append("businessId", businessId);
    formData.append("businessName", businessName);
    formData.append("businessType", businessType);
    if (logo) formData.append("logo", logo);

    try {
      const res = await axiosInstance.post("/business/settings", formData);
      toast.success("Business settings saved");

      if (res.data?.settings?.logo) {
        const base = axiosInstance.defaults.baseURL.replace("/api", "");
        const logoUrl = res.data.settings.logo.startsWith("http")
          ? res.data.settings.logo
          : `${base}${res.data.settings.logo}`;
        setLogoPreview(logoUrl);
      }

      setTimeout(() => navigate("/UserDashboard"), 700);
    } catch (error) {
      console.error("Failed to save business settings:", error);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-slate-300 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Business Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
            >
              <option value="">Select type</option>

              {loadingCategories ? (
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

          {/* Access Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Access Code</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 
                        text-gray-700 bg-gray-100 cursor-not-allowed"
              value={accessCode}
              readOnly
            />
            <p className="text-xs text-gray-600 mt-1">
              Share this code with employees to join your business.
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your Logo</label>

            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={handleLogoChange}
              />

              <label
                htmlFor="logo-upload"
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
              >
                {logo ? "Change Logo" : "Upload Logo"}
              </label>

              {logo && <span className="text-sm text-gray-600">{logo.name}</span>}
            </div>

            {logoPreview && (
              <div className="mt-3">
                <img
                  src={logoPreview}
                  alt="logo preview"
                  className="h-20 w-20 object-contain rounded-md"
                />
              </div>
            )}
          </div>

          <ToastContainer position="top-center" autoClose={3000} />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
