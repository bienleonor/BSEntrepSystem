import { useEffect, useState } from "react";
import AxiosInstance from "../../utils/axiosInstance";
import { decodeToken } from "../../utils/token";

export default function LoginNavbar() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const decoded = decodeToken();
    if (decoded) {
      setUser({
        username: decoded.username,
        role: decoded.role,
      });
    }

    // Get business name from localStorage businesses array using selectedBusinessId
    const selectedBusinessId = localStorage.getItem("selectedBusinessId");
    const businesses = JSON.parse(localStorage.getItem("businesses") || "[]");
    
    if (selectedBusinessId && businesses.length > 0) {
      const currentBusiness = businesses.find(
        (b) => String(b.business_id) === String(selectedBusinessId)
      );
      if (currentBusiness) {
        setBusinessName(currentBusiness.business_name);
        // Set user position - could be 'Owner' or the position_name from business
        if (currentBusiness.is_owner === 1 || currentBusiness.is_owner === true) {
          setUserPosition("Owner");
        } else if (currentBusiness.position_name) {
          setUserPosition(currentBusiness.position_name);
        }
      }
    }

    const fetchSettings = async () => {
      try {
        const res = await AxiosInstance.get("/business/settings");
        if (res.data.success) {
          setSettings(res.data.settings);
          
          // Use settings business_name as fallback if not already set from localStorage
          if (res.data.settings?.business_name) {
            setBusinessName(prev => prev || res.data.settings.business_name);
          }

          if (res.data.settings?.business_id) {
            const logoRes = await AxiosInstance.get(
              `/business/${res.data.settings.business_id}/logo`,
              { responseType: "blob" }
            );
            const url = URL.createObjectURL(logoRes.data);
            setLogoUrl(url);
          }
        }
      } catch (err) {
        console.error("Failed to fetch business settings:", err);
      }
    };

    fetchSettings();

    // Cleanup function for logo URL
    return () => {
      setLogoUrl(prevUrl => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
    };
  }, []);

  return (
   <header className="flex flex-col sm:flex-row 
                   justify-center sm:justify-between 
                   items-center 
                   bg-slate-800 text-white 
                   px-3 sm:px-6 py-2 sm:py-4 
                   border-b-2 border-b-bronze/50 shadow-2xl">
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold">DHO - Business Dashboard </h1>
                    </div>
  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
    {logoUrl ? (
      <img
        src={logoUrl}
        alt="Business Logo"
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
      />
    ) : (
      <div className="bg-gray-600 rounded-full w-8 h-8 sm:w-10 sm:h-10"></div>
    )}

    <div className="flex flex-col min-w-0 text-center sm:text-left">
      <p className="font-bold text-xs sm:text-sm truncate">
        {user ? user.username : "Loading..."}
      </p>
      {(settings || businessName) && (
        <>
          <p className="text-xs sm:text-sm truncate">
            {businessName || settings?.business_name || "No Business"}
          </p>
          {userPosition && (
            <p className="italic text-[10px] sm:text-xs text-gray-300 truncate">
              {userPosition}
            </p>
          )}
        </>
      )}
    </div>
  </div>
</header>

  );
}
