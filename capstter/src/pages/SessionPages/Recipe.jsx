import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { Popup } from "../../components/common/Popup";

export default function Recipes() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        🧾 Recipes
      </h1>

      <div className="mb-10 flex flex-row gap-8">
        <div className="flex justify-center">
          <div onClick={openPopup} className="cursor-pointer">
            <div className="w-64 h-auto bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Binangkal</h2>
              <img
                src="https://www.kawalingpinoy.com/wp-content/uploads/2021/06/binangkal-recipe-500x500.jpg"
                alt="Binangkal"
                className="w-full h-16 object-cover mb-4 rounded"
              />
              <p className="text-gray-600">
                A popular Filipino snack made from deep-fried dough balls coated with sesame seeds.
              </p>
            </div>
          </div>
        </div>

        {/* Optional second card */}
        <div className="flex justify-center">
          <a href="#">
            <div className="w-64 h-auto bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Binangkal</h2>
              <img
                src="https://www.kawalingpinoy.com/wp-content/uploads/2021/06/binangkal-recipe-500x500.jpg"
                alt="Binangkal"
                className="w-full h-16 object-cover mb-4 rounded"
              />
              <p className="text-gray-600">
                A popular Filipino snack made from deep-fried dough balls coated with sesame seeds.
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup} title="Binangkal Recipe">
        <p>This is a delicious sesame-coated dough ball snack from the Philippines!</p>
      </Popup>

      <div className="mt-12">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
