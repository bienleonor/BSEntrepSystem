import { useState, useEffect } from "react";
import { getToken, getUserId, getRole } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import landingImage from '../../assets/landing.png';

function Busmanage() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(localStorage.getItem("selectedBusinessId") || "");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBusinesses = async () => {
      const token = getToken();
      const userId = getUserId();
      const role = getRole();
      
      if (!token || !userId) {
        toast.error("Missing or invalid token.");
        return;
      }

      try {
        const response = await axiosInstance.get("/business/mybusinesses");
        setBusinesses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast.error("Failed to load your businesses.");
      }
    };

    fetchBusinesses();
  }, []);

  const handleSelect = (businessId, businessName) => {
    setSelectedBusinessId(businessId);
    localStorage.setItem("selectedBusinessId", businessId);

    toast.success(`Selected: ${businessName}`);

    setTimeout(() => navigate("/UserDashboard"), 1200);
  };


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${landingImage})` }}
    >
      <ToastContainer />
      <div className="bg-bronze  max-w-md bg-opacity-80 p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center text-white">Select a Business to Manage</h2>
        {businesses.length > 0 ? (
          <ul className="space-y-2">
            {businesses.map((biz) => (
              <li
                key={biz.business_id}
                className={`p-3 rounded cursor-pointer border ${
                  selectedBusinessId === biz.business_id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-100"
                }`}
                onClick={() => handleSelect(biz.business_id, biz.business_name)}
              >
                {biz.business_name}
              </li>
            ))}
          </ul>
        ) : (
          <Link to="/businessregistration">
              <p className="text-center text-blue-600 hover:underline">No businesses found. Register one here.</p>
         </Link>

        )}
      </div>
    </div>
  );
}

export default Busmanage;
