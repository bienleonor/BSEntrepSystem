import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ element, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/Login" replace />

  // If allowedRoles is empty, any authenticated user is allowed
  if (allowedRoles.length > 0) {
    // AuthContext sets `user` to the decoded token payload; your token helpers
    // expose the role as `role` (see `utils/token.getRole`). Use `user.role`.
    const role = user?.system_role
    if (!role || !allowedRoles.includes(role)) {
      // Redirect unauthorized users to a safe page (adjust as needed)
      return <Navigate to="/unauthorized" replace />
    }
  }

  return element
}
