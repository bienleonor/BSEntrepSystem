import Card from "../common/Card";
import { useEffect, useState } from "react";
import { getToken, getRole, getBusinessId } from "../../utils/token"; 

export default function TotalSalesCard() {
  const [totalAmount, setTotalAmount] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const role = getRole();
        const businessId = getBusinessId();
        setRole(role);

        if (!businessId) {
          console.error("No business selected");
          return;
        }

       const res = await fetch("http://localhost:5000/api/sales/total_amount", {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Business-Id': businessId   // ✅ send business id in header
          }
      });


        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTotalAmount(data.total_sales);
      } catch (error) {
        console.error("Failed to fetch account data: ", error);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 30000); // refresh every 30s

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <Card className="flex flex-col justify-between w-full">
      <h2 className="font-semibold text-gray-700">Total Sales</h2>
      <p className="text-3xl font-bold">
        {totalAmount !== null 
          ? `₱${Number(totalAmount).toLocaleString()}` 
          : "No Sales..."}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Account Type : {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"}
        </span>
      </div>
    </Card>
  );
}
