import { useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CategoryWrapper from "../../components/product/CategoryWrapper";
const Category = () => {
  useEffect(() => {
    document.title = "Product Categories";
  }, []);   
    return (
    <DashboardLayout>
      <CategoryWrapper />
    </DashboardLayout>
  );
}

export default Category;