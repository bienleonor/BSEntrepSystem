import Sidebar from "./Sidebar";
import LoginNavbar from "./LoginNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-800 to-blue-200">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <LoginNavbar />
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
