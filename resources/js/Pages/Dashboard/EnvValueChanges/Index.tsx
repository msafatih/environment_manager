import { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { EnvValueChange, PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowUpDown,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Code,
    Eye,
    Filter,
    History,
    Key,
    Layers,
    Search,
    SlidersHorizontal,
    Tag,
    User,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Breadcrumb } from "@/Components/Breadcrumb";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface EnvValueChangesIndexProps extends PageProps {
    envValueChanges: EnvValueChange[];
    canShowEnvValueChanges: boolean;
}

const EnvValueChangesIndex = () => {
    const { envValueChanges, canShowEnvValueChanges } =
        usePage<EnvValueChangesIndexProps>().props;

    // State for filtering and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<
        "created_at" | "variable" | "application" | "type"
    >("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [selectedChange, setSelectedChange] = useState<EnvValueChange | null>(
        null
    );
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const ITEMS_PER_PAGE = 10;

    // Get unique change types for filtering
    const changeTypes = useMemo(() => {
        const types = new Set<string>();
        envValueChanges.forEach((change) => {
            types.add(change.type);
        });
        return Array.from(types);
    }, [envValueChanges]);

    // Client-side filtering
    const filteredChanges = useMemo(() => {
        return envValueChanges.filter((change) => {
            const matchesSearch =
                searchTerm === "" ||
                change.env_value?.env_variable?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                change.env_value?.access_key?.key
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                change.env_value?.access_key?.application?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                change.user?.full_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType =
                filterType === null || change.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [envValueChanges, searchTerm, filterType]);

    // Client-side sorting
    const sortedChanges = useMemo(() => {
        return [...filteredChanges].sort((a, b) => {
            if (sortField === "created_at") {
                return sortDirection === "asc"
                    ? new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime();
            } else if (sortField === "variable") {
                return sortDirection === "asc"
                    ? (a.env_value?.env_variable?.name || "").localeCompare(
                          b.env_value?.env_variable?.name || ""
                      )
                    : (b.env_value?.env_variable?.name || "").localeCompare(
                          a.env_value?.env_variable?.name || ""
                      );
            } else if (sortField === "application") {
                return sortDirection === "asc"
                    ? (
                          a.env_value?.access_key?.application?.name || ""
                      ).localeCompare(
                          b.env_value?.access_key?.application?.name || ""
                      )
                    : (
                          b.env_value?.access_key?.application?.name || ""
                      ).localeCompare(
                          a.env_value?.access_key?.application?.name || ""
                      );
            } else {
                // sort by type
                return sortDirection === "asc"
                    ? (a.type || "").localeCompare(b.type || "")
                    : (b.type || "").localeCompare(a.type || "");
            }
        });
    }, [filteredChanges, sortField, sortDirection]);

    // Client-side pagination
    const paginatedChanges = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedChanges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedChanges, currentPage]);

    // Calculate pagination details
    const totalPages = Math.ceil(sortedChanges.length / ITEMS_PER_PAGE);
    const startItem =
        sortedChanges.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endItem = Math.min(
        currentPage * ITEMS_PER_PAGE,
        sortedChanges.length
    );

    // Reset to first page when search term or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    // Handle sorting
    const handleSort = (
        field: "created_at" | "variable" | "application" | "type"
    ) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc"); // Default to desc when changing fields
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Format time for display
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    // Get badge color based on change type
    const getChangeTypeBadgeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "create":
                return "bg-green-100 text-green-800 border-green-200";
            case "update":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "delete":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // View change details
    const viewChangeDetails = (change: EnvValueChange) => {
        setSelectedChange(change);
        setIsViewModalOpen(true);
    };

    // Mask sensitive values
    const maskValue = (value: string) => {
        if (!value) return "";
        if (value.length <= 4) return "****";
        return (
            value.substring(0, 2) + "****" + value.substring(value.length - 2)
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
                                {sortedChanges.length}
                            </span>{" "}
                            changes
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
            <Head title="Environment Value Changes" />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        label: "Applications",
                        href: route("applications.index"),
                    },
                    { label: "Environment Changes" },
                ]}
            />

            {/* Header Banner */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative z-10 px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Environment Changes
                        </h1>
                        <p className="mt-2 max-w-2xl text-purple-100">
                            Track and audit changes made to environment
                            variables across all applications.
                        </p>
                    </div>
                </div>

                {/* Stats/Overview Cards */}
                <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 px-6 pb-8 sm:px-8 sm:grid-cols-4">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Total Changes
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {envValueChanges.length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Create Operations
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    envValueChanges.filter(
                                        (c) => c.type === "create"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Update Operations
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    envValueChanges.filter(
                                        (c) => c.type === "update"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="text-sm font-medium text-white/70">
                            Delete Operations
                        </div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-white">
                                {
                                    envValueChanges.filter(
                                        (c) => c.type === "delete"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Change Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600" />
                            Change Details
                        </DialogTitle>
                        <DialogDescription>
                            View the details of this environment variable
                            change.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedChange && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Variable
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Code className="h-4 w-4 text-indigo-500" />
                                        <span className="font-medium">
                                            {
                                                selectedChange.env_value
                                                    ?.env_variable?.name
                                            }
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Application
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Layers className="h-4 w-4 text-indigo-500" />
                                        <Link
                                            href={route(
                                                "applications.show",
                                                selectedChange.env_value
                                                    ?.access_key?.application
                                                    ?.id
                                            )}
                                            className="font-medium text-indigo-600 hover:underline"
                                        >
                                            {
                                                selectedChange.env_value
                                                    ?.access_key?.application
                                                    ?.name
                                            }
                                        </Link>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Environment
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Tag className="h-4 w-4 text-indigo-500" />
                                        <span>
                                            {
                                                selectedChange.env_value
                                                    ?.access_key?.env_type?.name
                                            }
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Access Key
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Key className="h-4 w-4 text-indigo-500" />
                                        <span className="text-sm font-mono">
                                            {selectedChange.env_value?.access_key?.key?.substring(
                                                0,
                                                8
                                            )}
                                            ...
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Change Type
                                    </h4>
                                    <p className="mt-1">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                getChangeTypeBadgeColor(
                                                    selectedChange.type
                                                )
                                            )}
                                        >
                                            {selectedChange.type}
                                        </Badge>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Changed By
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        <span>
                                            {selectedChange.user?.full_name}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Date
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        <span>
                                            {formatDate(
                                                selectedChange.created_at
                                            )}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Time
                                    </h4>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        <span>
                                            {formatTime(
                                                selectedChange.created_at
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">
                                    Value Changes
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border rounded-md p-3 bg-gray-50">
                                        <h5 className="text-xs font-medium text-gray-500 mb-1">
                                            Old Value
                                        </h5>
                                        <div className="font-mono text-sm bg-white p-2 rounded border overflow-x-auto">
                                            {selectedChange.type ===
                                            "create" ? (
                                                <span className="text-gray-400 italic">
                                                    N/A (New Variable)
                                                </span>
                                            ) : (
                                                <span>
                                                    {maskValue(
                                                        selectedChange.old_value
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border rounded-md p-3 bg-gray-50">
                                        <h5 className="text-xs font-medium text-gray-500 mb-1">
                                            New Value
                                        </h5>
                                        <div className="font-mono text-sm bg-white p-2 rounded border overflow-x-auto">
                                            {selectedChange.type ===
                                            "delete" ? (
                                                <span className="text-gray-400 italic">
                                                    N/A (Deleted)
                                                </span>
                                            ) : (
                                                <span>
                                                    {maskValue(
                                                        selectedChange.new_value
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                placeholder="Search changes..."
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
                                            Filter by Type
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px]"
                                >
                                    <DropdownMenuItem
                                        onClick={() => setFilterType(null)}
                                        className={
                                            filterType === null
                                                ? "bg-gray-100"
                                                : ""
                                        }
                                    >
                                        All Types
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {changeTypes.map((type) => (
                                        <DropdownMenuItem
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={
                                                filterType === type
                                                    ? "bg-gray-100"
                                                    : ""
                                            }
                                        >
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType(null);
                                    setSortField("created_at");
                                    setSortDirection("desc");
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
                                    className="cursor-pointer w-[15%]"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <div className="flex items-center gap-1">
                                        Date & Time
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
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("variable")}
                                >
                                    <div className="flex items-center gap-1">
                                        Variable
                                        {sortField === "variable" && (
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
                                    onClick={() => handleSort("application")}
                                >
                                    <div className="flex items-center gap-1">
                                        Application
                                        {sortField === "application" && (
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
                                <TableHead>Environment</TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("type")}
                                >
                                    <div className="flex items-center gap-1">
                                        Type
                                        {sortField === "type" && (
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
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedChanges.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center h-32"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1 text-sm text-gray-500">
                                            <History className="h-8 w-8 text-gray-400" />
                                            <h3 className="font-medium">
                                                No environment changes found
                                            </h3>
                                            <p>
                                                {searchTerm || filterType
                                                    ? "Try adjusting your filters"
                                                    : "No changes have been recorded yet."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedChanges.map((change) => (
                                    <TableRow
                                        key={change.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {formatDate(
                                                        change.created_at
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(
                                                        change.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Code className="h-4 w-4 text-indigo-600" />
                                                <span className="font-medium">
                                                    {
                                                        change.env_value
                                                            ?.env_variable?.name
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {change.env_value?.access_key
                                                ?.application?.id ? (
                                                <Link
                                                    href={route(
                                                        "applications.show",
                                                        change.env_value
                                                            .access_key
                                                            .application.id
                                                    )}
                                                    className="hover:text-indigo-600"
                                                >
                                                    {
                                                        change.env_value
                                                            ?.access_key
                                                            ?.application?.name
                                                    }
                                                </Link>
                                            ) : (
                                                <span>
                                                    {change.env_value
                                                        ?.access_key
                                                        ?.application?.name ||
                                                        "N/A"}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-50"
                                            >
                                                {
                                                    change.env_value?.access_key
                                                        ?.env_type?.name
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    getChangeTypeBadgeColor(
                                                        change.type
                                                    )
                                                )}
                                            >
                                                {change.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full w-6 h-6 bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
                                                    {change.user?.full_name
                                                        ?.charAt(0)
                                                        .toUpperCase() || "U"}
                                                </div>
                                                <span className="text-sm truncate max-w-[120px]">
                                                    {change.user?.full_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8"
                                                            onClick={() =>
                                                                viewChangeDetails(
                                                                    change
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span className="sr-only">
                                                                View Details
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            View Change Details
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {paginatedChanges.length > 0 && (
                    <div className="border-t">
                        <ClientPagination />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
};

export default EnvValueChangesIndex;
