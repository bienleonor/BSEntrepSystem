import { useEffect, useState } from "react";
import AxiosInstance from "../../utils/axiosInstance";
import { decodeToken } from "../../utils/token";

export default function SuperAdminLoginNavbar() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const decoded = decodeToken();
    if (decoded) {
      setUser({
        username: decoded.username,
        role: decoded.role,
      });
    }

    const fetchSettings = async () => {
      try {
        const res = await AxiosInstance.get("/business/settings");
        if (res.data.success) {
          setSettings(res.data.settings);

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

    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, []);

  return (
   <header className="flex flex-col sm:flex-row 
                   justify-center sm:justify-between 
                   items-center 
                   bg-slate-800 text-white 
                   px-3 sm:px-6 py-2 sm:py-4 
                   border-b-2 border-b-bronze/50 shadow-2xl">
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
      {settings && (
        <>
          <p className="text-xs sm:text-sm truncate">
            {settings.business_name}
          </p>
          <p className="italic text-[10px] sm:text-xs text-gray-300 truncate">
            {settings.name}
          </p>
        </>
      )}
    </div>
  </div>
</header>

  );
}
