import { Link } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { EyeOff } from "lucide-react"; // Lucide icon
import { ToastContainer } from "react-toastify";

export default function Unauthorized() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-100 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center px-6 py-12">
          <EyeOff className="h-24 w-24 text-gray-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">NOT AUTHORIZED.</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is not publicly available.<br />
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            RETURN HOME
          </Link>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
