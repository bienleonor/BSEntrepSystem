export default function LoginNavbar() {
  return (
    <header className="flex justify-between items-center bg-slate-800 text-white px-6 py-4 border-b-2  border-b-bronze/50 shadow-2xl ">
      {/* Search */}
      <div className="flex items-center gap-4 w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-lg bg-slate-700 text-sm focus:outline-none"
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="bg-gray-600 rounded-full w-9 h-9"></div>
        <div>
          <p className="font-bold text-sm">NAME PLACEHOLDER</p>
          <p className="text-xs text-gray-300">Admin</p>
        </div>
      </div>
    </header>
  );
}
