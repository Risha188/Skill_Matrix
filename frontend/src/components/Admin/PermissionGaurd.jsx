// src/components/admin/PermissionGuard.jsx

import {
    useAdmin,
} from "../../context/AdminContext";

const PermissionGuard = ({
    permission,
    children,
    fallback = null,
}) => {
    const {
        currentAdmin,
        hasPermission,
    } = useAdmin();

    // No logged-in admin
    if (!currentAdmin) {
        return fallback;
    }

    // System Administrator has everything.
    if (currentAdmin.isDefault) {
        return children;
    }

    // Check secondary-admin permission.
    if (!hasPermission(permission)) {
        return (
            fallback || (
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                        <div className="mb-3 text-4xl">
                            🔒
                        </div>

                        <h2 className="mb-2 text-xl font-bold text-red-700">
                            Access Denied
                        </h2>

                        <p className="text-sm text-red-600">
                            You do not have permission
                            to access this section.
                        </p>
                    </div>
                </div>
            )
        );
    }

    return children;
};

export default PermissionGuard;