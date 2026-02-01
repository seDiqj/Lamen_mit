import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

interface UserPermissions {
  [pageName: string]: boolean;
}

type UserRoleData = {
  role: "user" | "manager" | "admin";
};

export function usePagePermissions() {
  const { isAuthenticated } = useAuth();
  
  const { data: roleData } = useQuery<UserRoleData>({
    queryKey: ["/api/user/role"],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const role = roleData?.role || "user";

  const { data: myPermissions, isLoading } = useQuery<{ role: string; permissions: UserPermissions }>({
    queryKey: ["/api/my-permissions"],
    queryFn: async () => {
      const res = await fetch("/api/my-permissions", { credentials: "include" });
      if (!res.ok) return { role: "user", permissions: {} };
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const permissions = myPermissions?.permissions || {};

  const DEFAULT_PAGES = ["dashboard", "loans", "payments"];

  const hasAccess = (pageName: string): boolean => {
    if (role === "admin" || role === "manager") {
      return true;
    }
    if (isLoading) {
      return DEFAULT_PAGES.includes(pageName);
    }
    if (Object.keys(permissions).length === 0) {
      return DEFAULT_PAGES.includes(pageName);
    }
    return permissions[pageName] === true;
  };

  const isReady = !isLoading && Object.keys(permissions).length > 0;

  return {
    permissions,
    hasAccess,
    isLoading,
    isReady,
    isAdminOrManager: role === "admin" || role === "manager",
  };
}
