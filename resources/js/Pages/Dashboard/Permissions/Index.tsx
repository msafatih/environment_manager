"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import type { Permission, PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    Lock,
    Trash2,
    Pencil,
    Filter,
    ArrowUpDown,
    SlidersHorizontal,
    Shield,
    Loader2,
    Save,
    X,
    LockKeyhole,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Breadcrumb } from "@/Components/Breadcrumb";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PermissionsIndexProps extends PageProps {
    permissions: Permission[];
    canCreatePermissions: boolean;
    canEditPermissions: boolean;
    canDeletePermissions: boolean;
}

const PermissionsIndex = () => {
    const {
        permissions,
        canCreatePermissions,
        canEditPermissions,
        canDeletePermissions,
    } = usePage<PermissionsIndexProps>().props;

    // Permission creation modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [permissionName, setPermissionName] = useState("");
    const [guardName, setGuardName] = useState("web");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Permission edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPermissionId, setEditPermissionId] = useState<number | null>(
        null
    );
    const [editPermissionName, setEditPermissionName] = useState("");
    const [editGuardName, setEditGuardName] = useState("");
    const [editPermissionOriginalName, setEditPermissionOriginalName] =
        useState("");
    const [editPermissionOriginalGuard, setEditPermissionOriginalGuard] =
        useState("");
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editFormError, setEditFormError] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);

    // State for client-side filtering and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<
        "name" | "guard_name" | "created_at"
    >("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const ITEMS_PER_PAGE = 10;

    // Focus on the input field when create modal opens
    useEffect(() => {
        if (isCreateModalOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isCreateModalOpen]);

    // Focus on the input field when edit modal opens
    useEffect(() => {
        if (isEditModalOpen && editInputRef.current) {
            setTimeout(() => {
                editInputRef.current?.focus();
            }, 100);
        }
    }, [isEditModalOpen]);

    // Handle permission creation submission
    const handleCreatePermission = () => {
        if (!permissionName.trim()) {
            setFormError("Permission name is required");
            return;
        }

        setIsSubmitting(true);
        setFormError("");

        router.post(
            route("permissions.store"),
            { name: permissionName, guard_name: guardName },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setPermissionName("");
                    setGuardName("web");
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    if (errors.name) {
                        setFormError(errors.name);
                    } else if (errors.guard_name) {
                        setFormError(errors.guard_name);
                    } else {
                        setFormError("An error occurred. Please try again.");
                    }
                },
            }
        );
    };

    // Open edit modal with permission data
    const openEditModal = (permission: Permission) => {
        setEditPermissionId(permission.id);
        setEditPermissionName(permission.name);
        setEditGuardName(permission.guard_name);
        setEditPermissionOriginalName(permission.name);
        setEditPermissionOriginalGuard(permission.guard_name);
        setEditFormError("");
        setIsEditModalOpen(true);
    };

    // Handle permission edit submission
    const handleEditPermission = () => {
        if (!editPermissionName.trim()) {
            setEditFormError("Permission name is required");
            return;
        }

        if (
            editPermissionName === editPermissionOriginalName &&
            editGuardName === editPermissionOriginalGuard
        ) {
            setIsEditModalOpen(false);
            return;
        }

        setIsEditSubmitting(true);
        setEditFormError("");

        router.put(
            route("permissions.update", editPermissionId?.toString()),
            { name: editPermissionName, guard_name: editGuardName },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setEditPermissionId(null);
                    setEditPermissionName("");
                    setEditGuardName("");
                    setEditPermissionOriginalName("");
                    setEditPermissionOriginalGuard("");
                    setIsEditSubmitting(false);
                },
                onError: (errors) => {
                    setIsEditSubmitting(false);
                    if (errors.name) {
                        setEditFormError(errors.name);
                    } else if (errors.guard_name) {
                        setEditFormError(errors.guard_name);
                    } else {
                        setEditFormError(
                            "An error occurred. Please try again."
                        );
                    }
                },
            }
        );
    };

    // Client-side filtering
    const filteredPermissions = useMemo(() => {
        return permissions.filter(
            (permission) =>
                permission.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                permission.guard_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [permissions, searchTerm]);

    // Client-side sorting
    const sortedPermissions = useMemo(() => {
        return [...filteredPermissions].sort((a, b) => {
            if (sortField === "name") {
                return sortDirection === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortField === "guard_name") {
                return sortDirection === "asc"
                    ? a.guard_name.localeCompare(b.guard_name)
                    : b.guard_name.localeCompare(a.guard_name);
            } else {
                return sortDirection === "asc"
                    ? new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime();
            }
        });
    }, [filteredPermissions, sortField, sortDirection]);

    // Client-side pagination
    const paginatedPermissions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedPermissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedPermissions, currentPage]);

    // Calculate pagination details
    const totalPages = Math.ceil(sortedPermissions.length / ITEMS_PER_PAGE);
    const startItem =
        sortedPermissions.length > 0
            ? (currentPage - 1) * ITEMS_PER_PAGE + 1
            : 0;
    const endItem = Math.min(
        currentPage * ITEMS_PER_PAGE,
        sortedPermissions.length
    );

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field: "name" | "guard_name" | "created_at") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(`Are you sure you want to delete the permission "${name}"?`)
        ) {
            router.delete(route("permissions.destroy", id));
        }
    };

    // Group permissions by category
    const permissionsByCategory = useMemo(() => {
        const grouped: Record<string, number> = {};

        permissions.forEach((permission) => {
            // Extract category from permission name (e.g., "create-users" -> "users")
            const parts = permission.name.split("-");
            if (parts.length >= 2) {
                const category = parts[1];
                if (!grouped[category]) {
                    grouped[category] = 0;
                }
                grouped[category]++;
            } else {
                if (!grouped.other) {
                    grouped.other = 0;
                }
                grouped.other++;
            }
        });

        return grouped;
    }, [permissions]);

    // Get guard counts
    const guardCounts = useMemo(() => {
        const counts: Record<string, number> = {};

        permissions.forEach((permission) => {
            if (!counts[permission.guard_name]) {
                counts[permission.guard_name] = 0;
            }
            counts[permission.guard_name]++;
        });

        return counts;
    }, [permissions]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get a color for permission badge based on guard name
    const getGuardColorClass = (guardName: string) => {
        const guardColors: { [key: string]: string } = {
            web: "bg-blue-100 text-blue-800 border-blue-200",
            api: "bg-green-100 text-green-800 border-green-200",
            sanctum: "bg-purple-100 text-purple-800 border-purple-200",
        };

        return (
            guardColors[guardName.toLowerCase()] ||
            "bg-gray-100 text-gray-800 border-gray-200"
        );
    };

    // Get permission category
    const getPermissionCategory = (permissionName: string): string => {
        const parts = permissionName.split("-");
        if (parts.length >= 2) {
            return parts[1];
        }
        return "other";
    };

    // Get permission action
    const getPermissionAction = (permissionName: string): string => {
        const parts = permissionName.split("-");
        if (parts.length >= 1) {
            return parts[0];
        }
        return permissionName;
    };

    // Get color for permission action
    const getActionColorClass = (action: string) => {
        const actionColors: { [key: string]: string } = {
            create: "bg-green-100 text-green-800 border-green-200",
            edit: "bg-blue-100 text-blue-800 border-blue-200",
            update: "bg-blue-100 text-blue-800 border-blue-200",
            delete: "bg-red-100 text-red-800 border-red-200",
            view: "bg-indigo-100 text-indigo-800 border-indigo-200",
            list: "bg-purple-100 text-purple-800 border-purple-200",
            manage: "bg-amber-100 text-amber-800 border-amber-200",
        };

        return (
            actionColors[action.toLowerCase()] ||
            "bg-gray-100 text-gray-800 border-gray-200"
        );
    };

    // Generate pagination links
    const generatePaginationLinks = () => {
        const links = [];

        // Previous button
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "Previous",
            active: false,
            onClick: () => currentPage > 1 && setCurrentPage(currentPage - 1),
        });

        // First page
        links.push({
            url: "#",
            label: "1",
            active: currentPage === 1,
            onClick: () => setCurrentPage(1),
        });

        // Ellipsis after first page
        if (currentPage > 3) {
            links.push({
                url: null,
                label: "...",
                active: false,
                onClick: () => {},
            });
        }

        // Pages around current page
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (i === 1 || i === totalPages) continue; // Skip first and last page as they're added separately
            links.push({
                url: "#",
                label: i.toString(),
                active: currentPage === i,
                onClick: () => setCurrentPage(i),
            });
        }

        // Ellipsis before last page
        if (currentPage < totalPages - 2) {
            links.push({
                url: null,
                label: "...",
                active: false,
                onClick: () => {},
            });
        }

        // Last page (if more than one page)
        if (totalPages > 1) {
            links.push({
                url: "#",
                label: totalPages.toString(),
                active: currentPage === totalPages,
                onClick: () => setCurrentPage(totalPages),
            });
        }

        // Next button
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next",
            active: false,
            onClick: () =>
                currentPage < totalPages && setCurrentPage(currentPage + 1),
        });

        return links;
    };

    // Custom pagination component
    const ClientPagination = () => {
        const links = generatePaginationLinks();

        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between px-2 py-3">
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            currentPage < totalPages &&
                            setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">{startItem}</span> to{" "}
                            <span className="font-medium">{endItem}</span> of{" "}
                            <span className="font-medium">
                                {sortedPermissions.length}
                            </span>{" "}
                            permissions
                        </p>
                    </div>
                    <div>
                        <nav
                            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                            aria-label="Pagination"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-l-md"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    currentPage > 1 &&
                                    setCurrentPage(currentPage - 1)
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </Button>

                            {links.slice(1, -1).map((link, i) => {
                                // Skip the first and last items (Previous/Next buttons)
                                if (link.label === "...") {
                                    return (
                                        <Button
                                            key={`ellipsis-${i}`}
                                            variant="outline"
                                            size="icon"
                                            className="cursor-default"
                                            disabled
                                        >
                                            <span className="text-xs">...</span>
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={`page-${link.label}`}
                                        variant={
                                            link.active ? "default" : "outline"
                                        }
                                        size="icon"
                                        onClick={link.onClick}
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-r-md"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    currentPage < totalPages &&
                                    setCurrentPage(currentPage + 1)
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next</span>
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Permissions" />

            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: "Permissions" }]} />

            {/* Header Banner */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative z-10 px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Permissions
                        </h1>
                        <p className="mt-2 max-w-2xl text-emerald-100">
                            Manage system permissions to define granular access
                            control for users and roles.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center space-x-3">
                        {canCreatePermissions && (
                            <Button
                                className="shadow-md bg-white text-emerald-600 hover:bg-gray-100 gap-1.5 font-medium"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Permission</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats/Overview Cards */}
                <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 px-6 pb-8 sm:px-8 sm:grid-cols-4">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Total Permissions
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {permissions.length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Categories
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {Object.keys(permissionsByCategory).length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Web Guard
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {guardCounts["web"] || 0}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            API Guard
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {guardCounts["api"] || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Permission Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-emerald-600" />
                            Create Permission
                        </DialogTitle>
                        <DialogDescription>
                            Define a new permission for your application.
                            Permissions control what actions users can perform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="permission-name"
                                className="text-sm font-medium"
                            >
                                Permission Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="permission-name"
                                ref={inputRef}
                                placeholder="e.g., create-users, view-reports"
                                value={permissionName}
                                onChange={(e) => {
                                    setPermissionName(e.target.value);
                                    setFormError("");
                                }}
                                className={
                                    formError && formError.includes("name")
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                }
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-gray-500">
                                Use format: action-resource (e.g., create-users)
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="guard-name"
                                className="text-sm font-medium"
                            >
                                Guard <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="guard-name"
                                value={guardName}
                                onChange={(e) => {
                                    setGuardName(e.target.value);
                                    setFormError("");
                                }}
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    formError && formError.includes("guard")
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                )}
                                disabled={isSubmitting}
                            >
                                <option value="web">Web</option>
                                <option value="api">API</option>
                                <option value="sanctum">Sanctum</option>
                            </select>
                        </div>

                        {formError && (
                            <p className="text-xs text-red-600">{formError}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setPermissionName("");
                                setGuardName("web");
                                setFormError("");
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreatePermission}
                            disabled={isSubmitting || !permissionName.trim()}
                            className="gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create Permission
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Permission Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-emerald-600" />
                            Edit Permission
                        </DialogTitle>
                        <DialogDescription>
                            Update the permission name or guard. Be careful as
                            this may affect existing roles and users.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="edit-permission-name"
                                className="text-sm font-medium"
                            >
                                Permission Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-permission-name"
                                ref={editInputRef}
                                placeholder="e.g., create-users, view-reports"
                                value={editPermissionName}
                                onChange={(e) => {
                                    setEditPermissionName(e.target.value);
                                    setEditFormError("");
                                }}
                                className={
                                    editFormError &&
                                    editFormError.includes("name")
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                }
                                disabled={isEditSubmitting}
                            />
                            <p className="text-xs text-gray-500">
                                Use format: action-resource (e.g., create-users)
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="edit-guard-name"
                                className="text-sm font-medium"
                            >
                                Guard <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="edit-guard-name"
                                value={editGuardName}
                                onChange={(e) => {
                                    setEditGuardName(e.target.value);
                                    setEditFormError("");
                                }}
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    editFormError &&
                                        editFormError.includes("guard")
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                )}
                                disabled={isEditSubmitting}
                            >
                                <option value="web">Web</option>
                                <option value="api">API</option>
                                <option value="sanctum">Sanctum</option>
                            </select>
                        </div>

                        {editFormError && (
                            <p className="text-xs text-red-600">
                                {editFormError}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setEditPermissionId(null);
                                setEditPermissionName("");
                                setEditGuardName("");
                                setEditPermissionOriginalName("");
                                setEditPermissionOriginalGuard("");
                                setEditFormError("");
                            }}
                            disabled={isEditSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditPermission}
                            disabled={
                                isEditSubmitting ||
                                !editPermissionName.trim() ||
                                (editPermissionName ===
                                    editPermissionOriginalName &&
                                    editGuardName ===
                                        editPermissionOriginalGuard)
                            }
                            className="gap-2"
                        >
                            {isEditSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Content */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b bg-gray-50/80 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search permissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 border-dashed gap-1"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            View Options
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px]"
                                >
                                    <DropdownMenuItem
                                        onClick={() => setSortField("name")}
                                    >
                                        Sort by name
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setSortField("guard_name")
                                        }
                                    >
                                        Sort by guard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setSortField("created_at")
                                        }
                                    >
                                        Sort by creation date
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setSortDirection("asc")}
                                    >
                                        Ascending order
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setSortDirection("desc")}
                                    >
                                        Descending order
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSortField("name");
                                    setSortDirection("asc");
                                    setCurrentPage(1);
                                }}
                                title="Reset filters"
                                className="h-9 w-9"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <div className="overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="w-[40%] cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1">
                                        Permission Name
                                        {sortField === "name" && (
                                            <ArrowUpDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    sortDirection === "desc" &&
                                                        "transform -rotate-180"
                                                )}
                                            />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("guard_name")}
                                >
                                    <div className="flex items-center gap-1">
                                        Guard
                                        {sortField === "guard_name" && (
                                            <ArrowUpDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    sortDirection === "desc" &&
                                                        "transform -rotate-180"
                                                )}
                                            />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <div className="flex items-center gap-1">
                                        Created
                                        {sortField === "created_at" && (
                                            <ArrowUpDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    sortDirection === "desc" &&
                                                        "transform -rotate-180"
                                                )}
                                            />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPermissions.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center h-32"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1 text-sm text-gray-500">
                                            <Lock className="h-8 w-8 text-gray-400" />
                                            <h3 className="font-medium">
                                                No permissions found
                                            </h3>
                                            <p>
                                                {searchTerm
                                                    ? `No permissions match "${searchTerm}"`
                                                    : "There are no permissions defined yet."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPermissions.map((permission) => (
                                    <TableRow
                                        key={permission.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
                                                    <LockKeyhole className="h-5 w-5" />
                                                </div>
                                                <div className="font-medium">
                                                    {permission.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    getGuardColorClass(
                                                        permission.guard_name
                                                    )
                                                )}
                                            >
                                                {permission.guard_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-50"
                                            >
                                                {getPermissionCategory(
                                                    permission.name
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    getActionColorClass(
                                                        getPermissionAction(
                                                            permission.name
                                                        )
                                                    )
                                                )}
                                            >
                                                {getPermissionAction(
                                                    permission.name
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {formatDate(permission.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canEditPermissions && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1"
                                                        onClick={() =>
                                                            openEditModal(
                                                                permission
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                )}

                                                {canDeletePermissions && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-red-200 text-red-600 hover:bg-red-50 gap-1"
                                                        onClick={() =>
                                                            handleDelete(
                                                                permission.id,
                                                                permission.name
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                            Delete
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {paginatedPermissions.length > 0 && (
                    <div className="border-t">
                        <ClientPagination />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
};

export default PermissionsIndex;
