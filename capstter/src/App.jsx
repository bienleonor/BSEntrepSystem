import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { publicRoutes } from "../src/routes/PublicRoutes"
import { privateRoutes } from '../src/routes/PrivateRoutes'

// ✅ Auth wrapper
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') // Replace with real auth logic
  return isAuthenticated ? element : <Navigate to="/Login" replace />
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected routes */}
      {privateRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute element={element} />} />
      ))}
    </Routes>
  )
}

export default App
