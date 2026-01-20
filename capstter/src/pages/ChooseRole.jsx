import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import landing from "../assets/landing.png";

export default function ChooseRole() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (role) => {
    if (role === "owner") {
      navigate("/businessregistration");
    } else if (role === "employee") {
      navigate("/accesscode");
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center px-6"
      style={{ backgroundImage: `url(${landing})` }}
    >
      <div className="bg-white shadow-xl p-10 rounded-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Choose your role</h1>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Select how you will join the system.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelect("owner")}
            className="btn btn-primary btn-lg w-full"
          >
            I am a Business Owner
          </button>

          <button
            onClick={() => handleSelect("employee")}
            className="btn btn-outline btn-lg w-full"
          >
            I am an Employee
          </button>
        </div>
      </div>
    </div>
  );
}
