import { useState } from "react";
import { getUserId } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const navigate = useNavigate();
  const userId = getUserId();

 
  return (
    <DashboardLayout>
      <div className=" bg-bronze shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Employee Management
          </h1>
          
        </div>

        

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-3 text-left">Id</th>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">Position</th>
                <th className="border px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No employees added yet.
                  </td>
                </tr>
              ) : (
                employees.map((emp, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border px-4 py-2">{emp.id}</td>
                    <td className="border px-4 py-2">{emp.name}</td>
                    <td className="border px-4 py-2">
                      {emp.position || "--no position--"}
                    </td>
                    <td className="border px-4 py-2 space-x-3">
                      <button className="text-blue-600 font-medium hover:underline">
                        EDIT
                      </button>
                      <button className="text-red-600 font-medium hover:underline">
                        REMOVE
                      </button>
                      <button className="text-gray-600 font-medium hover:underline">
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
