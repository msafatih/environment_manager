"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import type { Role, PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    Shield,
    UserCircle,
    Trash2,
    Pencil,
    Filter,
    ArrowUpDown,
    SlidersHorizontal,
    Lock,
    Loader2,
    Save,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Breadcrumb } from "@/Components/Breadcrumb";
import { Card, CardHeader } from "@/Components/ui/card";
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

interface RolesIndexProps extends PageProps {
    roles: Role[];
    canViewRoles: boolean;
    canCreateRoles: boolean;
    canEditRoles: boolean;
    canDeleteRoles: boolean;
}

const RolesIndex = () => {
    const {
        roles,
        canViewRoles,
        canCreateRoles,
        canEditRoles,
        canDeleteRoles,
    } = usePage<RolesIndexProps>().props;

    // Role creation modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Role edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRoleId, setEditRoleId] = useState<number | null>(null);
    const [editRoleName, setEditRoleName] = useState("");
    const [editRoleOriginalName, setEditRoleOriginalName] = useState("");
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

    // Handle role creation submission
    const handleCreateRole = () => {
        if (!roleName.trim()) {
            setFormError("Role name is required");
            return;
        }

        setIsSubmitting(true);
        setFormError("");

        router.post(
            route("roles.store"),
            { name: roleName },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setRoleName("");
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    if (errors.name) {
                        setFormError(errors.name);
                    } else {
                        setFormError("An error occurred. Please try again.");
                    }
                },
            }
        );
    };

    // Open edit modal with role data
    const openEditModal = (role: Role) => {
        setEditRoleId(Number(role.id));
        setEditRoleName(role.name);
        setEditRoleOriginalName(role.name);
        setEditFormError("");
        setIsEditModalOpen(true);
    };

    const handleEditRole = () => {
        if (!editRoleName.trim()) {
            setEditFormError("Role name is required");
            return;
        }

        if (editRoleName === editRoleOriginalName) {
            setIsEditModalOpen(false);
            return;
        }

        setIsEditSubmitting(true);
        setEditFormError("");

        router.put(
            route("roles.update", editRoleId!.toString()),
            { name: editRoleName },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setEditRoleId(null);
                    setEditRoleName("");
                    setEditRoleOriginalName("");
                    setIsEditSubmitting(false);
                },
                onError: (errors) => {
                    setIsEditSubmitting(false);
                    if (errors.name) {
                        setEditFormError(errors.name);
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
    const filteredRoles = useMemo(() => {
        return roles.filter(
            (role) =>
                role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                role.guard_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [roles, searchTerm]);

    // Client-side sorting
    const sortedRoles = useMemo(() => {
        return [...filteredRoles].sort((a, b) => {
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
    }, [filteredRoles, sortField, sortDirection]);

    // Client-side pagination
    const paginatedRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedRoles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedRoles, currentPage]);

    // Calculate pagination details
    const totalPages = Math.ceil(sortedRoles.length / ITEMS_PER_PAGE);
    const startItem =
        sortedRoles.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, sortedRoles.length);

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

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the role "${name}"?`)) {
            router.delete(route("roles.destroy", id));
        }
    };

    // Generate a color for role badge based on name
    const getRoleColorClass = (roleName: string) => {
        const roleColors: { [key: string]: string } = {
            admin: "bg-red-100 text-red-800 border-red-200",
            administrator: "bg-red-100 text-red-800 border-red-200",
            editor: "bg-blue-100 text-blue-800 border-blue-200",
            manager: "bg-purple-100 text-purple-800 border-purple-200",
            user: "bg-green-100 text-green-800 border-green-200",
            viewer: "bg-gray-100 text-gray-800 border-gray-200",
            guest: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };

        return (
            roleColors[roleName.toLowerCase()] ||
            "bg-indigo-100 text-indigo-800 border-indigo-200"
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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
                                {sortedRoles.length}
                            </span>{" "}
                            roles
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
            <Head title="User Roles" />

            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: "Roles" }]} />

            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative z-10 px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            User Roles
                        </h1>
                        <p className="mt-2 max-w-2xl text-indigo-100">
                            Manage system roles and their associated permissions
                            to control user access across the platform.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center space-x-3">
                        {canCreateRoles && (
                            <Button
                                className="shadow-md bg-white text-indigo-600 hover:bg-gray-100 gap-1.5 font-medium"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Role</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats/Overview Cards */}
                <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 px-6 pb-8 sm:px-8 sm:grid-cols-4">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Total Roles
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {roles.length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Admin Roles
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    roles.filter(
                                        (role) =>
                                            role.name
                                                .toLowerCase()
                                                .includes("admin") ||
                                            role.name.toLowerCase() === "super"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            System Roles
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    roles.filter(
                                        (role) => role.guard_name === "web"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            API Roles
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    roles.filter(
                                        (role) => role.guard_name === "api"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Role Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-600" />
                            Create New Role
                        </DialogTitle>
                        <DialogDescription>
                            Enter a name for the new role. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="role-name"
                                className="text-sm font-medium"
                            >
                                Role Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="role-name"
                                ref={inputRef}
                                placeholder="Enter role name"
                                value={roleName}
                                onChange={(e) => {
                                    setRoleName(e.target.value);
                                    setFormError("");
                                }}
                                className={
                                    formError
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                }
                                disabled={isSubmitting}
                            />
                            {formError && (
                                <p className="text-xs text-red-600">
                                    {formError}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setRoleName("");
                                setFormError("");
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateRole}
                            disabled={isSubmitting || !roleName.trim()}
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
                                    Create Role
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-600" />
                            Edit Role
                        </DialogTitle>
                        <DialogDescription>
                            Update the role name. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="edit-role-name"
                                className="text-sm font-medium"
                            >
                                Role Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-role-name"
                                ref={editInputRef}
                                placeholder="Enter role name"
                                value={editRoleName}
                                onChange={(e) => {
                                    setEditRoleName(e.target.value);
                                    setEditFormError("");
                                }}
                                className={
                                    editFormError
                                        ? "border-red-300 focus-visible:ring-red-200"
                                        : ""
                                }
                                disabled={isEditSubmitting}
                            />
                            {editFormError && (
                                <p className="text-xs text-red-600">
                                    {editFormError}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setEditRoleId(null);
                                setEditRoleName("");
                                setEditRoleOriginalName("");
                                setEditFormError("");
                            }}
                            disabled={isEditSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditRole}
                            disabled={
                                isEditSubmitting ||
                                !editRoleName.trim() ||
                                editRoleName === editRoleOriginalName
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
                                placeholder="Search roles..."
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
                                        Role Name
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
                                <TableHead>Users</TableHead>
                                <TableHead>Permissions</TableHead>
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
                            {paginatedRoles.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center h-32"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1 text-sm text-gray-500">
                                            <Shield className="h-8 w-8 text-gray-400" />
                                            <h3 className="font-medium">
                                                No roles found
                                            </h3>
                                            <p>
                                                {searchTerm
                                                    ? `No roles match "${searchTerm}"`
                                                    : "There are no roles defined yet."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedRoles.map((role) => (
                                    <TableRow
                                        key={role.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-md bg-indigo-50 p-2 text-indigo-600">
                                                    <Shield className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <Link
                                                        href={route(
                                                            "roles.show",
                                                            role.id
                                                        )}
                                                        className="font-medium text-gray-900 hover:text-indigo-600"
                                                    >
                                                        {role.name}
                                                    </Link>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "ml-2 font-normal",
                                                            getRoleColorClass(
                                                                role.name
                                                            )
                                                        )}
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-50"
                                            >
                                                {role.guard_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <UserCircle className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">
                                                    {role.users?.length || 0}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">
                                                    {role.permissions?.length ||
                                                        0}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {formatDate(role.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canViewRoles && (
                                                    <Link
                                                        href={route(
                                                            "roles.show",
                                                            role.id
                                                        )}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 gap-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                                        >
                                                            <Shield className="h-3.5 w-3.5" />
                                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                                View
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                )}

                                                {canEditRoles && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1"
                                                        onClick={() =>
                                                            openEditModal(role)
                                                        }
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                )}

                                                {canDeleteRoles &&
                                                    role.name.toLowerCase() !==
                                                        "admin" &&
                                                    role.name.toLowerCase() !==
                                                        "administrator" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-red-200 text-red-600 hover:bg-red-50 gap-1"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role.id,
                                                                    role.name
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

                {paginatedRoles.length > 0 && (
                    <div className="border-t">
                        <ClientPagination />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
};

export default RolesIndex;
