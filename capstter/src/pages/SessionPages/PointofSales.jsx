import { useEffect } from "react";
import ProductListComponent from "../../components/inventory/ProductListComponent";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { POS1Wrapper } from "../../components/sales/POSLayout";

const PointofSales = () => {
  useEffect(() => {
    document.title = "Point of Sales - Capstter";
  }, []);


return (  
  <DashboardLayout>
    <POS1Wrapper />
  </DashboardLayout>
)
};

export default PointofSales;