"use client";

import { useState, useEffect, useMemo } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import type { Group, PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Edit,
    Eye,
    Plus,
    Search,
    Trash,
    Users,
    ArrowUpDown,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Breadcrumb } from "@/Components/Breadcrumb";
import { Badge } from "@/Components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface GroupsPageProps extends PageProps {
    groups: Group[];
    canCreateGroup: boolean;
    canEditGroup: boolean;
    canDeleteGroup: boolean;
}

const GroupsIndex = () => {
    const { groups, canCreateGroup, canEditGroup, canDeleteGroup } =
        usePage<GroupsPageProps>().props;

    // State for client-side filtering and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<"name" | "created_at">("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const ITEMS_PER_PAGE = 10;

    // Client-side filtering
    const filteredGroups = useMemo(() => {
        return groups.filter(
            (group) =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (group.description &&
                    group.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        );
    }, [groups, searchTerm]);

    // Client-side sorting
    const sortedGroups = useMemo(() => {
        return [...filteredGroups].sort((a, b) => {
            if (sortField === "name") {
                return sortDirection === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return sortDirection === "asc"
                    ? new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime();
            }
        });
    }, [filteredGroups, sortField, sortDirection]);

    // Client-side pagination
    const paginatedGroups = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedGroups, currentPage]);

    // Calculate pagination details
    const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE);
    const startItem =
        sortedGroups.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, sortedGroups.length);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field: "name" | "created_at") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the group "${name}"?`)) {
            router.delete(route("groups.destroy", id));
        }
    };

    // Generate a gradient background color based on group name
    const getGroupColorGradient = (name: string) => {
        // Simple hash function
        const hash = name.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        // Generate hue from hash
        const hue = Math.abs(hash % 360);
        return `linear-gradient(135deg, hsl(${hue}, 85%, 45%), hsl(${
            (hue + 40) % 360
        }, 85%, 55%))`;
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
                                {sortedGroups.length}
                            </span>{" "}
                            groups
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
            <Head title="Groups" />

            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: "Groups" }]} />

            {/* Page Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Groups
                        </h1>
                        <p className="mt-1.5 max-w-2xl text-indigo-100">
                            Organize environments, manage team access, and
                            streamline deployment pipelines with groups.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center space-x-3">
                        {canCreateGroup && (
                            <Link href={route("groups.create")}>
                                <Button className="shadow-md bg-white text-indigo-600 hover:bg-gray-100 gap-1.5 font-medium">
                                    <Plus className="h-4 w-4" />
                                    <span>Create Group</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by name or description..."
                            className="pl-9 pr-4 py-2 border-gray-200 focus-visible:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                >
                                    <ArrowUpDown className="h-4 w-4" /> Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-3 py-2 text-xs font-medium text-gray-500">
                                    Sort groups by
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleSort("name")}
                                >
                                    Name{" "}
                                    {sortField === "name" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleSort("created_at")}
                                >
                                    Date Created{" "}
                                    {sortField === "created_at" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                        Showing {startItem} to {endItem} of{" "}
                        {sortedGroups.length} groups
                    </div>
                </div>

                {/* Groups Content */}
                {sortedGroups.length > 0 ? (
                    <>
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                            <th
                                                className="px-4 py-3 font-semibold cursor-pointer"
                                                onClick={() =>
                                                    handleSort("name")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Name
                                                    {sortField === "name" && (
                                                        <span className="ml-1">
                                                            {sortDirection ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Members
                                            </th>
                                            <th className="hidden px-4 py-3 font-semibold md:table-cell">
                                                Description
                                            </th>
                                            <th
                                                className="hidden px-4 py-3 font-semibold md:table-cell cursor-pointer"
                                                onClick={() =>
                                                    handleSort("created_at")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Created
                                                    {sortField ===
                                                        "created_at" && (
                                                        <span className="ml-1">
                                                            {sortDirection ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedGroups.map((group) => (
                                            <tr
                                                key={group.id}
                                                className="hover:bg-gray-50/50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <Link
                                                                href={route(
                                                                    "groups.show",
                                                                    group.id
                                                                )}
                                                                className="font-medium text-gray-900 hover:text-indigo-600"
                                                            >
                                                                {group.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    >
                                                        {group.group_members
                                                            ?.length || 0}{" "}
                                                        members
                                                    </Badge>
                                                </td>
                                                <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                                                    {group.description ? (
                                                        <span className="line-clamp-1">
                                                            {group.description}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">
                                                            No description
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 md:table-cell">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                                                        <span>
                                                            {formatDate(
                                                                group.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route(
                                                                                    "groups.show",
                                                                                    group.id
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        <span className="sr-only">
                                                                            View
                                                                        </span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        View
                                                                        group
                                                                        details
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {canEditGroup && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                                                                            onClick={() =>
                                                                                router.visit(
                                                                                    route(
                                                                                        "groups.edit",
                                                                                        group.id
                                                                                    )
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Edit
                                                                            </span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Edit
                                                                            group
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}

                                                        {canDeleteGroup && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    group.id,
                                                                                    group.name
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Delete
                                                                            </span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Delete
                                                                            group
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <ClientPagination />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                            <Users className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="mb-1 text-lg font-medium">
                            No groups found
                        </h3>
                        <p className="mb-6 max-w-md text-gray-500">
                            {searchTerm
                                ? "Try adjusting your search terms or filters"
                                : "Create your first group to start organizing your environments"}
                        </p>
                        {canCreateGroup && !searchTerm && (
                            <Link href={route("groups.create")}>
                                <Button className="shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                                    <Plus className="h-4 w-4" /> Create Your
                                    First Group
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default GroupsIndex;
