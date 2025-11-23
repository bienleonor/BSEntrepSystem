import Sidebar from "./Sidebar";
import LoginNavbar from "./LoginNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-gradient-to-b from-slate-700 to-blue-200">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <LoginNavbar />
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-auto h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
