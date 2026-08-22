// src/data/adminData.js

// =========================================================
// LOCAL STORAGE KEYS
// =========================================================

export const ADMIN_STORAGE_KEY =
    "skillmatrix_admins";

export const CURRENT_ADMIN_STORAGE_KEY =
    "skillmatrix_current_admin";

// =========================================================
// ADMIN PERMISSIONS
// =========================================================

export const ADMIN_PERMISSIONS = {
    DASHBOARD: "dashboard",
    EMPLOYEES: "employees",
    PROJECTS: "projects",
};

// =========================================================
// PERMISSION LABELS
// Useful for displaying permissions in UI
// =========================================================

export const ADMIN_PERMISSION_LABELS = {
    [ADMIN_PERMISSIONS.DASHBOARD]:
        "Dashboard",

    [ADMIN_PERMISSIONS.EMPLOYEES]:
        "Employees",

    [ADMIN_PERMISSIONS.PROJECTS]:
        "Projects",
};

// =========================================================
// DEFAULT / SYSTEM ADMIN
// =========================================================

export const DEFAULT_ADMIN = {
    id: "ADMIN001",

    name: "System Administrator",

    email: "admin@skillmatrix.com",

    password: "admin123",

    role: "admin",

    isDefault: true,

    isApproved: true,

    isActive: true,

    status: "Active",

    approvedBy: null,

    approvedAt: null,

    permissions: Object.values(
        ADMIN_PERMISSIONS
    ),

    createdAt: new Date().toISOString(),
};

// =========================================================
// INITIALIZE ADMINS
// =========================================================

export const initializeAdmins = () => {
    const storedAdmins =
        localStorage.getItem(
            ADMIN_STORAGE_KEY
        );

    if (storedAdmins) {
        try {
            const parsedAdmins =
                JSON.parse(storedAdmins);

            if (
                Array.isArray(parsedAdmins) &&
                parsedAdmins.length > 0
            ) {
                return parsedAdmins;
            }
        } catch (error) {
            console.error(
                "Failed to parse stored admins:",
                error
            );
        }
    }

    const initialAdmins = [
        DEFAULT_ADMIN,
    ];

    localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(initialAdmins)
    );

    return initialAdmins;
};