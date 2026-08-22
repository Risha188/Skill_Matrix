// src/context/AdminContext.jsx

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    ADMIN_STORAGE_KEY,
    CURRENT_ADMIN_STORAGE_KEY,
    ADMIN_PERMISSIONS,
    initializeAdmins,
} from "../data/adminData";

const AdminContext = createContext(null);

// =========================================================
// PROVIDER
// =========================================================

export const AdminProvider = ({
    children,
}) => {
    const [admins, setAdmins] = useState([]);

    const [currentAdmin, setCurrentAdmin] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    // =====================================================
    // INITIALIZE ADMINS
    // =====================================================

    useEffect(() => {
        const initializedAdmins =
            initializeAdmins();

        setAdmins(initializedAdmins);

        const storedCurrentAdmin =
            localStorage.getItem(
                CURRENT_ADMIN_STORAGE_KEY
            );

        if (storedCurrentAdmin) {
            try {
                const parsedAdmin =
                    JSON.parse(
                        storedCurrentAdmin
                    );

                const latestAdmin =
                    initializedAdmins.find(
                        (admin) =>
                            admin.id ===
                            parsedAdmin.id
                    );

                if (
                    latestAdmin &&
                    (
                        latestAdmin.isDefault ||
                        (
                            latestAdmin.isApproved &&
                            latestAdmin.isActive
                        )
                    )
                ) {
                    setCurrentAdmin(
                        latestAdmin
                    );
                } else {
                    localStorage.removeItem(
                        CURRENT_ADMIN_STORAGE_KEY
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to restore admin session:",
                    error
                );

                localStorage.removeItem(
                    CURRENT_ADMIN_STORAGE_KEY
                );
            }
        }

        setLoading(false);
    }, []);

    // =====================================================
    // SAVE ADMINS
    // =====================================================

    const saveAdmins = (
        updatedAdmins
    ) => {
        setAdmins(updatedAdmins);

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(
                updatedAdmins
            )
        );
    };

    // =====================================================
    // REGISTER SECONDARY ADMIN
    // =====================================================

    const registerAdmin = ({
        name,
        email,
        password,
    }) => {
        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const existingAdmin =
            admins.find(
                (admin) =>
                    admin.email
                        .toLowerCase() ===
                    normalizedEmail
            );

        if (existingAdmin) {
            return {
                success: false,

                message:
                    "An administrator with this email already exists.",
            };
        }

        // Only one secondary admin.
        const secondaryAdminExists =
            admins.some(
                (admin) =>
                    !admin.isDefault
            );

        if (secondaryAdminExists) {
            return {
                success: false,

                message:
                    "The system already has a secondary administrator account.",
            };
        }

        const newAdmin = {
            id: "ADMIN002",

            name: name.trim(),

            email: normalizedEmail,

            password,

            role: "admin",

            isDefault: false,

            isApproved: false,

            isActive: false,

            status: "Pending",

            approvedBy: null,

            approvedAt: null,

            permissions: [],

            createdAt:
                new Date().toISOString(),
        };

        const updatedAdmins = [
            ...admins,
            newAdmin,
        ];

        saveAdmins(
            updatedAdmins
        );

        return {
            success: true,

            message:
                "Registration successful. Your administrator account is waiting for approval from the System Administrator.",

            admin: newAdmin,
        };
    };

    // =====================================================
    // LOGIN
    // =====================================================

    const loginAdmin = ({
        email,
        password,
    }) => {
        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const admin = admins.find(
            (item) =>
                item.email
                    .toLowerCase() ===
                normalizedEmail
        );

        if (!admin) {
            return {
                success: false,

                message:
                    "No administrator account was found with this email.",
            };
        }

        if (
            admin.password !==
            password
        ) {
            return {
                success: false,

                message:
                    "Incorrect password.",
            };
        }

        // =================================================
        // SYSTEM ADMIN
        // =================================================

        if (admin.isDefault) {
            const updatedDefaultAdmin = {
                ...admin,

                isApproved: true,

                isActive: true,

                status: "Active",

                permissions:
                    Object.values(
                        ADMIN_PERMISSIONS
                    ),
            };

            setCurrentAdmin(
                updatedDefaultAdmin
            );

            localStorage.setItem(
                CURRENT_ADMIN_STORAGE_KEY,
                JSON.stringify(
                    updatedDefaultAdmin
                )
            );

            return {
                success: true,

                admin:
                    updatedDefaultAdmin,
            };
        }

        // =================================================
        // SECONDARY ADMIN NOT APPROVED
        // =================================================

        if (!admin.isApproved) {
            return {
                success: false,

                pending: true,

                message:
                    admin.status ===
                    "Rejected"
                        ? "Your administrator request has been rejected by the System Administrator."
                        : admin.status ===
                          "Revoked"
                        ? "Your administrator access has been revoked by the System Administrator."
                        : "Your administrator account is waiting for approval from the System Administrator.",
            };
        }

        // =================================================
        // SECONDARY ADMIN INACTIVE
        // =================================================

        if (!admin.isActive) {
            return {
                success: false,

                message:
                    "Your administrator account is currently inactive.",
            };
        }

        // =================================================
        // SECONDARY ADMIN APPROVED
        // =================================================

        setCurrentAdmin(admin);

        localStorage.setItem(
            CURRENT_ADMIN_STORAGE_KEY,
            JSON.stringify(admin)
        );

        return {
            success: true,

            admin,
        };
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutAdmin = () => {
        setCurrentAdmin(null);

        localStorage.removeItem(
            CURRENT_ADMIN_STORAGE_KEY
        );
    };

    // =====================================================
    // APPROVE SECONDARY ADMIN
    // =====================================================

    const approveAdmin = (
        adminId
    ) => {
        if (
            !currentAdmin?.isDefault
        ) {
            return {
                success: false,

                message:
                    "Only the System Administrator can approve another administrator.",
            };
        }

        const adminToApprove =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );

        if (!adminToApprove) {
            return {
                success: false,

                message:
                    "Administrator not found.",
            };
        }

        if (
            adminToApprove.isDefault
        ) {
            return {
                success: false,

                message:
                    "The System Administrator does not require approval.",
            };
        }

        // Only one active secondary admin.
        const anotherActiveAdmin =
            admins.some(
                (admin) =>
                    !admin.isDefault &&
                    admin.id !==
                        adminId &&
                    admin.isApproved &&
                    admin.isActive
            );

        if (anotherActiveAdmin) {
            return {
                success: false,

                message:
                    "There is already an active secondary administrator.",
            };
        }

        const updatedAdmins =
            admins.map(
                (admin) => {
                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }

                    return {
                        ...admin,

                        isApproved: true,

                        isActive: true,

                        status: "Active",

                        approvedBy:
                            currentAdmin.id,

                        approvedAt:
                            new Date().toISOString(),

                        // Initial permission.
                        permissions: [
                            ADMIN_PERMISSIONS.DASHBOARD,
                        ],
                    };
                }
            );

        saveAdmins(
            updatedAdmins
        );

        return {
            success: true,

            message:
                "Administrator approved successfully.",
        };
    };

    // =====================================================
    // REJECT ADMIN
    // =====================================================

    const rejectAdmin = (
        adminId
    ) => {
        if (
            !currentAdmin?.isDefault
        ) {
            return {
                success: false,

                message:
                    "Only the System Administrator can reject an administrator.",
            };
        }

        const adminToReject =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );

        if (!adminToReject) {
            return {
                success: false,

                message:
                    "Administrator not found.",
            };
        }

        if (
            adminToReject.isDefault
        ) {
            return {
                success: false,

                message:
                    "The System Administrator cannot be rejected.",
            };
        }

        const updatedAdmins =
            admins.map(
                (admin) => {
                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }

                    return {
                        ...admin,

                        isApproved: false,

                        isActive: false,

                        status: "Rejected",

                        approvedBy: null,

                        approvedAt: null,

                        permissions: [],
                    };
                }
            );

        saveAdmins(
            updatedAdmins
        );

        return {
            success: true,

            message:
                "Administrator request rejected.",
        };
    };

    // =====================================================
    // REVOKE ADMIN
    // =====================================================

    const revokeAdmin = (
        adminId
    ) => {
        if (
            !currentAdmin?.isDefault
        ) {
            return {
                success: false,

                message:
                    "Only the System Administrator can revoke administrator access.",
            };
        }

        const adminToRevoke =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );

        if (!adminToRevoke) {
            return {
                success: false,

                message:
                    "Administrator not found.",
            };
        }

        if (
            adminToRevoke.isDefault
        ) {
            return {
                success: false,

                message:
                    "The System Administrator cannot be revoked.",
            };
        }

        const updatedAdmins =
            admins.map(
                (admin) => {
                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }

                    return {
                        ...admin,

                        isApproved: false,

                        isActive: false,

                        status: "Revoked",

                        permissions: [],
                    };
                }
            );

        saveAdmins(
            updatedAdmins
        );

        return {
            success: true,

            message:
                "Administrator access revoked.",
        };
    };

    // =====================================================
    // UPDATE PERMISSIONS
    // =====================================================

    const updateAdminPermissions = (
        adminId,
        permissions
    ) => {
        if (
            !currentAdmin?.isDefault
        ) {
            return {
                success: false,

                message:
                    "Only the System Administrator can change administrator permissions.",
            };
        }

        const adminToUpdate =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );

        if (!adminToUpdate) {
            return {
                success: false,

                message:
                    "Administrator not found.",
            };
        }

        if (
            adminToUpdate.isDefault
        ) {
            return {
                success: false,

                message:
                    "The System Administrator already has full access.",
            };
        }

        const updatedAdmins =
            admins.map(
                (admin) => {
                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }

                    return {
                        ...admin,

                        permissions:
                            Array.isArray(
                                permissions
                            )
                                ? permissions
                                : [],
                    };
                }
            );

        saveAdmins(
            updatedAdmins
        );

        return {
            success: true,

            message:
                "Administrator permissions updated successfully.",
        };
    };

    // =====================================================
    // CHECK ADMIN PANEL ACCESS
    // =====================================================

    const canAccessAdminPanel = (
        admin
    ) => {
        if (!admin) {
            return false;
        }

        if (admin.isDefault) {
            return true;
        }

        return (
            admin.isApproved === true &&
            admin.isActive === true
        );
    };

    // =====================================================
    // CHECK PERMISSION
    // =====================================================

    const hasPermission = (
        permission
    ) => {
        if (!currentAdmin) {
            return false;
        }

        // System Admin = everything
        if (
            currentAdmin.isDefault
        ) {
            return true;
        }

        return (
            Array.isArray(
                currentAdmin.permissions
            ) &&
            currentAdmin.permissions.includes(
                permission
            )
        );
    };

    // =====================================================
    // KEEP CURRENT ADMIN SYNCHRONIZED
    // =====================================================

    useEffect(() => {
        if (!currentAdmin) {
            return;
        }

        const updatedCurrentAdmin =
            admins.find(
                (admin) =>
                    admin.id ===
                    currentAdmin.id
            );

        if (!updatedCurrentAdmin) {
            logoutAdmin();
            return;
        }

        // Secondary admin was revoked/rejected.
        if (
            !updatedCurrentAdmin.isDefault &&
            (
                !updatedCurrentAdmin.isApproved ||
                !updatedCurrentAdmin.isActive
            )
        ) {
            logoutAdmin();
            return;
        }

        // Update current session
        // with latest permissions.
        if (
            JSON.stringify(
                updatedCurrentAdmin
            ) !==
            JSON.stringify(
                currentAdmin
            )
        ) {
            setCurrentAdmin(
                updatedCurrentAdmin
            );

            localStorage.setItem(
                CURRENT_ADMIN_STORAGE_KEY,
                JSON.stringify(
                    updatedCurrentAdmin
                )
            );
        }
    }, [admins]);

    // =====================================================
    // PENDING ADMINS
    // =====================================================

    const pendingAdmins =
        admins.filter(
            (admin) =>
                !admin.isDefault &&
                admin.status ===
                    "Pending"
        );

    // =====================================================
    // ACTIVE SECONDARY ADMINS
    // =====================================================

    const activeSecondaryAdmins =
        admins.filter(
            (admin) =>
                !admin.isDefault &&
                admin.isApproved &&
                admin.isActive
        );

    // =====================================================
    // PROVIDER
    // =====================================================

    return (
        <AdminContext.Provider
            value={{
                admins,

                currentAdmin,

                loading,

                pendingAdmins,

                activeSecondaryAdmins,

                registerAdmin,

                loginAdmin,

                logoutAdmin,

                approveAdmin,

                rejectAdmin,

                revokeAdmin,

                updateAdminPermissions,

                canAccessAdminPanel,

                hasPermission,

                permissions:
                    ADMIN_PERMISSIONS,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

// =========================================================
// useAdmin
// =========================================================

export const useAdmin = () => {
    const context =
        useContext(AdminContext);

    if (!context) {
        throw new Error(
            "useAdmin must be used inside AdminProvider"
        );
    }

    return context;
};

// =========================================================
// useAdminAuth
// Compatibility alias
// =========================================================

export const useAdminAuth = () => {
    return useAdmin();
};

export default AdminContext;