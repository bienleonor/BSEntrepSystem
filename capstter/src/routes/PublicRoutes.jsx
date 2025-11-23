import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import Register from '../pages/Register'

export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/Login', element: <Login /> },
  { path: '/Register', element: <Register /> },
  
]
