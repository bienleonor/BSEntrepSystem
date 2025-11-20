import { Home, FilePlus, ClipboardList, BarChart2, List, Package,ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const menuItems = [
  { label: "PointofSales", icon: <ShoppingCart  size={18} /> },
  { label: "Item Registration", icon: <ClipboardList size={18} /> },
  { label: "Sales Analysis", icon: <BarChart2 size={18} /> },
  { label: "Sales Log", icon: <List size={18} /> },
  { label: "Inventory", icon: <Package size={18} /> },
  { label: "ProductList", icon: <Package size={18} /> },
  
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedBusinessId');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Redirect to login page
  };
  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col justify-between min-h-screen p-4">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Link to="/UserDashboard">
            <Home className="text-white" />
            <span className="text-lg font-bold">Dashboard</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (

            <Link to={`/${item.label.replace(/\s+/g, '').toLowerCase()}`}>
            <button 
              key={item.label}
              className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
            </Link>

            
          ))}
        </nav>
      </div>
      <div>
        <div className="flex gap-2 justify-center mb-4">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition justify-center"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
