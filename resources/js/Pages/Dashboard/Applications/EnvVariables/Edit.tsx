"use client";

import { useState, useRef, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Application, PageProps } from "@/types";
import {
    ArrowLeft,
    Loader2,
    Check,
    Info,
    CheckCircle2,
    Database,
    Variable,
    AlertTriangle,
    Hash,
    SortAsc,
    Calendar,
    Trash2,
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Breadcrumb } from "@/Components/Breadcrumb";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Progress } from "@/Components/ui/progress";
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

interface EnvVariable {
    id: number;
    name: string;
    sequence: number | null;
    created_at: string;
    updated_at: string;
    application_id: number;
}

interface EditEnvVariablesProps extends PageProps {
    application: Application;
    envVariable: EnvVariable;
}

const EnvVariablesEdit = () => {
    const { application, envVariable } = usePage<EditEnvVariablesProps>().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        application_id: application.id.toString(),
        name: envVariable.name,
        sequence: envVariable.sequence?.toString() || "10",
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(100); // Start at 100% for edit
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Calculate form completion strength
    useEffect(() => {
        let strength = 0;

        if (data.name) {
            strength += 70; // Name has more weight
        }

        if (data.sequence) {
            strength += 30; // Sequence has less weight
        }

        setFormStrength(Math.min(strength, 100));
    }, [data.name, data.sequence]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("applications.envVariables.update", {
                application: application.id,
                envVariable: envVariable.id,
            }),
            {
                onSuccess: () => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                },
            }
        );
    };

    // Format the variable name to follow convention (uppercase with underscores)
    const formatVariableName = (name: string) => {
        return name.trim().toUpperCase().replace(/\s+/g, "_");
    };

    // Helper to check if name follows convention
    const isNameValid = (name: string) => {
        const regex = /^[A-Z][A-Z0-9_]*$/;
        return regex.test(name);
    };

    // Helper to check if form has changes
    const hasChanges = () => {
        return (
            data.name !== envVariable.name ||
            data.sequence?.toString() !==
                (envVariable.sequence?.toString() || "10")
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Environment Variable: ${envVariable.name}`} />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        label: "Applications",
                        href: route("applications.index"),
                    },
                    {
                        label: application.name,
                        href: route("applications.show", application.id),
                    },
                    { label: `Edit ${envVariable.name}` },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                                <Variable className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Edit Environment Variable
                            </h1>
                        </div>
                        <p className="mt-2 max-w-2xl text-purple-100">
                            Editing{" "}
                            <span className="font-mono font-semibold">
                                {envVariable.name}
                            </span>{" "}
                            for{" "}
                            <span className="font-semibold">
                                {application.name}
                            </span>
                            .
                        </p>
                    </div>
                    <Link href={route("applications.show", application.id)}>
                        <Button
                            variant="outline"
                            className="gap-1 bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to
                            Application
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 animate-in fade-in slide-in-from-top-5 duration-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                        Environment variable updated successfully!
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Form */}
                <Card className="md:col-span-2 border-gray-200 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/80 px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl text-gray-800">
                                    Environment Variable Details
                                </CardTitle>
                                <CardDescription>
                                    Update the details for this environment
                                    variable
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md">
                                <Variable className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 p-6">
                            {/* Form progress indicator */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500">
                                        Form completion
                                    </span>
                                    <span className="text-xs font-medium text-purple-600">
                                        {Math.round(formStrength)}%
                                    </span>
                                </div>
                                <Progress
                                    value={formStrength}
                                    className="h-1.5"
                                />
                            </div>

                            {/* Application info (read-only) */}
                            <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-purple-800">
                                            Application
                                        </div>
                                        <div className="text-base font-semibold text-purple-900">
                                            {application.name}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Creation info */}
                            <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-sm">
                                <div>
                                    <div className="text-gray-500 mb-1">
                                        Created
                                    </div>
                                    <div className="text-gray-900 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                        {formatDate(envVariable.created_at)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">
                                        Last Updated
                                    </div>
                                    <div className="text-gray-900 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                        {formatDate(envVariable.updated_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Variable Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    Use uppercase letters with
                                                    underscores. For example:
                                                    DATABASE_URL, API_KEY, etc.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        ref={nameInputRef}
                                        placeholder="VARIABLE_NAME"
                                        value={data.name}
                                        onChange={(e) => {
                                            const formattedName =
                                                formatVariableName(
                                                    e.target.value
                                                );
                                            setData("name", formattedName);
                                        }}
                                        className={`font-mono pl-10 uppercase ${
                                            errors.name
                                                ? "border-red-300 ring-red-100"
                                                : data.name &&
                                                  isNameValid(data.name)
                                                ? "border-green-300 ring-green-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-purple-100 focus-visible:border-purple-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Variable className="h-4 w-4" />
                                    </div>
                                    {data.name &&
                                        isNameValid(data.name) &&
                                        !errors.name && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                        )}
                                </div>
                                {errors.name ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.name}
                                    </p>
                                ) : (
                                    <div className="mt-1 flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            Environment variable name (e.g.,
                                            DATABASE_URL)
                                        </p>
                                        {data.name &&
                                            !isNameValid(data.name) && (
                                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Use uppercase with
                                                    underscores
                                                </p>
                                            )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="sequence"
                                        className="text-sm font-medium"
                                    >
                                        Sequence{" "}
                                        <span className="text-gray-400 font-normal">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    Determines the order of
                                                    variables in the .env file.
                                                    Lower numbers appear first.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="sequence"
                                        type="number"
                                        placeholder="10"
                                        value={data.sequence}
                                        onChange={(e) =>
                                            setData("sequence", e.target.value)
                                        }
                                        className={`pl-10 ${
                                            errors.sequence
                                                ? "border-red-300 ring-red-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-purple-100 focus-visible:border-purple-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <SortAsc className="h-4 w-4" />
                                    </div>
                                </div>
                                {errors.sequence ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.sequence}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Determines the order of variables
                                        (default: 10)
                                    </p>
                                )}
                            </div>

                            {/* Warning for changing env variables */}
                            <Alert className="border-amber-100 bg-amber-50/50 text-amber-800">
                                <AlertTitle className="flex items-center gap-1.5 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    Important Information
                                </AlertTitle>
                                <AlertDescription className="text-xs text-amber-700/90">
                                    <ul className="list-disc pl-4 space-y-1 mt-1">
                                        <li>
                                            Changing variable names may affect
                                            applications using this variable
                                        </li>
                                        <li>
                                            Make sure to update any code that
                                            references this environment variable
                                        </li>
                                        <li>
                                            Variable names should follow the
                                            convention of being
                                            UPPERCASE_WITH_UNDERSCORES
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>

                        <CardFooter className="flex justify-between gap-3 border-t bg-gray-50/80 px-6 py-4">
                            <div className="flex gap-3">
                                <Link
                                    href={route(
                                        "applications.show",
                                        application.id
                                    )}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.name ||
                                        !isNameValid(data.name) ||
                                        !hasChanges()
                                    }
                                    className="gap-1.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-sm"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Update Variable
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Sidebar with Help Information */}
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                                <Info className="h-4 w-4 text-purple-500" />
                                About Environment Variables
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4 text-sm">
                                <p className="text-gray-600 leading-relaxed">
                                    Environment variables are configuration
                                    values stored outside your code. They're
                                    used to configure your application for
                                    different environments.
                                </p>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-800">
                                        Naming conventions:
                                    </h4>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Uppercase:
                                                </strong>{" "}
                                                Use all uppercase letters
                                                (DB_HOST)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Underscores:
                                                </strong>{" "}
                                                Use underscores to separate
                                                words
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Descriptive:
                                                </strong>{" "}
                                                Use descriptive names
                                                (DATABASE_USERNAME)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Prefixing:
                                                </strong>{" "}
                                                Group related variables with
                                                prefixes (DB_*)
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="border-blue-200 bg-blue-50 text-blue-800 shadow-sm">
                        <AlertDescription className="flex items-start gap-2 text-sm">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Changing variable names affects all environments
                                where this variable is used. Make sure to update
                                all your code that references this variable.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Impact card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="text-base text-gray-800">
                                Variable Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Variable Name
                                    </span>
                                    <span className="font-mono font-medium text-gray-900">
                                        {envVariable.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Sequence
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {envVariable.sequence || "10 (default)"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Created
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(
                                            envVariable.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Status
                                    </span>
                                    <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EnvVariablesEdit;
