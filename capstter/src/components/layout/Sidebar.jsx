import { useState } from "react";
import { Home, ClipboardList, BarChart2, List, Package, ShoppingCart, PackageOpen, NotebookText, Settings, UserRoundCog, Users, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Point of Sales", icon: <ShoppingCart size={20} /> },
  { label: "Sales Analysis", icon: <BarChart2 size={20} /> },
  { label: "Sales Log", icon: <List size={20} /> },
  { label: "Order List", icon: <NotebookText size={20} /> },
  { label: "Product Registration", icon: <ClipboardList size={20} /> },
  { label: "Inventory", icon: <Package size={20} /> },
  { label: "Product List", icon: <PackageOpen size={20} /> },
  { label: "Stockout", icon: <PackageOpen size={20} /> },
  { label: "Employee Management", icon: <Users size={20} /> },
  { label: "Business Position", icon: <UserRoundCog size={20} /> },
  { label: "Business Setting", icon: <Settings size={20} /> },
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
          className={`fixed md:static top-0 left-0 h-full md:h-screen bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-60"} overflow-y-auto`}
        >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/UserDashboard" className="flex items-center gap-2">
              <Home className="text-white" />
              <span className="text-lg font-bold hidden sm:block">Dashboard</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 overflow-auto">
           {menuItems.map((item) => (
              <Link key={item.label} to={`/${item.label.replace(/\s+/g, "").toLowerCase()}`}>
                <button className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition w-full">
                  {item.icon}
                  {/* Show text if sidebar is open OR if screen is sm+ */}
                  <span className={`${isOpen ? "block" : "hidden sm:block"}`}>
                    {item.label}
                  </span>
                </button>
              </Link>
            ))}

          </nav>
        </div>

        <div className="p-4">
          <Link to="/busmanage">
            <button className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition justify-center mb-2">
              <span className={`${isOpen ? "block" : "hidden sm:block"}`}>
                Manage other business
              </span>
            </button>
          </Link>

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

      </aside>
    </>
  );
}
