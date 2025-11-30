import './App.css'
import { Routes, Route } from 'react-router-dom'
import { publicRoutes } from "../src/routes/PublicRoutes"
import { userRoutes, superAdminRoutes } from '../src/routes/PrivateRoutes'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* User-accessible routes (regular users, admin, superuser, superadmin) */}
      {userRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute allowedRoles={["user", "superuser", "admin", "superadmin"]} element={element} />}
        />
      ))}

      {/* Super-admin only routes */}
      {superAdminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute allowedRoles={["superadmin", "admin"]} element={element} />}
        />
      ))}
    </Routes>
  )
}

export default App
