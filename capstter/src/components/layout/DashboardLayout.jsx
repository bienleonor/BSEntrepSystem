import Sidebar from "./Sidebar";
import LoginNavbar from "./LoginNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <LoginNavbar />
        <div className="p-6 bg-slate-100 flex-1">{children}</div>
      </main>
    </div>
  );
}
