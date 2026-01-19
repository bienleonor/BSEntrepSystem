# RBAC Implementation Plan — rbacImplementation

## TL;DR
Implement Role-Based Access Control across database, Express backend, and React frontend. Central goals:
- Support system-level roles (superadmin, admin, superuser, user) and business-level position roles (owner, manager, cashier, staff).
- Store permissions centrally and assign them to both system roles and position roles.
- Issue tokens that include role (and optionally permissions) and enforce access via middleware on backend and route guards on frontend.

---

## High-level Phases

PHASE 1 — Database Setup
- Create core tables: `system_roles`, `position_roles`, `permissions`.
- Create pivot tables: `role_permissions` (system_roles ↔ permissions), `position_role_permissions` (position_roles ↔ permissions), `user_position_roles` (user ↔ position roles), `user_roles` (user ↔ system roles) if needed.
- Seed default roles and permissions.

PHASE 2 — Backend Core (Express + MySQL)
- Authentication: login route returns JWT and user payload with `systemRole`, `positionRoles`, and optional permission list.
- JWT middleware: verify token and attach decoded user + roles/permissions to `req.user`.
- RBAC middleware: `requireRole(...)`, `requirePermission(...)`, `requirePositionRole(...)`.
- Role & permission CRUD controllers and routes (protected for `superadmin`).

PHASE 3 — Backend Feature Completion
- Build all core routes (inventory, POS, sales, users, admin management) before mapping permissions.
- Add placeholder guards (e.g., `requireRole('admin')`) while building features.

PHASE 4 — Frontend Setup (React)
- `AuthContext` should store `user`, `roles`, and `permissions`.
- `ProtectedRoute` should accept `allowedRoles` and `requiredPermission`.
- UI helpers: `hasRole(role)`, `hasPermission(permission)`.

PHASE 5 — Connect & Sync
- Ensure login flow saves token and normalized `user.role` (avoid `system_role` vs `role` mismatches).
- Add `GET /auth/me` to return effective permissions for the logged-in user.

PHASE 6 — Permissions Mapping
- Identify actions that need permissions (create_user, edit_user, view_sales, manage_inventory, etc.).
- Assign permissions to system roles and position roles.
- Rebuild token or response to include effective permissions.

PHASE 7 — Final Enforcement
- Add `requirePermission('...')` to backend routes.
- Hide/show UI elements based on `user.permissions` in frontend.

PHASE 8 — QA & Security
- Test permission flows, log failures, add role-change audit, and implement token revocation/roles_version strategies.

PHASE 9 — Deployment
- Migrations, seeds, docs, and rollout plan.

---

## Concrete Starter Examples (copy/paste)

### SQL (example migration snippets)

CREATE TABLE system_roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES system_roles(role_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

-- add position_roles and position_role_permissions similarly


### Express middleware (concept)

// auth-middleware.js
// - verify token
// - attach req.user = { id, name, roles: [..], permissions: [..] }

// role-middleware.js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    if (allowedRoles.some(r => roles.includes(r))) return next();
    return res.status(403).json({ error: 'Forbidden' });
  }
}

function requirePermission(permission) {
  return async (req, res, next) => {
    const perms = req.user?.permissions;
    if (Array.isArray(perms) && perms.includes(permission)) return next();
    // fallback: fetch permissions from DB for user's roles and check union
    // (optimize with caching)
    return res.status(403).json({ error: 'Forbidden' });
  }
}


### Frontend: AuthContext helpers

// AuthContext should expose:
// user, loading, isAuthenticated, roles, permissions, hasRole(), hasPermission()

function hasRole(role) {
  return user?.roles?.includes(role);
}

function hasPermission(permission) {
  return user?.permissions?.includes(permission);
}

// ProtectedRoute should accept `allowedRoles` and `requiredPermission`


## Suggested Next Actions (pick one)

A) Generate DB migration + seed files (high priority).
B) Implement backend RBAC middleware and update auth middleware to attach roles/permissions (high priority).
C) Enhance auth controller to include roles & permissions in login response and add `GET /auth/me` (high priority).
D) Update frontend `AuthContext` and `ProtectedRoute` to support permission checks and add helpers (high priority).
E) Create a minimal role & permission management UI (superadmin pages) (medium priority).

Pick A–E and I'll implement the files and code changes for that step.

---

## JSON Todo (for developer automation)

[
  { "id": 1, "title": "Design RBAC data model and migrations", "priority": "high" },
  { "id": 2, "title": "Add role & permission models (backend)", "priority": "high" },
  { "id": 3, "title": "Enhance token generation to include roles", "priority": "high" },
  { "id": 4, "title": "Create RBAC middleware (backend)", "priority": "high" },
  { "id": 5, "title": "Protect backend routes with RBAC", "priority": "high" },
  { "id": 6, "title": "Add role management controllers & routes (backend)", "priority": "medium" },
  { "id": 7, "title": "Add service layer for RBAC operations (backend)", "priority": "medium" },
  { "id": 8, "title": "Update existing user model to expose role helpers", "priority": "medium" },
  { "id": 9, "title": "Add DB migration & seed runner scripts", "priority": "medium" },
  { "id": 10, "title": "Integrate RBAC into auth flow (backend)", "priority": "high" }
]

---

End of plan. Ready to refine or implement any selected next step.
