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
    DatabaseIcon,
    Globe,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
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
} from "@/Components/ui/tooltip";
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
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

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
        envTypes,
        canEditEnvVariables,
        canCreateEnvVariables,
        canDeleteEnvVariables,
        canEditAccessKeys,
        canCreateAccessKeys,
        canDeleteAccessKeys,
        canEditEnvValues,
    } = usePage<ApplicationsShowProps>().props;

    const [selectedEnvType, setSelectedEnvType] = useState<EnvType | null>(
        null
    );
    const [envValuesLoading, setEnvValuesLoading] = useState(false);
    const [envValues, setEnvValues] = useState<Record<string, EnvValue[]>>({});
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

    // This function will fetch env values by environment type
    const loadEnvValuesByType = (envType: EnvType) => {
        setEnvValuesLoading(true);

        // Check if we've already loaded this environment type
        if (envValues[envType.id]) {
            setSelectedEnvType(envType);
            setEnvValuesLoading(false);
            return;
        }

        // Use fetch instead of axios
        fetch(
            route("applications.envValues.byType", {
                application: application.id,
                envTypeId: envType.id,
            })
        )
            .then((response) => response.json())
            .then((data) => {
                setEnvValues((prev) => ({
                    ...prev,
                    [envType.id]: data,
                }));
                setSelectedEnvType(envType);
            })
            .catch((error) => {
                console.error("Failed to load environment values", error);
            })
            .finally(() => {
                setEnvValuesLoading(false);
            });
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

    // Sort env variables based on sequence
    const filteredEnvVariables =
        application.env_variables
            ?.filter((variable) =>
                variable.name
                    .toLowerCase()
                    .includes(searchVariables.toLowerCase())
            )
            .sort((a, b) => {
                // Handle null sequence values (default to a high number to push to the end)
                const seqA = a.sequence === null ? 999999 : a.sequence;
                const seqB = b.sequence === null ? 999999 : b.sequence;

                // Sort by sequence (ascending order)
                return Number(seqA) - Number(seqB);
            }) || [];

    // Filter access keys based on search
    const filteredAccessKeys =
        application.access_keys?.filter(
            (key) =>
                key.key.toLowerCase().includes(searchKeys.toLowerCase()) ||
                key.env_type?.name
                    ?.toLowerCase()
                    .includes(searchKeys.toLowerCase())
        ) || [];

    // Toggle visibility of secret values
    const toggleSecretVisibility = (id: string) => {
        setShowSecretValues((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

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

    // Copy to clipboard function
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const handleDeleteAccessKey = (accessKey: string | AccessKey) => {
        // Use Inertia.delete to actually send the delete request
        router.delete(
            route("applications.accessKeys.destroy", {
                application: application,
                accessKey: accessKey,
            })
        );
    };

    const handleDeleteEnvVariable = (envVariable: string | AccessKey) => {
        // Use Inertia.delete to actually send the delete request
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

        // Send the update request
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
                    // Update the local state
                    if (selectedEnvType && editingEnvValue) {
                        setEnvValues((prev) => {
                            const updatedValues = [...prev[selectedEnvType.id]];
                            const index = updatedValues.findIndex(
                                (v) => v.id === editingEnvValue.id
                            );
                            if (index !== -1) {
                                updatedValues[index] = {
                                    ...updatedValues[index],
                                    value: editedValue,
                                };
                            }
                            return {
                                ...prev,
                                [selectedEnvType.id]: updatedValues,
                            };
                        });
                    }

                    // Close the dialog
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
                        <div className="flex items-center gap-3 mt-3">
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
                </div>
            </div>

            <Tabs defaultValue="env-variables" className="mb-8">
                <TabsList className="mb-6">
                    <TabsTrigger value="env-variables" className="gap-1.5">
                        <Package className="h-4 w-4" /> Environment Variables
                    </TabsTrigger>
                    <TabsTrigger value="access-keys" className="gap-1.5">
                        <Key className="h-4 w-4" /> Access Keys
                    </TabsTrigger>
                    <TabsTrigger value="details" className="gap-1.5">
                        <Info className="h-4 w-4" /> Details
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
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                                <TableHead>Name</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>
                                                    Last Updated
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredEnvVariables.map(
                                                (variable) => (
                                                    <TableRow key={variable.id}>
                                                        <TableCell className="font-medium">
                                                            {variable.name}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-500">
                                                            {formatDate(
                                                                variable.created_at
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-500">
                                                            {formatDate(
                                                                variable.updated_at
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
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
                                                                                            {
                                                                                                variable.name
                                                                                            }
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
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
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
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Access Keys Tab */}
                <TabsContent value="access-keys">
                    <Card>
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-800">
                                        Access Keys
                                    </CardTitle>
                                    <CardDescription>
                                        Manage access keys for this application
                                    </CardDescription>
                                </div>
                                {canCreateAccessKeys && (
                                    <Link
                                        href={route(
                                            "applications.accessKeys.create",
                                            {
                                                application: application,
                                            }
                                        )}
                                    >
                                        <Button className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                                            <PlusCircle className="h-4 w-4" />
                                            New Access Key
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
                                        placeholder="Search access keys..."
                                        className="pl-10"
                                        value={searchKeys}
                                        onChange={(e) =>
                                            setSearchKeys(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {filteredAccessKeys.length > 0 ? (
                                <div className="rounded-md border overflow-hidden">
                                    {/* Desktop view - Regular table */}
                                    <div className="hidden md:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                                    <TableHead className="w-[250px]">
                                                        Key
                                                    </TableHead>
                                                    <TableHead>
                                                        Environment Type
                                                    </TableHead>
                                                    <TableHead className="w-[120px]">
                                                        Created
                                                    </TableHead>
                                                    <TableHead className="w-[120px] text-right">
                                                        Updated
                                                    </TableHead>
                                                    <TableHead className="w-[80px] text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredAccessKeys.map(
                                                    (key) => (
                                                        <TableRow key={key.id}>
                                                            <TableCell className="font-medium font-mono text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="max-w-xs truncate">
                                                                        {showSecretValues[
                                                                            key
                                                                                .id
                                                                        ]
                                                                            ? key.key
                                                                            : "••••••••••••••••••••"}
                                                                    </div>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7"
                                                                                    onClick={() =>
                                                                                        toggleSecretVisibility(
                                                                                            key.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {showSecretValues[
                                                                                        key
                                                                                            .id
                                                                                    ] ? (
                                                                                        <EyeOff className="h-3.5 w-3.5" />
                                                                                    ) : (
                                                                                        <Eye className="h-3.5 w-3.5" />
                                                                                    )}
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p className="text-xs">
                                                                                    {showSecretValues[
                                                                                        key
                                                                                            .id
                                                                                    ]
                                                                                        ? "Hide"
                                                                                        : "Show"}{" "}
                                                                                    key
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7"
                                                                                    onClick={() =>
                                                                                        copyToClipboard(
                                                                                            key.key
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Copy className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p className="text-xs">
                                                                                    Copy
                                                                                    to
                                                                                    clipboard
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                                >
                                                                    {key
                                                                        .env_type
                                                                        ?.name ||
                                                                        "Unknown"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-500">
                                                                {formatDate(
                                                                    key.created_at
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-500 text-right">
                                                                {formatDate(
                                                                    key.updated_at
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>
                                                                            Actions
                                                                        </DropdownMenuLabel>
                                                                        {canEditAccessKeys && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    (window.location.href =
                                                                                        route(
                                                                                            "applications.accessKeys.edit",
                                                                                            {
                                                                                                application:
                                                                                                    application,
                                                                                                accessKey:
                                                                                                    key,
                                                                                            }
                                                                                        ))
                                                                                }
                                                                            >
                                                                                <Edit className="h-4 w-4 mr-2" />
                                                                                Edit
                                                                                Access
                                                                                Key
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {canDeleteAccessKeys && (
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
                                                                                            Access
                                                                                            Key
                                                                                        </DropdownMenuItem>
                                                                                    </AlertDialogTrigger>
                                                                                    <AlertDialogContent>
                                                                                        <AlertDialogHeader>
                                                                                            <AlertDialogTitle>
                                                                                                Delete
                                                                                                Access
                                                                                                Key
                                                                                            </AlertDialogTitle>
                                                                                            <AlertDialogDescription>
                                                                                                Are
                                                                                                you
                                                                                                sure
                                                                                                you
                                                                                                want
                                                                                                to
                                                                                                delete
                                                                                                this
                                                                                                access
                                                                                                key?
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
                                                                                                    handleDeleteAccessKey(
                                                                                                        key
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
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {/* Mobile view - Card-based layout */}
                                    <div className="md:hidden">
                                        {filteredAccessKeys.map((key) => (
                                            <div
                                                key={key.id}
                                                className="border-b p-4 last:border-b-0"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono text-sm flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="truncate max-w-[150px]">
                                                                {key.key}
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 shrink-0"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        key.key
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-200 mt-1"
                                                        >
                                                            {key.env_type
                                                                ?.name ||
                                                                "Unknown"}
                                                        </Badge>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 mt-0.5"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            {canEditAccessKeys && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        (window.location.href =
                                                                            route(
                                                                                "applications.accessKeys.edit",
                                                                                {
                                                                                    application:
                                                                                        application,
                                                                                    accessKey:
                                                                                        key,
                                                                                }
                                                                            ))
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit Access
                                                                    Key
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canDeleteAccessKeys && (
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
                                                                                Access
                                                                                Key
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>
                                                                                    Delete
                                                                                    Access
                                                                                    Key
                                                                                </AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are
                                                                                    you
                                                                                    sure
                                                                                    you
                                                                                    want
                                                                                    to
                                                                                    delete
                                                                                    this
                                                                                    access
                                                                                    key?
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
                                                                                        handleDeleteAccessKey(
                                                                                            key
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
                                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                    <div>
                                                        <span className="block text-gray-400">
                                                            Created
                                                        </span>
                                                        <span>
                                                            {formatDate(
                                                                key.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-400">
                                                            Updated
                                                        </span>
                                                        <span>
                                                            {formatDate(
                                                                key.updated_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                        <Key className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        No Access Keys
                                    </h3>
                                    <p className="text-gray-500 max-w-md mb-6">
                                        {searchKeys
                                            ? "No access keys match your search criteria."
                                            : "This application doesn't have any access keys yet."}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details">
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

                                <div className="pt-6 border-t">
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Environment Values by Type
                                        </h4>
                                    </div>

                                    {envTypes.length > 0 ? (
                                        <div className="rounded-lg border border-gray-200 shadow-sm bg-gray-50/50 overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Environment Type Selector */}
                                                <div className="w-full md:w-48 lg:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200">
                                                    <div className="p-3 bg-gray-100 border-b border-gray-200">
                                                        <h3 className="text-sm font-medium text-gray-700">
                                                            Environment Types
                                                        </h3>
                                                    </div>
                                                    <div className="p-2">
                                                        {envTypes.map(
                                                            (envType) => (
                                                                <Button
                                                                    key={
                                                                        envType.id
                                                                    }
                                                                    variant={
                                                                        selectedEnvType ===
                                                                        envType
                                                                            ? "default"
                                                                            : "ghost"
                                                                    }
                                                                    className={`w-full justify-start gap-2 text-left mb-1 ${
                                                                        selectedEnvType ===
                                                                        envType
                                                                            ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                                                            : "text-gray-700"
                                                                    }`}
                                                                    onClick={() =>
                                                                        loadEnvValuesByType(
                                                                            envType
                                                                        )
                                                                    }
                                                                >
                                                                    {getEnvTypeIcon(
                                                                        envType.name
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            envType.name
                                                                        }
                                                                    </span>
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Environment Values Display */}
                                                <div className="flex-1 p-5">
                                                    {!selectedEnvType ? (
                                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                                            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                                                <Layers className="h-7 w-7 text-blue-500" />
                                                            </div>
                                                            <h3 className="text-base font-medium text-gray-700 mb-2">
                                                                Select an
                                                                Environment Type
                                                            </h3>
                                                            <p className="text-sm text-gray-500 max-w-md">
                                                                Click on an
                                                                environment type
                                                                from the left to
                                                                view its
                                                                variables and
                                                                values.
                                                            </p>
                                                        </div>
                                                    ) : envValuesLoading ? (
                                                        <div className="flex justify-center items-center py-10">
                                                            <div className="flex items-center gap-3 text-blue-600">
                                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                                <span className="font-medium">
                                                                    Loading
                                                                    environment
                                                                    values...
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center gap-2 mb-5">
                                                                <h3 className="text-lg font-medium text-gray-800">
                                                                    {
                                                                        selectedEnvType?.name
                                                                    }{" "}
                                                                    Variables
                                                                </h3>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                                >
                                                                    {envValues[
                                                                        selectedEnvType
                                                                            ?.id
                                                                    ]?.length ||
                                                                        0}{" "}
                                                                    variables
                                                                </Badge>
                                                            </div>

                                                            {envValues[
                                                                selectedEnvType
                                                                    ?.id
                                                            ]?.length > 0 ? (
                                                                <ScrollArea className="h-96 pr-4">
                                                                    <Accordion
                                                                        type="multiple"
                                                                        className="w-full"
                                                                    >
                                                                        {envValues[
                                                                            selectedEnvType
                                                                                ?.id
                                                                        ]
                                                                            .sort(
                                                                                (
                                                                                    a,
                                                                                    b
                                                                                ) => {
                                                                                    // Sort logic remains the same
                                                                                    const seqA =
                                                                                        a
                                                                                            .env_variable
                                                                                            .sequence ===
                                                                                        null
                                                                                            ? 999999
                                                                                            : a
                                                                                                  .env_variable
                                                                                                  .sequence;
                                                                                    const seqB =
                                                                                        b
                                                                                            .env_variable
                                                                                            .sequence ===
                                                                                        null
                                                                                            ? 999999
                                                                                            : b
                                                                                                  .env_variable
                                                                                                  .sequence;

                                                                                    if (
                                                                                        seqA !==
                                                                                        seqB
                                                                                    ) {
                                                                                        return (
                                                                                            Number(
                                                                                                seqA
                                                                                            ) -
                                                                                            Number(
                                                                                                seqB
                                                                                            )
                                                                                        );
                                                                                    }

                                                                                    return a.env_variable.name.localeCompare(
                                                                                        b
                                                                                            .env_variable
                                                                                            .name
                                                                                    );
                                                                                }
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    envValue
                                                                                ) => (
                                                                                    <AccordionItem
                                                                                        key={
                                                                                            envValue.id
                                                                                        }
                                                                                        value={envValue.id.toString()}
                                                                                        className="border-b border-gray-100 last:border-none"
                                                                                    >
                                                                                        <AccordionTrigger className="py-3 hover:bg-gray-50/70 px-3 -mx-3 rounded-md">
                                                                                            <div className="flex items-center gap-2 text-left">
                                                                                                <DatabaseIcon className="h-4 w-4 text-gray-400" />
                                                                                                <span className="font-mono font-medium">
                                                                                                    {
                                                                                                        envValue
                                                                                                            .env_variable
                                                                                                            .name
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </AccordionTrigger>
                                                                                        <AccordionContent className="pt-3 pb-4">
                                                                                            <div
                                                                                                className="rounded-md bg-gray-50 p-4 font-mono text-sm break-all cursor-pointer hover:bg-gray-100 transition-colors"
                                                                                                onClick={() =>
                                                                                                    canEditEnvValues &&
                                                                                                    handleEditEnvValue(
                                                                                                        envValue
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {showSecretValues[
                                                                                                    `env_${envValue.id}`
                                                                                                ] ? (
                                                                                                    <div className="text-gray-900">
                                                                                                        {envValue.value || (
                                                                                                            <span className="text-gray-400 italic">
                                                                                                                (empty
                                                                                                                value)
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="text-gray-500">
                                                                                                        {envValue.value ? (
                                                                                                            "••••••••••••••••••••"
                                                                                                        ) : (
                                                                                                            <span className="italic">
                                                                                                                (empty
                                                                                                                value)
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                                <div className="flex justify-end gap-1 mt-3">
                                                                                                    <TooltipProvider>
                                                                                                        <Tooltip>
                                                                                                            <TooltipTrigger
                                                                                                                asChild
                                                                                                            >
                                                                                                                <Button
                                                                                                                    variant="ghost"
                                                                                                                    size="icon"
                                                                                                                    className="h-7 w-7"
                                                                                                                    onClick={(
                                                                                                                        e
                                                                                                                    ) => {
                                                                                                                        e.stopPropagation();
                                                                                                                        toggleSecretVisibility(
                                                                                                                            `env_${envValue.id}`
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {showSecretValues[
                                                                                                                        `env_${envValue.id}`
                                                                                                                    ] ? (
                                                                                                                        <EyeOff className="h-3.5 w-3.5" />
                                                                                                                    ) : (
                                                                                                                        <Eye className="h-3.5 w-3.5" />
                                                                                                                    )}
                                                                                                                </Button>
                                                                                                            </TooltipTrigger>
                                                                                                            <TooltipContent>
                                                                                                                <p className="text-xs">
                                                                                                                    {showSecretValues[
                                                                                                                        `env_${envValue.id}`
                                                                                                                    ]
                                                                                                                        ? "Hide"
                                                                                                                        : "Show"}{" "}
                                                                                                                    value
                                                                                                                </p>
                                                                                                            </TooltipContent>
                                                                                                        </Tooltip>
                                                                                                    </TooltipProvider>

                                                                                                    <TooltipProvider>
                                                                                                        <Tooltip>
                                                                                                            <TooltipTrigger
                                                                                                                asChild
                                                                                                            >
                                                                                                                <Button
                                                                                                                    variant="ghost"
                                                                                                                    size="icon"
                                                                                                                    className="h-7 w-7"
                                                                                                                    onClick={(
                                                                                                                        e
                                                                                                                    ) => {
                                                                                                                        e.stopPropagation();
                                                                                                                        copyToClipboard(
                                                                                                                            envValue.value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Copy className="h-3.5 w-3.5" />
                                                                                                                </Button>
                                                                                                            </TooltipTrigger>
                                                                                                            <TooltipContent>
                                                                                                                <p className="text-xs">
                                                                                                                    Copy
                                                                                                                    to
                                                                                                                    clipboard
                                                                                                                </p>
                                                                                                            </TooltipContent>
                                                                                                        </Tooltip>
                                                                                                    </TooltipProvider>

                                                                                                    {canEditEnvValues && (
                                                                                                        <TooltipProvider>
                                                                                                            <Tooltip>
                                                                                                                <TooltipTrigger
                                                                                                                    asChild
                                                                                                                >
                                                                                                                    <Button
                                                                                                                        variant="ghost"
                                                                                                                        size="icon"
                                                                                                                        className="h-7 w-7"
                                                                                                                        onClick={(
                                                                                                                            e
                                                                                                                        ) => {
                                                                                                                            e.stopPropagation();
                                                                                                                            handleEditEnvValue(
                                                                                                                                envValue
                                                                                                                            );
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Edit className="h-3.5 w-3.5" />
                                                                                                                    </Button>
                                                                                                                </TooltipTrigger>
                                                                                                                <TooltipContent>
                                                                                                                    <p className="text-xs">
                                                                                                                        Edit
                                                                                                                        value
                                                                                                                    </p>
                                                                                                                </TooltipContent>
                                                                                                            </Tooltip>
                                                                                                        </TooltipProvider>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                                                                                                <div>
                                                                                                    Sequence:{" "}
                                                                                                    <span className="font-medium text-gray-700">
                                                                                                        {envValue
                                                                                                            .env_variable
                                                                                                            .sequence ||
                                                                                                            "None"}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div>
                                                                                                    Last
                                                                                                    Updated:{" "}
                                                                                                    <span className="font-medium text-gray-700">
                                                                                                        {formatDate(
                                                                                                            envValue.updated_at
                                                                                                        )}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </AccordionContent>
                                                                                    </AccordionItem>
                                                                                )
                                                                            )}
                                                                    </Accordion>
                                                                </ScrollArea>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                                                    <div className="h-14 w-14 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                                                                        <AlertTriangle className="h-7 w-7 text-amber-500" />
                                                                    </div>
                                                                    <h3 className="text-base font-medium text-gray-700 mb-2">
                                                                        No
                                                                        Environment
                                                                        Values
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500 max-w-md">
                                                                        This
                                                                        environment
                                                                        type
                                                                        doesn't
                                                                        have any
                                                                        variable
                                                                        values
                                                                        yet.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center rounded-lg border border-gray-200 bg-gray-50/50">
                                            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <Layers className="h-7 w-7 text-gray-400" />
                                            </div>
                                            <h3 className="text-base font-medium text-gray-700 mb-2">
                                                No Environment Types
                                            </h3>
                                            <p className="text-sm text-gray-500 max-w-md mb-4">
                                                This application doesn't have
                                                any environment types configured
                                                yet.
                                            </p>
                                            {canCreateAccessKeys && (
                                                <Link
                                                    href={route(
                                                        "applications.accessKeys.create",
                                                        {
                                                            application:
                                                                application.id,
                                                        }
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        <Key className="h-3.5 w-3.5" />
                                                        Create Access Key
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
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
                            <Link
                                href={route(
                                    "applications.edit",
                                    application.id
                                )}
                            >
                                <Button variant="outline" className="gap-1.5">
                                    <Edit className="h-4 w-4" /> Edit
                                    Application
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* Edit Environment Value Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Environment Value</DialogTitle>
                        <DialogDescription>
                            {editingEnvValue && (
                                <span className="font-mono text-sm">
                                    {editingEnvValue.env_variable.name}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="env-value"
                                className="text-sm font-medium"
                            >
                                Value
                            </label>
                            <Input
                                id="env-value"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                placeholder="Enter environment value"
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
                            className="gap-1.5"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default ApplicationsShow;
