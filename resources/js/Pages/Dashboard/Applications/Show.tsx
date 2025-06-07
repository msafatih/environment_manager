"use client";

import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type {
    AccessKey,
    Application,
    EnvType,
    EnvValue,
    PageProps,
} from "@/types";
import {
    Edit,
    Package,
    Key,
    Server,
    Clock,
    PlusCircle,
    Info,
    Search,
    FolderClosed,
    History,
    Copy,
    Eye,
    EyeOff,
    MoreHorizontal,
    AppWindow,
    Trash2,
    Layers,
    Settings,
    Monitor,
    Globe,
    CheckCircle,
    AlertTriangle,
    Check,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Breadcrumb } from "@/Components/Breadcrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ApplicationsShowProps extends PageProps {
    application: Application;
    envTypes: EnvType[];
    canEditEnvVariables: boolean;
    canCreateEnvVariables: boolean;
    canDeleteEnvVariables: boolean;
    canEditAccessKeys: boolean;
    canCreateAccessKeys: boolean;
    canDeleteAccessKeys: boolean;
    canEditEnvValues: boolean;
}

const ApplicationsShow = () => {
    const {
        application,
        canEditEnvVariables,
        canCreateEnvVariables,
        canDeleteEnvVariables,
        canEditEnvValues,
    } = usePage<ApplicationsShowProps>().props;

    const [searchVariables, setSearchVariables] = useState("");
    const [searchKeys, setSearchKeys] = useState("");
    const [showSecretValues, setShowSecretValues] = useState<
        Record<string, boolean>
    >({});
    const [editingEnvValue, setEditingEnvValue] = useState<EnvValue | null>(
        null
    );
    const [editedValue, setEditedValue] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    // Filter and sort env variables based on sequence and search
    const filteredEnvVariables =
        application.env_variables
            ?.filter((variable) =>
                variable.name
                    .toLowerCase()
                    .includes(searchVariables.toLowerCase())
            )
            .sort((a, b) => {
                const seqA = a.sequence === null ? 999999 : a.sequence;
                const seqB = b.sequence === null ? 999999 : b.sequence;
                return Number(seqA) - Number(seqB);
            }) || [];

    const filteredAccessKeys =
        application.access_keys?.filter(
            (key) =>
                key.key.toLowerCase().includes(searchKeys.toLowerCase()) ||
                key.env_type?.name
                    ?.toLowerCase()
                    .includes(searchKeys.toLowerCase())
        ) || [];

    // Format date to readable format
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Toggle visibility of secret values
    const toggleSecretVisibility = (id: string) => {
        setShowSecretValues((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Copy to clipboard function
    const copyToClipboard = (text: string, variableName: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(variableName);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const handleDeleteEnvVariable = (envVariable: string | AccessKey) => {
        router.delete(
            route("applications.envVariables.destroy", {
                application: application,
                envVariable: envVariable,
            })
        );
    };

    const handleEditEnvValue = (envValue: EnvValue) => {
        setEditingEnvValue(envValue);
        setEditedValue(envValue.value);
        setIsEditDialogOpen(true);
    };

    const handleSaveEnvValue = () => {
        if (!editingEnvValue) return;

        setIsSubmitting(true);

        router.put(
            route("applications.envValues.update", {
                application: application.id,
                envValue: editingEnvValue.id,
            }),
            {
                value: editedValue,
            },
            {
                onSuccess: () => {
                    // Update local state for immediate UI update
                    const updatedVariables = application.env_variables?.map(
                        (variable) => {
                            if (variable.env_values) {
                                const updatedValues = variable.env_values.map(
                                    (value) => {
                                        if (value.id === editingEnvValue.id) {
                                            return {
                                                ...value,
                                                value: editedValue,
                                            };
                                        }
                                        return value;
                                    }
                                );
                                return {
                                    ...variable,
                                    env_values: updatedValues,
                                };
                            }
                            return variable;
                        }
                    );

                    // Close the dialog and reset state
                    setIsEditDialogOpen(false);
                    setEditingEnvValue(null);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Helper to get environment icon based on name
    const getEnvTypeIcon = (envTypeName: string) => {
        const name = envTypeName.toLowerCase();
        if (name.includes("production")) {
            return <Globe className="h-4 w-4 text-red-500" />;
        } else if (name.includes("staging")) {
            return <Monitor className="h-4 w-4 text-amber-500" />;
        } else if (name.includes("development")) {
            return <Settings className="h-4 w-4 text-blue-500" />;
        } else {
            return <Layers className="h-4 w-4 text-gray-500" />;
        }
    };

    // Helper to render environment value
    const renderEnvValue = (variable: any, envType: string) => {
        const envValue = variable.env_values?.find(
            (value: any) =>
                value.access_key?.env_type?.name?.toLowerCase() ===
                envType.toLowerCase()
        );

        if (!envValue) {
            return (
                <span className="text-gray-400 italic text-xs">Not set</span>
            );
        }

        const valueId = `${envType.charAt(0)}-${envValue.id}`;
        const isValueVisible = showSecretValues[valueId] || false;

        return (
            <div className="flex items-center space-x-1">
                <div
                    className={`font-mono text-sm ${
                        isValueVisible ? "" : "filter blur-[3px]"
                    } transition-all duration-200`}
                >
                    {envValue.value || (
                        <span className="text-gray-400 italic text-xs">
                            Empty
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-0.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-gray-700"
                                    onClick={() =>
                                        toggleSecretVisibility(valueId)
                                    }
                                >
                                    {isValueVisible ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="text-xs">
                                    {isValueVisible
                                        ? "Hide value"
                                        : "Show value"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {envValue.value && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-400 hover:text-gray-700"
                                        onClick={() =>
                                            copyToClipboard(
                                                envValue.value,
                                                variable.name
                                            )
                                        }
                                    >
                                        {copySuccess === variable.name ? (
                                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p className="text-xs">Copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {canEditEnvValues && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                                        onClick={() =>
                                            handleEditEnvValue(envValue)
                                        }
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p className="text-xs">Edit value</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Application: ${application.name}`} />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        label: "Applications",
                        href: route("applications.index"),
                    },
                    { label: application.name },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                                <AppWindow className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                {application.name}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                            >
                                <FolderClosed className="h-3 w-3 mr-1" />{" "}
                                {application.group.name}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                            >
                                <Package className="h-3 w-3 mr-1" />{" "}
                                {filteredEnvVariables.length} Variables
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                            >
                                <Key className="h-3 w-3 mr-1" />{" "}
                                {filteredAccessKeys.length} Keys
                            </Badge>
                        </div>
                        {application.description && (
                            <p className="mt-3 max-w-2xl text-blue-100">
                                {application.description}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={route("applications.index")}>
                            <Button
                                variant="outline"
                                className="gap-1.5 bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="env-variables" className="mb-8">
                <TabsList className="mb-6 grid w-full grid-cols-2 border rounded-lg p-1 bg-gray-50/80 shadow-sm">
                    <TabsTrigger
                        value="env-variables"
                        className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                    >
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            Environment Variables
                        </span>
                        <span className="sm:hidden">Variables</span>
                        <Badge
                            variant="secondary"
                            className="ml-1.5 bg-indigo-100 text-indigo-700 border-indigo-200 hidden md:flex"
                        >
                            {filteredEnvVariables.length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="details"
                        className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                    >
                        <Info className="h-4 w-4" />
                        <span>Details</span>
                    </TabsTrigger>
                </TabsList>

                {/* Environment Variables Tab */}
                <TabsContent value="env-variables">
                    <Card>
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-800">
                                        Environment Variables
                                    </CardTitle>
                                    <CardDescription>
                                        Manage environment variables for this
                                        application
                                    </CardDescription>
                                </div>
                                {canCreateEnvVariables && (
                                    <Link
                                        href={route(
                                            "applications.envVariables.create",
                                            {
                                                application: application,
                                            }
                                        )}
                                    >
                                        <Button className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                                            <PlusCircle className="h-4 w-4" />
                                            New Variable
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search variables..."
                                        className="pl-10"
                                        value={searchVariables}
                                        onChange={(e) =>
                                            setSearchVariables(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {filteredEnvVariables.length > 0 ? (
                                <div className="rounded-md border overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                                    <TableHead className="w-[180px] min-w-[180px]">
                                                        Name
                                                    </TableHead>
                                                    <TableHead className="min-w-[180px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Settings className="h-3.5 w-3.5 text-blue-500" />
                                                            <span>
                                                                Development
                                                            </span>
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="min-w-[180px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Monitor className="h-3.5 w-3.5 text-amber-500" />
                                                            <span>Staging</span>
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="min-w-[180px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Globe className="h-3.5 w-3.5 text-red-500" />
                                                            <span>
                                                                Production
                                                            </span>
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="w-[80px]">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredEnvVariables.map(
                                                    (variable) => (
                                                        <TableRow
                                                            key={variable.id}
                                                            className="group"
                                                        >
                                                            <TableCell className="font-mono font-medium">
                                                                <div className="flex flex-col">
                                                                    <span>
                                                                        {
                                                                            variable.name
                                                                        }
                                                                    </span>
                                                                    {variable.sequence && (
                                                                        <span className="text-xs text-gray-400">
                                                                            Sequence:{" "}
                                                                            {
                                                                                variable.sequence
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {renderEnvValue(
                                                                    variable,
                                                                    "development"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {renderEnvValue(
                                                                    variable,
                                                                    "staging"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {renderEnvValue(
                                                                    variable,
                                                                    "production"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 opacity-70 group-hover:opacity-100"
                                                                            >
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuLabel>
                                                                                Actions
                                                                            </DropdownMenuLabel>
                                                                            {canEditEnvVariables && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() =>
                                                                                        router.get(
                                                                                            route(
                                                                                                "applications.envVariables.edit",
                                                                                                {
                                                                                                    application:
                                                                                                        application,
                                                                                                    envVariable:
                                                                                                        variable,
                                                                                                }
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                                    Edit
                                                                                    Variable
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    (window.location.href =
                                                                                        route(
                                                                                            "env-variables.show",
                                                                                            variable.id
                                                                                        ))
                                                                                }
                                                                            >
                                                                                <History className="h-4 w-4 mr-2" />
                                                                                View
                                                                                History
                                                                            </DropdownMenuItem>
                                                                            {canDeleteEnvVariables && (
                                                                                <>
                                                                                    <DropdownMenuSeparator />
                                                                                    <AlertDialog>
                                                                                        <AlertDialogTrigger
                                                                                            asChild
                                                                                        >
                                                                                            <DropdownMenuItem
                                                                                                className="text-red-600"
                                                                                                onSelect={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    e.preventDefault()
                                                                                                }
                                                                                            >
                                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                                Delete
                                                                                                Variable
                                                                                            </DropdownMenuItem>
                                                                                        </AlertDialogTrigger>
                                                                                        <AlertDialogContent>
                                                                                            <AlertDialogHeader>
                                                                                                <AlertDialogTitle>
                                                                                                    Delete
                                                                                                    Environment
                                                                                                    Variable
                                                                                                </AlertDialogTitle>
                                                                                                <AlertDialogDescription>
                                                                                                    Are
                                                                                                    you
                                                                                                    sure
                                                                                                    you
                                                                                                    want
                                                                                                    to
                                                                                                    delete
                                                                                                    the
                                                                                                    variable
                                                                                                    "
                                                                                                    <span className="font-mono font-semibold">
                                                                                                        {
                                                                                                            variable.name
                                                                                                        }
                                                                                                    </span>
                                                                                                    "?
                                                                                                    This
                                                                                                    action
                                                                                                    cannot
                                                                                                    be
                                                                                                    undone.
                                                                                                </AlertDialogDescription>
                                                                                            </AlertDialogHeader>
                                                                                            <AlertDialogFooter>
                                                                                                <AlertDialogCancel>
                                                                                                    Cancel
                                                                                                </AlertDialogCancel>
                                                                                                <AlertDialogAction
                                                                                                    className="bg-red-600 text-white hover:bg-red-700"
                                                                                                    onClick={() =>
                                                                                                        handleDeleteEnvVariable(
                                                                                                            variable.id
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Delete
                                                                                                </AlertDialogAction>
                                                                                            </AlertDialogFooter>
                                                                                        </AlertDialogContent>
                                                                                    </AlertDialog>
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                        <Package className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        No Environment Variables
                                    </h3>
                                    <p className="text-gray-500 max-w-md mb-6">
                                        {searchVariables
                                            ? "No variables match your search criteria."
                                            : "This application doesn't have any environment variables yet."}
                                    </p>
                                    {canCreateEnvVariables && (
                                        <Link
                                            href={route(
                                                "applications.envVariables.create",
                                                {
                                                    application: application,
                                                }
                                            )}
                                        >
                                            <Button className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                                                <PlusCircle className="h-4 w-4" />
                                                Add First Variable
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Details Tab - unchanged */}
                <TabsContent value="details">
                    {/* You can keep the existing details tab content */}
                    <Card className="w-full">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="text-xl text-gray-800">
                                Application Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-8">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Application Name
                                        </h4>
                                        <p className="text-base font-medium text-gray-900">
                                            {application.name}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Group
                                        </h4>
                                        <p className="text-base font-medium text-gray-900 flex items-center gap-1.5">
                                            <FolderClosed className="h-4 w-4 text-blue-500" />
                                            {application.group.name}
                                        </p>
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Description
                                        </h4>
                                        <p className="text-base text-gray-900">
                                            {application.description || (
                                                <span className="text-gray-400 italic">
                                                    No description provided
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">
                                        Usage Statistics
                                    </h4>
                                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {application
                                                            .env_variables
                                                            ?.length || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Environment Variables
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                                    <Key className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {application.access_keys
                                                            ?.length || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Access Keys
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                                                    <Server className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {application.env_variables?.reduce(
                                                            (acc, variable) =>
                                                                acc +
                                                                (variable
                                                                    .env_values
                                                                    ?.length ||
                                                                    0),
                                                            0
                                                        ) || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Environment Values
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Application Timeline
                                        </h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mt-0.5">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    Application Created
                                                </div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {formatDate(
                                                        application.created_at
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mt-0.5">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    Last Updated
                                                </div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {formatDate(
                                                        application.updated_at
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/80 px-6 py-4 flex justify-between items-center border-t">
                            <div className="text-sm text-gray-500">
                                ID:{" "}
                                <span className="font-mono">
                                    {application.id}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Value Dialog */}
            {canEditEnvValues && (
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Environment Value</DialogTitle>
                            <DialogDescription>
                                Update the value for{" "}
                                <span className="font-mono font-semibold">
                                    {editingEnvValue?.env_variable?.name}
                                </span>{" "}
                                in{" "}
                                <span className="font-semibold">
                                    {
                                        editingEnvValue?.access_key?.env_type
                                            ?.name
                                    }{" "}
                                    environment
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="env-value">Value</Label>
                                <Input
                                    id="env-value"
                                    value={editedValue}
                                    onChange={(e) =>
                                        setEditedValue(e.target.value)
                                    }
                                    placeholder="Enter new value"
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEnvValue}
                                disabled={isSubmitting}
                                className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </AuthenticatedLayout>
    );
};

export default ApplicationsShow;
