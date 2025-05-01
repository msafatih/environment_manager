"use client";

import { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import {
    ArrowLeft,
    Edit,
    Trash,
    Users,
    Calendar,
    Layers,
    PlusCircle,
    UserPlus,
    MoreHorizontal,
    Search,
    Settings,
    Clock,
    ChevronRight,
    Shield,
    Info,
    Eye,
    Loader2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Breadcrumb } from "@/Components/Breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import type { Application, Group, GroupMember, PageProps } from "@/types";

interface GroupShowProps extends PageProps {
    group: Group;
    canAddGroupMembers: boolean;
    canEditGroupMembers: boolean;
    canDeleteGroupMembers: boolean;
    canAddApplications: boolean;
    canEditApplications: boolean;
    canDeleteApplications: boolean;
}

const GroupShow = () => {
    const {
        group,
        canAddGroupMembers,
        canEditGroupMembers,
        canDeleteGroupMembers,
        canAddApplications,
        canEditApplications,
        canDeleteApplications,
    } = usePage<GroupShowProps>().props;

    const [activeTab, setActiveTab] = useState("members");
    const [memberSearchTerm, setMemberSearchTerm] = useState("");
    const [appSearchTerm, setAppSearchTerm] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
        null
    );
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Track scroll position for sticky header effects
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete the group "${group.name}"?`
            )
        ) {
            router.delete(route("groups.destroy", group.id));
        }
    };
    const handleUpdateRole = () => {
        if (!selectedMember) return;

        setIsUpdating(true);

        router.put(
            route("groups.groupMembers.update", [group, selectedMember]),
            { role: selectedRole },
            {
                onSuccess: () => {
                    setIsEditRoleModalOpen(false);
                    setSelectedMember(null);
                    setIsUpdating(false);
                },
                onError: () => {
                    setIsUpdating(false);
                },
            }
        );
    };

    const handleDeleteMember = (
        groupMember: GroupMember,
        memberName: string
    ) => {
        if (
            confirm(
                `Are you sure you want to remove ${memberName} from this group?`
            )
        ) {
            router.delete(
                route("groups.groupMembers.destroy", [group, groupMember])
            );
        }
    };

    const handleDeleteApplication = (
        application: Application,
        appName: string
    ) => {
        if (
            confirm(
                `Are you sure you want to delete the application "${appName}"?`
            )
        ) {
            router.delete(
                route("groups.applications.destroy", [group, application])
            );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "owner":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "admin":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "member":
                return "bg-green-100 text-green-800 border-green-200";
            case "viewer":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case "owner":
                return <Shield className="h-3 w-3" />;
            case "admin":
                return <Settings className="h-3 w-3" />;
            case "member":
                return <Users className="h-3 w-3" />;
            case "viewer":
                return <Eye className="h-3 w-3" />;
            default:
                return <Info className="h-3 w-3" />;
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Generate a gradient background color based on group name
    const getGroupColorGradient = () => {
        // Simple hash function
        const hash = group.name.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        // Generate hue from hash
        const hue = Math.abs(hash % 360);
        return `linear-gradient(135deg, hsl(${hue}, 80%, 45%), hsl(${
            (hue + 40) % 360
        }, 80%, 55%))`;
    };

    // Filter members based on search term
    const filteredMembers = group.group_members.filter(
        (member) =>
            member.user.full_name
                .toLowerCase()
                .includes(memberSearchTerm.toLowerCase()) ||
            member.user.email
                .toLowerCase()
                .includes(memberSearchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(memberSearchTerm.toLowerCase())
    );

    // Filter applications based on search term
    const filteredApplications = group.applications.filter(
        (app) =>
            app.name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
            (app.description &&
                app.description
                    .toLowerCase()
                    .includes(appSearchTerm.toLowerCase()))
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Group: ${group.name}`} />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: "Groups", href: route("groups.index") },
                    { label: group.name },
                ]}
            />

            {/* Hero Header */}
            <div className="mb-8 relative overflow-hidden rounded-xl bg-white shadow-md">
                <div className="relative z-1 px-6 py-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Group Icon */}
                    <div
                        className="h-24 w-24 flex-shrink-0 rounded-xl shadow-lg flex items-center justify-center text-white"
                        style={{ background: getGroupColorGradient() }}
                    >
                        <Users className="h-10 w-10" />
                    </div>

                    {/* Group Info */}
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                            {group.name}
                        </h1>
                        <p className="text-gray-600 max-w-2xl">
                            {group.description || (
                                <span className="text-gray-400 italic">
                                    No description provided
                                </span>
                            )}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>
                                    Created {formatDate(group.created_at)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                    Updated {formatDate(group.updated_at)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span>
                                    {group.group_members.length} members
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Layers className="h-4 w-4 text-gray-400" />
                                <span>
                                    {group.applications.length} applications
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 mb-1">
                                    Members
                                </span>
                                <span className="text-3xl font-bold">
                                    {group.group_members.length}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    People in this group
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        {canAddGroupMembers && (
                            <CardFooter className="px-0 pt-4 pb-0">
                                <Link
                                    href={route("groups.groupMembers.create", {
                                        group: group,
                                    })}
                                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    Add member{" "}
                                    <ChevronRight className="h-3 w-3" />
                                </Link>
                            </CardFooter>
                        )}
                    </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 mb-1">
                                    Applications
                                </span>
                                <span className="text-3xl font-bold">
                                    {group.applications.length}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    Associated apps
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                <Layers className="h-6 w-6" />
                            </div>
                        </div>
                        {canAddApplications && (
                            <CardFooter className="px-0 pt-4 pb-0">
                                <Link
                                    href={route("groups.applications.create", {
                                        group: group,
                                    })}
                                    className="text-purple-600 text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    Add application{" "}
                                    <ChevronRight className="h-3 w-3" />
                                </Link>
                            </CardFooter>
                        )}
                    </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 mb-1">
                                    Created
                                </span>
                                <span className="text-xl font-bold">
                                    {formatDate(group.created_at)}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    at {formatTime(group.created_at)}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-green-100 text-green-600">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 mb-1">
                                    Updated
                                </span>
                                <span className="text-xl font-bold">
                                    {formatDate(group.updated_at)}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    at {formatTime(group.updated_at)}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                                <Clock className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Members and Applications */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
            >
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 lg:w-auto mb-6">
                    <TabsTrigger
                        value="members"
                        className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Members ({group.group_members.length})</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="applications"
                        className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
                    >
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            <span>
                                Applications ({group.applications.length})
                            </span>
                        </div>
                    </TabsTrigger>
                </TabsList>

                {/* Members Tab */}
                <TabsContent value="members" className="mt-0">
                    <Card className="shadow-sm border-t-4 border-t-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-white px-6 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Group Members
                            </CardTitle>
                            {canAddGroupMembers && (
                                <Link
                                    href={route("groups.groupMembers.create", {
                                        group: group,
                                    })}
                                >
                                    <Button
                                        size="sm"
                                        className="gap-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <UserPlus className="h-4 w-4" /> Add
                                        Member
                                    </Button>
                                </Link>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {group.group_members.length > 0 ? (
                                <>
                                    <div className="border-b p-4 bg-gray-50">
                                        <div className="relative w-full max-w-sm mx-auto">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search members by name, email or role..."
                                                className="pl-10 rounded-full"
                                                value={memberSearchTerm}
                                                onChange={(e) =>
                                                    setMemberSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">
                                                        User
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Role
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Added
                                                    </TableHead>
                                                    <TableHead className="text-right font-semibold">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredMembers.length > 0 ? (
                                                    filteredMembers.map(
                                                        (member) => (
                                                            <TableRow
                                                                key={member.id}
                                                                className="hover:bg-blue-50/40 transition-colors"
                                                            >
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-9 w-9 border shadow-sm">
                                                                            <AvatarFallback className="bg-blue-100 text-blue-800">
                                                                                {getInitials(
                                                                                    member
                                                                                        .user
                                                                                        .full_name
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <div className="font-medium">
                                                                                {
                                                                                    member
                                                                                        .user
                                                                                        .full_name
                                                                                }
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {
                                                                                    member
                                                                                        .user
                                                                                        .email
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        className={`${getRoleColor(
                                                                            member.role
                                                                        )} inline-flex items-center gap-1`}
                                                                    >
                                                                        {getRoleIcon(
                                                                            member.role
                                                                        )}
                                                                        {
                                                                            member.role
                                                                        }
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-500">
                                                                    {formatDate(
                                                                        member.created_at
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 rounded-full"
                                                                            >
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                                <span className="sr-only">
                                                                                    Actions
                                                                                </span>
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent
                                                                            align="end"
                                                                            className="w-40"
                                                                        >
                                                                            {canEditGroupMembers && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedMember(
                                                                                            member
                                                                                        );
                                                                                        setSelectedRole(
                                                                                            member.role
                                                                                        );
                                                                                        setIsEditRoleModalOpen(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <Edit className="mr-2 h-4 w-4" />{" "}
                                                                                    Edit
                                                                                    Role
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {canDeleteGroupMembers && (
                                                                                <>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem
                                                                                        className="text-red-600"
                                                                                        onClick={() =>
                                                                                            handleDeleteMember(
                                                                                                member,
                                                                                                member
                                                                                                    .user
                                                                                                    .full_name
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Trash className="mr-2 h-4 w-4" />{" "}
                                                                                        Remove
                                                                                        Member
                                                                                    </DropdownMenuItem>
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={4}
                                                            className="h-32 text-center"
                                                        >
                                                            <div className="flex flex-col items-center justify-center">
                                                                <Search className="h-8 w-8 text-gray-300 mb-2" />
                                                                <p className="text-gray-500 mb-1">
                                                                    No members
                                                                    match your
                                                                    search
                                                                </p>
                                                                <p className="text-sm text-gray-400">
                                                                    Try a
                                                                    different
                                                                    search term
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">
                                        No members yet
                                    </h3>
                                    <p className="text-gray-500 max-w-sm mb-6">
                                        This group doesn't have any members yet.
                                        Add members to grant them access to
                                        group resources.
                                    </p>
                                    {canAddGroupMembers && (
                                        <Link
                                            href={route(
                                                "groups.groupMembers.create",
                                                { group: group }
                                            )}
                                        >
                                            <Button className="gap-1 bg-blue-600 hover:bg-blue-700">
                                                <UserPlus className="h-4 w-4" />{" "}
                                                Add First Member
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications" className="mt-0">
                    <Card className="shadow-sm border-t-4 border-t-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-white px-6 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layers className="h-5 w-5 text-purple-600" />
                                Applications
                            </CardTitle>
                            {canAddApplications && (
                                <Link
                                    href={route("groups.applications.create", {
                                        group: group,
                                    })}
                                >
                                    <Button
                                        size="sm"
                                        className="gap-1 bg-purple-600 hover:bg-purple-700"
                                    >
                                        <PlusCircle className="h-4 w-4" /> Add
                                        Application
                                    </Button>
                                </Link>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {group.applications.length > 0 ? (
                                <>
                                    <div className="border-b p-4 bg-gray-50">
                                        <div className="relative w-full max-w-sm mx-auto">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search applications..."
                                                className="pl-10 rounded-full"
                                                value={appSearchTerm}
                                                onChange={(e) =>
                                                    setAppSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                        {filteredApplications.length > 0 ? (
                                            filteredApplications.map((app) => (
                                                <Card
                                                    key={app.id}
                                                    className="overflow-hidden hover:shadow-md transition-shadow border"
                                                >
                                                    <CardHeader className="p-4 pb-2 border-b bg-gray-50">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <CardTitle className="text-base font-semibold">
                                                                    {app.name}
                                                                </CardTitle>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Added{" "}
                                                                    {formatDate(
                                                                        app.created_at
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 rounded-full"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">
                                                                            Actions
                                                                        </span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-48"
                                                                >
                                                                    {canEditApplications && (
                                                                        <DropdownMenuItem
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={route(
                                                                                    "groups.applications.edit",
                                                                                    [
                                                                                        group,
                                                                                        app,
                                                                                    ]
                                                                                )}
                                                                            >
                                                                                <Edit className="mr-2 h-4 w-4" />{" "}
                                                                                Edit
                                                                                Application
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {canDeleteApplications && (
                                                                        <>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                className="text-red-600"
                                                                                onClick={() =>
                                                                                    handleDeleteApplication(
                                                                                        app,
                                                                                        app.name
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash className="mr-2 h-4 w-4" />{" "}
                                                                                Delete
                                                                                Application
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-3">
                                                        <div className="text-sm text-gray-600 mb-4 min-h-[40px]">
                                                            {app.description ? (
                                                                app.description
                                                            ) : (
                                                                <span className="text-gray-400 italic">
                                                                    No
                                                                    description
                                                                    provided
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                                                <Search className="h-8 w-8 text-gray-300 mb-2" />
                                                <p className="text-gray-500 mb-1">
                                                    No applications match your
                                                    search
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Try a different search term
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                        <Layers className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">
                                        No applications yet
                                    </h3>
                                    <p className="text-gray-500 max-w-sm mb-6">
                                        This group doesn't have any applications
                                        yet. Add applications to organize your
                                        software resources.
                                    </p>
                                    {canAddApplications && (
                                        <Link
                                            href={route(
                                                "groups.applications.create",
                                                { group: group }
                                            )}
                                        >
                                            <Button className="gap-1 bg-purple-600 hover:bg-purple-700">
                                                <PlusCircle className="h-4 w-4" />{" "}
                                                Add First Application
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Back to Groups button */}
            <div className="flex justify-center mt-8">
                <Link href={route("groups.index")}>
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Groups
                    </Button>
                </Link>
            </div>
            {/* Edit Role Modal */}
            <Dialog
                open={isEditRoleModalOpen}
                onOpenChange={setIsEditRoleModalOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Member Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        {selectedMember && (
                            <>
                                <div className="flex items-center space-x-3 mb-4">
                                    <Avatar className="h-10 w-10 border shadow-sm">
                                        <AvatarFallback className="bg-blue-100 text-blue-800">
                                            {getInitials(
                                                selectedMember.user.full_name
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">
                                            {selectedMember.user.full_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {selectedMember.user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={selectedRole}
                                        onValueChange={setSelectedRole}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="owner">
                                                Owner
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="editor">
                                                Editor
                                            </SelectItem>
                                            <SelectItem value="member">
                                                Member
                                            </SelectItem>
                                            <SelectItem value="viewer">
                                                Viewer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        Group role determines what actions the
                                        user can perform
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditRoleModalOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleUpdateRole}
                            disabled={
                                isUpdating ||
                                selectedRole === selectedMember?.role
                            }
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Role"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default GroupShow;
