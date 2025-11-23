import { useEffect, useState } from "react";
import { getUserId, getRole, decodeToken } from "../../utils/token";

export default function LoginNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decoded = decodeToken();
    if (decoded) {
      setUser({
        username: decoded.username, // must exist in token payload
        role: decoded.role,
      });
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-slate-800 text-white px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-b-bronze/50 shadow-2xl">
      {/* Search */}
      <div className="flex items-center gap-2 sm:gap-4 w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-700 text-sm sm:text-base focus:outline-none"
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-gray-600 rounded-full w-8 h-8 sm:w-9 sm:h-9"></div>
        <div className="text-xs sm:text-sm">
          <p className="font-bold">{user ? user.username : "Loading..."}</p>
          <p className="text-gray-300">{user ? user.role : "Admin"}</p>
        </div>
      </div>
    </header>
  );
}
