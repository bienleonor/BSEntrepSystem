import { useEffect } from "react";
import ProductListComponent from "../../components/inventory/ProductListComponent";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ProductList = () => {
  useEffect(() => {
    document.title = "Product List - Capstter";
  }, []);

  
  return (
  <DashboardLayout>
    <ProductListComponent />
  </DashboardLayout>
  )
};


export default ProductList;