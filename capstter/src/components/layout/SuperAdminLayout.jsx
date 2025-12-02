
import SuperAdminSidebar from "./SuperAdminSidebar"; // Assuming a dedicated, darker sidebar
import SuperAdminLoginNavbar from "./SuperAdminLoginNavbar"; // Reusing the existing navbar

export default function SuperAdminLayout({ children }) {
  return (
    // Dark, console-like background theme
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <SuperAdminSidebar />
      <main className="flex-1 flex flex-col">
        <SuperAdminLoginNavbar className="bg-gray-800 border-b border-gray-700" />
        {/* Padding for content area */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}