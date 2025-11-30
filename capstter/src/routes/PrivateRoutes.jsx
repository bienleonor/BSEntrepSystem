import UserDashboard from '../pages/Sessionpages/UserDashboard.jsx'
import Inventory from '../pages/Sessionpages/Inventory.jsx'
import SalesAnalysis from '../pages/Sessionpages/SalesAnalysis.jsx'
import SalesLog from  '../pages/SessionPages/SalesLog.jsx'
import UserDetails from '../pages/Userdetails.jsx'
import OrderList from '../pages/SessionPages/OrderList.jsx'
import Recipes from '../pages/SessionPages/Recipe.jsx'
import BusinessRegistration from '../pages/BusinessRegistration.jsx'
import Busmanage from '../pages/SessionPages/BusManage.jsx'
import ProductList from '../pages/SessionPages/ProductList.jsx'
import ProductListComponent from '../components/inventory/ProductListComponent.jsx'
import PointofSales from '../pages/SessionPages/PointofSales.jsx'
import SuperAdminDashboard from '../pages/SuperAdminPages/SuperAdminDashboard.jsx'
import MultiAdjustment from '../pages/SessionPages/MultiAdjustment.jsx'
import AccessCode from '../pages/SessionPages/AccessCode.jsx'
import ChooseRole from "../pages/ChooseRole"
import EmployeeManagement from '../pages/SessionPages/EmployeeManagement.jsx'
import BusinessPosition from '../pages/SessionPages/BusinessPosition.jsx'
import BusinessSettings from '../pages/SessionPages/BusinessSettings.jsx'
import ProductRegistration from '../pages/SessionPages/ProductRegistration.jsx'
import Category from '../pages/SessionPages/Category.jsx'
import StockAdjustmentReport from '../pages/SessionPages/StockAdjustmentReport.jsx'

export const userRoutes = [
  { path: '/UserDashboard', element: <UserDashboard /> },
  { path: '/UserDetails', element: <UserDetails /> },
  { path: '/businessregistration', element: <BusinessRegistration /> },
  { path: '/chooserole', element: <ChooseRole />},
  { path: '/multiadjustmentstock', element: <MultiAdjustment /> },
  { path: '/stockadjustmentreport', element: <StockAdjustmentReport /> },
  { path: '/productregistration', element: <ProductRegistration /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/salesanalysis', element: <SalesAnalysis /> },
  { path: '/salesLog', element: <SalesLog /> },
  { path: '/accesscode', element: <AccessCode /> },
  { path: '/orderlist', element: <OrderList /> },
  { path: '/recipes', element: <Recipes /> },
  { path: '/category', element: <Category /> },
  { path: '/productlist', element: <ProductList />},
  { path: '/productlistcomponent', element: <ProductListComponent />},
  { path: '/pointofsales', element: <PointofSales />},

  { path: '/busmanage', element: <Busmanage />},
  { path: '/employeemanagement', element: <EmployeeManagement />},
  { path: '/businessposition', element: <BusinessPosition />},
  { path: '/businesssetting', element: <BusinessSettings />},
]


export const superAdminRoutes = [
  { path: '/superadmin/dashboard', element: <SuperAdminDashboard />},
]
