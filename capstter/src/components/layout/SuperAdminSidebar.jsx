
import { useState } from "react";
import { Home, ClipboardList, BarChart2, List, Package, ShoppingCart, PackageOpen, NotebookText, Settings, UserRoundCog, Users, LogOut, Menu, X,Book } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_PREFIX = "/superadmin";

const menuItems = [
  // Sales Management

  
  // Inventory Management

  { label: "Audit Logs", icon: <NotebookText size={18} />, path: `${BASE_PREFIX}/auditlogs` },
   { label: "RBAC Management", icon: <NotebookText size={18} />, path: `${BASE_PREFIX}/rbac` },
  { label: "Business Management", icon: <Book size={18} />, path: `${BASE_PREFIX}/businessmanagement` },


];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedBusinessId");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-10 z-50 p-2  text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24}className="opacity-50" /> : <Menu size={24} className="opacity-50"/>}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen bg-slate-900 text-white 
          flex flex-col transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-60"}`}
      >

        {/* TOP (not scrollable) */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/superadmin/dashboard" className="flex items-center gap-2">
              <Home className="text-white" />
              <span className="text-lg font-bold hidden sm:block">Dashboard</span>
            </Link>
          </div>
        </div>

        {/* MIDDLE (scrollable area) */}
        <div className="flex-1 overflow-y-auto px-4">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path ?? `${BASE_PREFIX}/${item.label.replace(/\s+/g, "").toLowerCase()}`}
              >
                <button className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition w-full">
                  {item.icon}
                  <span className={`${isOpen ? "block" : "hidden sm:block"}`}>
                    {item.label}
                  </span>
                </button>
              </Link>
            ))}
          </nav>

          {/* Buttons included in scroll */}
          <div className="mt-6">
            

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition justify-center"
            >
              <LogOut size={20} />
              <span className={`${isOpen ? "block" : "hidden sm:block"}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
