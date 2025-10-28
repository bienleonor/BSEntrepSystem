import DashboardLayout from "../components/layout/DashboardLayout";
import OverviewSection from "../components/dashboard/OverviewSection";

export default function UserDetails() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">User Details</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-md shadow-sm">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" placeholder="First Name" className="form-input" />
            <input type="text" placeholder="Middle Name" className="form-input" />
            <input type="text" placeholder="Surname" className="form-input" />
          </div>
        </div>

        {/* Birthdate */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
          <input type="date" className="form-input w-full" />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" placeholder="09" className="form-input w-full" />
        </div>

        {/* Type of User */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type of User</label>
          <select className="form-input w-full">
            <option value="">Select Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Save Details
          </button>
        </div>
      </form>

      <div className="mt-8">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
