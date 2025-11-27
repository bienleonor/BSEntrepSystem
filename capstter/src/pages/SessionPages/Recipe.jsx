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

     

      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup} title="">
        
      </Popup>

      <div className="mt-12">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
