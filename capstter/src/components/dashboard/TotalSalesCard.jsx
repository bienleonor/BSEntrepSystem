import Card from "../common/Card";
import { useEffect, useState } from "react";
import { getRole } from "../../utils/token"; 
import AxiosInstance from "../../utils/axiosInstance";

export default function TotalSalesCard() {
  const [totalAmount, setTotalAmount] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = getRole();
        setRole(role);

     
        const res = await AxiosInstance.get("/sales/total_amount");

        // Axios automatically parses JSON, so you can access res.data directly
        setTotalAmount(res.data.total_sales);
      } catch (error) {
        console.error("Failed to fetch account data: ", error);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 30000); // refresh every 30s

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
   <Card className="flex flex-col w-full rounded-lg shadow-md bg-white p-6">
  <div className="flex justify-between items-center">
    <h2 className="font-semibold text-gray-700 text-2xl">Total Sales</h2>
  </div>

  <p className="mt-4 text-3xl font-bold text-black-600">
    {totalAmount !== null 
      ? `₱${Number(totalAmount).toLocaleString()}` 
      : "No Sales..."}
  </p>
     {/* <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Account Type : {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"}
        </span>
      </div>*/}
    </Card>
  );
}
