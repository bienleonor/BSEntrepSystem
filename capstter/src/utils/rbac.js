import { useAuth } from "../hooks/UseAuth";

export const useRBAC = () => {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    hasRole: (allowed) => allowed.includes(role),
    isSuperAdmin: () => role === "superadmin",
    isAdmin: () => role === "admin",
    isSuperUser: () => role === "superuser",
    isUser: () => role === "user",
  };
};
