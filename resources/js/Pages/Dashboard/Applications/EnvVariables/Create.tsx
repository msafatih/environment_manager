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
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Breadcrumb } from "@/Components/Breadcrumb";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Progress } from "@/Components/ui/progress";

interface CreateEnvVariablesProps extends PageProps {
    application: Application;
}

const EnvVariablesCreate = () => {
    const { application } = usePage<CreateEnvVariablesProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        application_id: application.id.toString(),
        name: "",
        sequence: "10", // Default sequence value
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(0);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus name input on component mount
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    // Calculate form completion strength
    useEffect(() => {
        let strength = 0;

        if (data.name) {
            strength += 60; // Name has more weight
        }

        if (data.sequence) {
            strength += 10; // Sequence has less weight
        }

        setFormStrength(Math.min(strength, 100));
    }, [data.name, data.sequence]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route("applications.envVariables.store", {
                application: application,
            }),
            {
                onSuccess: () => {
                    reset("name", "sequence");
                    setData("sequence", "10"); // Reset to default value
                    if (nameInputRef.current) {
                        nameInputRef.current.focus();
                    }
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

    return (
        <AuthenticatedLayout>
            <Head title={`Add Environment Variable to ${application.name}`} />

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
                    { label: "New Environment Variable" },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                                <Database className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                New Environment Variable
                            </h1>
                        </div>
                        <p className="mt-2 max-w-2xl text-blue-100">
                            Add a new environment variable to{" "}
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
                        Environment variable created successfully!
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
                                    Provide the details for this environment
                                    variable
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
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
                                    <span className="text-xs font-medium text-blue-600">
                                        {Math.round(formStrength)}%
                                    </span>
                                </div>
                                <Progress
                                    value={formStrength}
                                    className="h-1.5"
                                />
                            </div>

                            {/* Application info (read-only) */}
                            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-blue-800">
                                            Application
                                        </div>
                                        <div className="text-base font-semibold text-blue-900">
                                            {application.name}
                                        </div>
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
                                        } transition-all focus-visible:ring-blue-100 focus-visible:border-blue-500`}
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
                                        htmlFor="value"
                                        className="text-sm font-medium"
                                    >
                                        Variable Value{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    The value of the environment
                                                    variable. For sensitive
                                                    data, this will be stored
                                                    securely.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
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
                                        } transition-all focus-visible:ring-blue-100 focus-visible:border-blue-500`}
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

                            {/* Warning for sensitive data */}
                            <Alert className="border-amber-100 bg-amber-50/50 text-amber-800">
                                <AlertTitle className="flex items-center gap-1.5 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    Important Information
                                </AlertTitle>
                                <AlertDescription className="text-xs text-amber-700/90">
                                    <ul className="list-disc pl-4 space-y-1 mt-1">
                                        <li>
                                            Environment variables are accessible
                                            to all users with access to this
                                            application
                                        </li>
                                        <li>
                                            Variable names should follow the
                                            convention of being
                                            UPPERCASE_WITH_UNDERSCORES
                                        </li>
                                        <li>
                                            For secret values, ensure you're
                                            storing them securely
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/80 px-6 py-4">
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
                                    !isNameValid(data.name)
                                }
                                className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Create Variable
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Sidebar with Help Information */}
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                                <Info className="h-4 w-4 text-blue-500" />
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
                                        Common uses:
                                    </h4>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    1
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Database Connections:
                                                </strong>{" "}
                                                URLs, usernames, passwords
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    2
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    API Keys:
                                                </strong>{" "}
                                                External service authentication
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    3
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Feature Flags:
                                                </strong>{" "}
                                                Enable/disable features
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    4
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    App Configuration:
                                                </strong>{" "}
                                                URLs, ports, timeouts, etc.
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
                                You can fetch these variables in your
                                application using the environment access methods
                                for your programming language.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Example code */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="text-base text-gray-800">
                                Example Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border-b">
                                <div className="flex items-center bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
                                    JavaScript
                                </div>
                                <pre className="overflow-x-auto p-4 text-xs text-gray-800">
                                    <code>
                                        {`// Access an environment variable
const apiKey = process.env.API_KEY;

// Use the variable in your code
const response = await fetch(url, {
  headers: { Authorization: \`Bearer \${apiKey}\` }
});`}
                                    </code>
                                </pre>
                            </div>
                            <div>
                                <div className="flex items-center bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
                                    PHP
                                </div>
                                <pre className="overflow-x-auto p-4 text-xs text-gray-800">
                                    <code>
                                        {`// Access an environment variable
$dbUrl = $_ENV["DATABASE_URL"];

// Use the variable in your code
$connection = new DatabaseConnection($dbUrl);`}
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EnvVariablesCreate;
