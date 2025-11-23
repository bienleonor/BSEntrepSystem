import { useState, useEffect } from "react";
import { getUserId, getToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BusinessSettings() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const userId = getUserId();

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  useEffect(() => {
    // fetch current settings for selected business
    const businessId = localStorage.getItem('selectedBusinessId');
    if (!businessId) return;
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/business/settings', { params: { businessId } });
        const data = res.data;
        if (data && data.settings) {
          setBusinessName(data.settings.business_name || '');
          setBusinessType(data.settings.business_cat_id || '');
          if (data.settings.logo) {
            const logoPath = data.settings.logo;
            const apiBase = axiosInstance.defaults.baseURL.replace('/api','');
            const full = logoPath.startsWith('http') ? logoPath : `${apiBase}${logoPath}`;
            setLogoPreview(full);
          }
        }
      } catch (err) {
        console.error('Failed to load business settings', err);
      }
    };

    fetchSettings();
    // fetch categories for dropdown (same logic as BusinessRegistration)
    const token = getToken();
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/business/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Unexpected categories response:', data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const businessId = localStorage.getItem('selectedBusinessId');
    formData.append("businessId", businessId);
    formData.append("businessName", businessName);
    formData.append("businessType", businessType);
    if (logo) formData.append("logo", logo);

    try {
      const res = await axiosInstance.post("/business/settings", formData);
      toast.success('Business settings saved');
      // if server returned new settings, update preview
      if (res.data?.settings?.logo) {
        const logoPath = res.data.settings.logo;
        const apiBase = axiosInstance.defaults.baseURL.replace('/api','');
        const full = logoPath.startsWith('http') ? logoPath : `${apiBase}${logoPath}`;
        setLogoPreview(full);
      }
      setTimeout(() => navigate("/UserDashboard"), 700);
    } catch (error) {
      console.error("Failed to save business settings:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-slate-300 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Business Settings</h1>
        <form onSubmit={handleSave} className="space-y-6">
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
                categories.map(cat => (
                  <option key={cat.business_cat_id} value={cat.business_cat_id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your Logo</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
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
                <img src={logoPreview} alt="logo preview" className="h-20 w-20 object-contain rounded-md" />
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
