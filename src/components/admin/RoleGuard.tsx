import React from "react";
import { useAuth, type UserRole } from "../../context/AuthContext";
import { ShieldAlert } from "lucide-react";

interface RoleGuardProps {
  /** Required role(s) to access this content */
  requiredRole: UserRole | UserRole[];
  /** Content to show when user has permission */
  children: React.ReactNode;
  /** Optional: custom fallback UI when access is denied */
  fallback?: React.ReactNode;
  /** If true, renders nothing instead of access denied message */
  silent?: boolean;
}

/**
 * RoleGuard — Wraps content and restricts access based on user role.
 *
 * Usage:
 *   <RoleGuard requiredRole="admin">
 *     <PublishButton />
 *   </RoleGuard>
 *
 *   <RoleGuard requiredRole={["admin", "editor"]}>
 *     <EditPanel />
 *   </RoleGuard>
 *
 *   <RoleGuard requiredRole="admin" silent>
 *     <SecretMenu />
 *   </RoleGuard>
 */
export default function RoleGuard({ requiredRole, children, fallback, silent }: RoleGuardProps) {
  const { hasPermission, loading, role } = useAuth();

  if (loading) return null; // Don't flash content

  if (hasPermission(requiredRole)) {
    return <>{children}</>;
  }

  if (silent) return null;

  if (fallback) return <>{fallback}</>;

  const roleLabels: Record<UserRole, string> = {
    admin: "Admin",
    editor: "Editor",
    designer: "Designer",
    viewer: "Viewer",
  };

  const requiredLabel = Array.isArray(requiredRole)
    ? requiredRole.map((r) => roleLabels[r]).join(" / ")
    : roleLabels[requiredRole];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "0.75rem",
        textAlign: "center",
      }}
    >
      <ShieldAlert size={32} style={{ color: "#ef4444" }} />
      <div>
        <p style={{ fontWeight: 700, color: "#991b1b", margin: "0 0 0.25rem 0" }}>
          Akses Dibatasi
        </p>
        <p style={{ fontSize: "0.8rem", color: "#b91c1c", margin: 0 }}>
          Anda memerlukan peran <strong>{requiredLabel}</strong> untuk mengakses fitur ini.
          <br />
          Peran Anda saat ini: <strong>{role ? roleLabels[role] : "Tidak Diketahui"}</strong>
        </p>
      </div>
    </div>
  );
}

/**
 * useRoleCheck — Inline hook for conditional rendering based on role.
 *
 * Usage:
 *   const canPublish = useRoleCheck("admin");
 *   const canEdit = useRoleCheck(["admin", "editor"]);
 */
export function useRoleCheck(requiredRole: UserRole | UserRole[]): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(requiredRole);
}
