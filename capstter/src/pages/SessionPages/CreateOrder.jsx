import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import LoginNavbar from '../../components/layout/LoginNavbar';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CirclePlus } from 'lucide-react';
import OrderSection from '../../components/createorder/OrderSection';

function CreateOrder() {
  return (
   
    <DashboardLayout>
     <div>
      <OrderSection/>
     </div>
    </DashboardLayout>

  )
}

export default CreateOrder