import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isSupabaseConfigured, getSupabase } from "../supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "editor" | "designer" | "viewer";

export interface AuthUser {
  email: string;
  role: UserRole;
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Role Hierarchy ───────────────────────────────────────────────────────────
// Higher index = more permissions
const ROLE_HIERARCHY: UserRole[] = ["viewer", "designer", "editor", "admin"];

function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  role: null,
  hasPermission: () => false,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (email: string): Promise<UserRole> => {
    if (!isSupabaseConfigured) return "admin"; // fallback: treat everyone as admin

    try {
      const { data, error } = await getSupabase()
        .from("admins")
        .select("id, payload, enabled")
        .eq("id", email.trim().toLowerCase())
        .maybeSingle();

      if (error || !data || !data.enabled) return "viewer";

      const payload = data.payload as { role?: string; email?: string } | null;
      const role = payload?.role as UserRole | undefined;

      if (role && ROLE_HIERARCHY.includes(role)) {
        return role;
      }
      // Default: if they're in the admins table but no role specified, they're admin
      return "admin";
    } catch {
      return "viewer";
    }
  }, []);

  const loadUser = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // No Supabase = dev mode, treat as admin
      setUser({
        email: "dev@local",
        role: "admin",
        fullName: "Developer",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await getSupabase().auth.getUser();
      if (data?.user?.email) {
        const email = data.user.email;
        const role = await fetchUserRole(email);
        setUser({
          email,
          role,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          avatarUrl: data.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, [fetchUserRole]);

  useEffect(() => {
    loadUser();

    if (isSupabaseConfigured) {
      const { data: listener } = getSupabase().auth.onAuthStateChange((_event, _session) => {
        loadUser();
      });
      return () => {
        listener?.subscription?.unsubscribe();
      };
    }
  }, [loadUser]);

  const hasPermission = useCallback((requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return getRoleLevel(user.role) >= getRoleLevel(requiredRole);
  }, [user]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await getSupabase().auth.signOut();
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role ?? null,
        hasPermission,
        signOut,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
