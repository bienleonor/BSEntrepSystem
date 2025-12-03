import { useState, useEffect } from "react";
import { Home, ClipboardList, BarChart2, List, Package, ShoppingCart, PackageOpen, NotebookText, Settings, UserRoundCog, Users, LogOut, Menu, X,Book,BookOpenText,Notebook  } from "lucide-react";
import { Link } from "react-router-dom";

// Base menu items available to everyone
const baseMenuItems = [
  // Sales Management
  { label: "Point of Sales", icon: <ShoppingCart  size={18} /> },
  { label: "Sales Analysis", icon: <BarChart2 size={18} /> },
  { label: "Sales Log", icon: <List size={18} /> },
  { label: "Order List", icon: <NotebookText   size={18} /> },
  
  // Inventory Management
  { label: "Product Registration", icon: <ClipboardList size={18} /> },
  { label: "Inventory", icon: <Package size={18} /> },
  { label: "Product List", icon: <PackageOpen  size={18} /> },
  { label: "Category", icon: <Book  size={18} /> },
  { label: "Multi Adjustment Stock", icon: <PackageOpen  size={18} /> },
  { label: "Stock Adjustment Report", icon: <BookOpenText   size={18} /> },
];

// Owner/Admin only menu items
const ownerOnlyMenuItems = [
  { label: "Employee Management", icon: <Users  size={18} /> },
  { label: "Business Position", icon: <UserRoundCog   size={18} /> },
  { label: "Business Logs", icon: <Notebook   size={18} /> },
  { label: "Business Setting", icon: <Settings   size={18} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if user is owner of current business or superadmin
    const checkOwnership = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const businesses = JSON.parse(localStorage.getItem("businesses") || "[]");
        const selectedBusinessId = localStorage.getItem("selectedBusinessId");

        // Superadmin can see everything
        const role = (user.role || user.system_role || "").toLowerCase();
        if (role === "superadmin") {
          setIsOwner(true);
          return;
        }

        // Check if user is owner of the selected business
        if (selectedBusinessId && businesses.length > 0) {
          const currentBusiness = businesses.find(
            (b) => String(b.business_id) === String(selectedBusinessId)
          );
          // is_owner comes from the backend query
          setIsOwner(currentBusiness?.is_owner === 1 || currentBusiness?.is_owner === true);
        }
      } catch (e) {
        console.error("Error checking ownership:", e);
        setIsOwner(false);
      }
    };

    checkOwnership();

    // Re-check when business selection changes
    window.addEventListener("storage", checkOwnership);
    return () => window.removeEventListener("storage", checkOwnership);
  }, []);

  // Build menu items based on ownership
  const menuItems = isOwner 
    ? [...baseMenuItems, ...ownerOnlyMenuItems]
    : baseMenuItems;

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
            <Link to="/UserDashboard" className="flex items-center gap-2">
              <Home className="text-white" />
              <span className="text-lg font-bold hidden sm:block">DHO</span>
            </Link>
          </div>
        </div>

        {/* MIDDLE (scrollable area) */}
        <div className="flex-1 overflow-y-auto px-4">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link key={item.label} to={`/${item.label.replace(/\s+/g, "").toLowerCase()}`}>
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
        </div>
      </aside>
    </>
  );
}
