import UserDashboard from '../pages/Sessionpages/UserDashboard.jsx'
import CreateOrder from '../pages/Sessionpages/CreateOrder.jsx'
import Inventory from '../pages/Sessionpages/Inventory.jsx'
import SalesAnalysis from '../pages/Sessionpages/SalesAnalysis.jsx'
import SalesLog from '../pages/Sessionpages/SalesLog.jsx'
import ItemRegistration from '../pages/SessionPages/ItemRegistration.jsx'
import UserDetails from '../pages/Userdetails.jsx'
import OrderList from '../pages/SessionPages/OrderList.jsx'
import Recipes from '../pages/SessionPages/Recipe.jsx'
import BusinessRegistration from '../pages/BusinessRegistration.jsx'
import Busmanage from '../pages/BusManage.jsx'

export const privateRoutes = [
  { path: '/UserDashboard', element: <UserDashboard /> },
  { path: '/UserDetails', element: <UserDetails /> },
  { path: '/businessregistration', element: <BusinessRegistration /> },
  { path: '/CreateOrder', element: <CreateOrder /> },
  { path: '/itemregistration', element: <ItemRegistration /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/salesanalysis', element: <SalesAnalysis /> },
  { path: '/salesLog', element: <SalesLog /> },
  { path: '/orderlist', element: <OrderList /> },
  { path: '/recipes', element: <Recipes /> },
  {path: '/busmanage', element: <Busmanage />},

]
