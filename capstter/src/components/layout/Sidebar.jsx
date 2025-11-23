import { Home, ClipboardList, BarChart2, List, Package,ShoppingCart,PackageOpen,NotebookText   } from "lucide-react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const menuItems = [
  { label: "Point of Sales", icon: <ShoppingCart  size={18} /> },
  { label: "Item Registration", icon: <ClipboardList size={18} /> },
  { label: "Sales Analysis", icon: <BarChart2 size={18} /> },
  { label: "Sales Log", icon: <List size={18} /> },
  { label: "Inventory", icon: <Package size={18} /> },
  { label: "ProductList", icon: <PackageOpen  size={18} /> },
  { label: "orderList", icon: <NotebookText   size={18} /> },
  { label: "Stockout", icon: <PackageOpen  size={18} /> },
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedBusinessId');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Redirect to login page
  };
  return (
    
    <aside className="w-60 md:w-60 sm:w-20 bg-slate-900 text-white flex flex-col justify-between min-h-screen p-4 sm:p-2 transition-all duration-300">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Link to="/UserDashboard" className="flex items-center gap-2">
            <Home className="text-white" />
            <span className="text-lg font-bold hidden sm:block">Dashboard</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (

            <Link to={`/${item.label.replace(/\s+/g, '').toLowerCase()}`}>
            <button 
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition w-full"
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
            </Link>

            
          ))}
        </nav>
      </div>
      <div>
        <div className="flex gap-2 justify-center mb-4">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400"></div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 sm:px-4 sm:py-2 bg-red-600 rounded-lg hover:bg-red-700 transition justify-center"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}
