
export const ADMIN_STORAGE_KEY = "skillmatrix_admins";

export const CURRENT_ADMIN_STORAGE_KEY = "skillmatrix_current_admin";

export const ADMIN_PERMISSIONS = {
    DASHBOARD: "dashboard",
    EMPLOYEES: "employees",
    PROJECTS: "projects",
};

export const ADMIN_PERMISSION_LABELS = {
    [ADMIN_PERMISSIONS.DASHBOARD]: "Dashboard",
    [ADMIN_PERMISSIONS.EMPLOYEES]: "Employees",
    [ADMIN_PERMISSIONS.PROJECTS]: "Projects",
};

// Default System Administrator
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
    permissions: Object.values(ADMIN_PERMISSIONS),
    createdAt: new Date().toISOString(),
};

// Initialize administrators without losing existing accounts
export const initializeAdmins = () => {
    try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        let admins = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(admins)) {
            admins = [];
        }

        // Always ensure the System Administrator exists
        const defaultExists = admins.some(
            (admin) => admin.isDefault === true
        );

        if (!defaultExists) {
            admins.unshift(DEFAULT_ADMIN);
        }

        // Ensure the default administrator has full access
        admins = admins.map((admin) => {
            if (admin.isDefault) {
                return {
                    ...admin,
                    email: DEFAULT_ADMIN.email,
                    role: "admin",
                    isApproved: true,
                    isActive: true,
                    status: "Active",
                    permissions: Object.values(ADMIN_PERMISSIONS),
                };
            }

            return admin;
        });

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(admins)
        );

        return admins;
    } catch (error) {
        console.error("Admin initialization error:", error);

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify([DEFAULT_ADMIN])
        );

        return [DEFAULT_ADMIN];
    }
};
