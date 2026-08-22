// src/components/admin/AdminManagementSystem.jsx

import {
    useState,
} from "react";

import {
    useAdmin,
} from "../../context/AdminContext";

import {
    ADMIN_PERMISSIONS,
    ADMIN_PERMISSION_LABELS,
} from "../../data/adminData";

const AdminManagementSystem = () => {
    const {
        currentAdmin,
        pendingAdmins,
        activeSecondaryAdmins,
        approveAdmin,
        rejectAdmin,
        revokeAdmin,
        updateAdminPermissions,
    } = useAdmin();

    const [
        selectedAdmin,
        setSelectedAdmin,
    ] = useState(null);

    const [
        selectedPermissions,
        setSelectedPermissions,
    ] = useState([]);

    // Only System Administrator can manage admins.
    if (!currentAdmin?.isDefault) {
        return null;
    }

    const openPermissionEditor = (
        admin
    ) => {
        setSelectedAdmin(admin);

        setSelectedPermissions(
            admin.permissions || []
        );
    };

    const closePermissionEditor = () => {
        setSelectedAdmin(null);

        setSelectedPermissions([]);
    };

    const togglePermission = (
        permission
    ) => {
        setSelectedPermissions(
            (previous) => {
                if (
                    previous.includes(
                        permission
                    )
                ) {
                    return previous.filter(
                        (item) =>
                            item !==
                            permission
                    );
                }

                return [
                    ...previous,
                    permission,
                ];
            }
        );
    };

    const handleSavePermissions =
        () => {
            if (!selectedAdmin) {
                return;
            }

            const result =
                updateAdminPermissions(
                    selectedAdmin.id,
                    selectedPermissions
                );

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert(result.message);

            closePermissionEditor();
        };

    const handleApprove = (
        adminId
    ) => {
        const result =
            approveAdmin(adminId);

        alert(result.message);
    };

    const handleReject = (
        adminId
    ) => {
        const result =
            rejectAdmin(adminId);

        alert(result.message);
    };

    const handleRevoke = (
        adminId
    ) => {
        const result =
            revokeAdmin(adminId);

        alert(result.message);
    };

    return (
        <div className="space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Administrator Management
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage secondary administrator
                    registration, approval and permissions.
                </p>
            </div>

            {/* =================================================
                PENDING REQUESTS
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Pending Administrator Requests
                        </h3>

                        <p className="text-sm text-gray-500">
                            New administrators waiting
                            for your approval.
                        </p>
                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                        {pendingAdmins.length}
                    </span>
                </div>

                {pendingAdmins.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                        <p className="text-gray-500">
                            No pending administrator
                            requests.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingAdmins.map(
                            (admin) => (
                                <div
                                    key={
                                        admin.id
                                    }
                                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {
                                                admin.name
                                            }
                                        </h4>

                                        <p className="text-sm text-gray-500">
                                            {
                                                admin.email
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Registered:{" "}
                                            {new Date(
                                                admin.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleApprove(
                                                    admin.id
                                                )
                                            }
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    admin.id
                                                )
                                            }
                                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* =================================================
                ACTIVE SECONDARY ADMIN
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Active Secondary Administrator
                    </h3>

                    <p className="text-sm text-gray-500">
                        Manage permissions for the
                        approved administrator.
                    </p>
                </div>

                {activeSecondaryAdmins.length ===
                0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                        <p className="text-gray-500">
                            No active secondary administrator.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeSecondaryAdmins.map(
                            (admin) => (
                                <div
                                    key={
                                        admin.id
                                    }
                                    className="rounded-xl border border-gray-200 p-5"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {
                                                    admin.name
                                                }
                                            </h4>

                                            <p className="text-sm text-gray-500">
                                                {
                                                    admin.email
                                                }
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {admin.permissions?.map(
                                                    (
                                                        permission
                                                    ) => (
                                                        <span
                                                            key={
                                                                permission
                                                            }
                                                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                                                        >
                                                            {
                                                                ADMIN_PERMISSION_LABELS[
                                                                    permission
                                                                ]
                                                            }
                                                        </span>
                                                    )
                                                )}

                                                {(!admin.permissions ||
                                                    admin
                                                        .permissions
                                                        .length ===
                                                        0) && (
                                                    <span className="text-xs text-gray-400">
                                                        No permissions assigned
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openPermissionEditor(
                                                        admin
                                                    )
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                Permissions
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleRevoke(
                                                        admin.id
                                                    )
                                                }
                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* =================================================
                PERMISSION MODAL
            ================================================= */}

            {selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                Manage Permissions
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {
                                    selectedAdmin.name
                                }
                            </p>
                        </div>

                        <div className="space-y-3">
                            {Object.values(
                                ADMIN_PERMISSIONS
                            ).map(
                                (
                                    permission
                                ) => (
                                    <label
                                        key={
                                            permission
                                        }
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(
                                                permission
                                            )}
                                            onChange={() =>
                                                togglePermission(
                                                    permission
                                                )
                                            }
                                            className="h-4 w-4"
                                        />

                                        <span className="font-medium text-gray-800">
                                            {
                                                ADMIN_PERMISSION_LABELS[
                                                    permission
                                                ]
                                            }
                                        </span>
                                    </label>
                                )
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={
                                    closePermissionEditor
                                }
                                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleSavePermissions
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Save Permissions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementSystem;