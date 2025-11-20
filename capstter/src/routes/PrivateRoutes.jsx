import UserDashboard from '../pages/Sessionpages/UserDashboard.jsx'

import Inventory from '../pages/Sessionpages/Inventory.jsx'
import SalesAnalysis from '../pages/Sessionpages/SalesAnalysis.jsx'
import SalesLog from  '../pages/SessionPages/SalesLog.jsx'
import ItemRegistration from '../pages/SessionPages/ItemRegistration.jsx'
import UserDetails from '../pages/Userdetails.jsx'
import OrderList from '../pages/SessionPages/OrderList.jsx'
import Recipes from '../pages/SessionPages/Recipe.jsx'
import BusinessRegistration from '../pages/BusinessRegistration.jsx'
import Busmanage from '../pages/SessionPages/BusManage.jsx'
import ProductList from '../pages/SessionPages/ProductList.jsx'
import ProductListComponent from '../components/inventory/ProductListComponent.jsx'
import PointofSales from '../pages/SessionPages/PointofSales.jsx'
import SuperAdminDashboard from '../pages/SuperAdminPages/SuperAdminDashboard.jsx'
import StockOut from '../pages/SessionPages/StockOut.jsx'
export const privateRoutes = [
  { path: '/UserDashboard', element: <UserDashboard /> },
  { path: '/UserDetails', element: <UserDetails /> },
  { path: '/businessregistration', element: <BusinessRegistration /> },
    { path: '/StockOut', element: <StockOut /> },
  { path: '/itemregistration', element: <ItemRegistration /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/salesanalysis', element: <SalesAnalysis /> },
  { path: '/salesLog', element: <SalesLog /> },
  { path: '/orderlist', element: <OrderList /> },
  { path: '/recipes', element: <Recipes /> },
  { path: '/busmanage', element: <Busmanage />},
  { path: '/productlist', element: <ProductList />},
  { path: '/productlistcomponent', element: <ProductListComponent />},
  { path: '/pointofsales', element: <PointofSales />},
  { path: '/superadmin/dashboard', element: <SuperAdminDashboard />}
]
