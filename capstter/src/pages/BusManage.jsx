import { useState, useEffect } from "react";
import { useAuth } from "../hooks/UseAuth";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

import landingImage from "../assets/Landing.png";

export default function Busmanage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, login } = useAuth();    // <-- consistent with your new AuthContext

  useEffect(() => {
    if (!user) return;

    const fetchBusinesses = async () => {
      try {
        const response = await axiosInstance.get("/business/mybusinesses");

        setBusinesses(response.data || []);
      } catch (error) {
        console.error("Fetch business error:", error);
        toast.error("Failed to load your businesses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  const handleSelect = async (businessId, businessName) => {
    try {
      const res = await axiosInstance.post("/auth/selectbusiness", {
        businessId,
      });

      if (res.data?.token) {
        login(res.data.token); // <- refresh token with selected business

        toast.success(`Selected: ${businessName}`);

        setTimeout(() => navigate("/UserDashboard"), 1200);
      } else {
        toast.error("Failed to select business");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error selecting business");
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${landingImage})` }}
    >
      <ToastContainer />

      <div className="bg-bronze max-w-md bg-opacity-80 p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Select a Business to Manage
        </h2>

        {businesses.length > 0 ? (
          <ul className="space-y-2">
            {businesses.map((biz) => (
              <li
                key={biz.business_id}
                onClick={() =>
                  handleSelect(biz.business_id, biz.business_name)
                }
                className="p-3 rounded cursor-pointer bg-white hover:bg-blue-200 transition border text-center"
              >
                {biz.business_name}
              </li>
            ))}
          </ul>
        ) : (
          <Link to="/businessregistration">
            <p className="text-center text-blue-200 hover:underline">
              No businesses found. Register one here.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
