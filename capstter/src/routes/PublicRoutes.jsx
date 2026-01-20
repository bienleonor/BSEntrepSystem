import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Unauthorized from '../pages/Unauthorized'
import Noresult from '../pages/Noresult'

export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/Login', element: <Login /> },
  { path: '/Register', element: <Register /> },
  { path: '/Unauthorized', element: <Unauthorized /> },
  { path: '/Noresult', element: <Noresult /> },
  { path: '*', element: <Noresult /> },
]
