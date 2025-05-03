"use client";

import { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Loader2,
    Key,
    Info,
    CheckCircle2,
    Server,
    Copy,
    Eye,
    EyeOff,
    ShieldAlert,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Application, PageProps, AccessKey, EnvType } from "@/types";
import { Input } from "@/Components/ui/input";

interface EditAccessKeyProps extends PageProps {
    application: Application;
    accessKey: AccessKey;
    envTypes: EnvType[];
    hasUsedAllEnvTypes: boolean;
    usedEnvTypes: EnvType[];
}

const AccessKeysEdit = () => {
    const {
        application,
        accessKey,
        envTypes,
        hasUsedAllEnvTypes,
        usedEnvTypes,
    } = usePage<EditAccessKeyProps>().props;
    const { data, setData, put, processing, errors, reset } = useForm({
        key: accessKey.key,
        env_type_id: accessKey.env_type.id.toString(),
        application_id: application.id,
    });

    useEffect(() => {
        let strength = 0;

        if (data.key) {
            strength += 50;
        }

        if (data.env_type_id) {
            strength += 50;
        }

        setFormStrength(strength);
    }, [data.key, data.env_type_id]);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(100); // Start with 100% since it's editing
    const [showKey, setShowKey] = useState(false);

    // Create a combined list of env types for dropdown
    const allEnvTypes = [
        accessKey.env_type,
        ...envTypes.filter((type) => type.id !== accessKey.env_type.id),
    ];

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

    // Calculate form completion strength whenever env_type_id changes
    useEffect(() => {
        setFormStrength(data.env_type_id ? 100 : 50);
    }, [data.env_type_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("applications.accessKeys.update", {
                application: application,
                accessKey: accessKey,
            }),
            {
                onSuccess: () => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                },
            }
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Access Key for ${application.name}`} />

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
                    { label: "Edit Access Key" },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                                <Key className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Edit Access Key
                            </h1>
                        </div>
                        <p className="mt-2 max-w-2xl text-amber-100">
                            Modify the access key for{" "}
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
                        Access key updated successfully!
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
                                    Access Key Details
                                </CardTitle>
                                <CardDescription>
                                    Update the environment type for this access
                                    key
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
                                <Key className="h-5 w-5" />
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
                                    <span className="text-xs font-medium text-amber-600">
                                        {Math.round(formStrength)}%
                                    </span>
                                </div>
                                <Progress
                                    value={formStrength}
                                    className="h-1.5"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="key"
                                        className="text-sm font-medium"
                                    >
                                        Access Key{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    This key will be used to
                                                    authenticate API requests.
                                                    Changing it will invalidate
                                                    any systems using the
                                                    previous key.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="key"
                                        type={showKey ? "text" : "password"}
                                        placeholder="Enter access key"
                                        value={data.key || accessKey.key}
                                        onChange={(e) =>
                                            setData("key", e.target.value)
                                        }
                                        className={`font-mono pl-10 ${
                                            errors.key
                                                ? "border-red-300 ring-red-100"
                                                : data.key
                                                ? "border-green-300 ring-green-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-amber-100 focus-visible:border-amber-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Key className="h-4 w-4" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                                        onClick={() =>
                                            copyToClipboard(
                                                data.key || accessKey.key
                                            )
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-amber-600"
                                        onClick={() => setShowKey(!showKey)}
                                    >
                                        {showKey ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.key ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.key}
                                    </p>
                                ) : (
                                    <div className="mt-1 flex justify-between">
                                        <p className="text-xs text-gray-500">
                                            A secure, unique key for API
                                            authentication.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 text-xs text-amber-600 hover:text-amber-700 -mt-1"
                                            onClick={() => {
                                                // Generate a random 40-character string
                                                const characters =
                                                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                                                const length = 40;
                                                let result = "";

                                                for (
                                                    let i = 0;
                                                    i < length;
                                                    i++
                                                ) {
                                                    result += characters.charAt(
                                                        Math.floor(
                                                            Math.random() *
                                                                characters.length
                                                        )
                                                    );
                                                }

                                                setData("key", result);
                                            }}
                                        >
                                            Generate New Key
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="env_type_id"
                                        className="text-sm font-medium"
                                    >
                                        Environment Type{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    Select the environment type
                                                    this key will be used for.
                                                    This determines which
                                                    environment values the key
                                                    can access.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Select
                                        value={data.env_type_id}
                                        onValueChange={(value) =>
                                            setData("env_type_id", value)
                                        }
                                        disabled={
                                            processing ||
                                            (allEnvTypes.length <= 1 &&
                                                data.env_type_id ===
                                                    accessKey.env_type.id.toString())
                                        }
                                    >
                                        <SelectTrigger
                                            className={`pl-10 ${
                                                errors.env_type_id
                                                    ? "border-red-300 ring-red-100"
                                                    : data.env_type_id
                                                    ? "border-green-300 ring-green-100"
                                                    : "border-gray-300"
                                            } transition-all focus-visible:ring-amber-100 focus-visible:border-amber-500 text-slate-600`}
                                        >
                                            <SelectValue placeholder="Select environment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allEnvTypes.map((envType) => (
                                                <SelectItem
                                                    key={envType.id}
                                                    value={envType.id.toString()}
                                                >
                                                    {envType.name}{" "}
                                                    {envType.id ===
                                                        accessKey.env_type.id &&
                                                        "(Current)"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Server className="h-4 w-4" />
                                    </div>
                                    {data.env_type_id &&
                                        !errors.env_type_id && (
                                            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                        )}
                                </div>
                                {errors.env_type_id ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.env_type_id}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                                        This determines which environment the
                                        access key can be used in.
                                    </p>
                                )}
                            </div>
                            {hasUsedAllEnvTypes && allEnvTypes.length <= 1 && (
                                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                                    <AlertTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        No other environment types available
                                    </AlertTitle>
                                    <AlertDescription>
                                        This application already has access keys
                                        for all other environment types. Each
                                        environment type can only have one
                                        access key per application.
                                        {usedEnvTypes.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm font-medium">
                                                    Currently used environment
                                                    types:
                                                </p>
                                                <ul className="mt-1 space-y-1">
                                                    {usedEnvTypes.map(
                                                        (type) => (
                                                            <li
                                                                key={type.id}
                                                                className="flex items-center gap-2 text-sm"
                                                            >
                                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                                                {type.name}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {/* Security warning */}
                            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-700">
                                    <ShieldAlert className="h-4 w-4" /> Security
                                    Notice
                                </h4>
                                <p className="text-xs text-amber-700/90">
                                    Changing the environment type of an access
                                    key may affect systems using this key.
                                </p>
                                <ul className="mt-2 space-y-2 text-xs text-amber-700/80">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        <span>
                                            Update any services or applications
                                            using this key
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        <span>
                                            Consider creating a new key instead
                                            if this is used in production
                                        </span>
                                    </li>
                                </ul>
                            </div>
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
                                        !data.env_type_id ||
                                        (data.env_type_id ===
                                            accessKey.env_type.id.toString() &&
                                            data.key === accessKey.key)
                                    }
                                    className="gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-sm"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Key className="h-4 w-4" />
                                            Update Access Key
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
                                <Info className="h-4 w-4 text-amber-500" />
                                About Access Keys
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4 text-sm">
                                <p className="text-gray-600 leading-relaxed">
                                    Access keys allow applications to securely
                                    retrieve environment variables via API for a
                                    specific environment type.
                                </p>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-800">
                                        Important notes:
                                    </h4>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                                <span className="text-xs font-bold">
                                                    1
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Limited Changes:
                                                </strong>{" "}
                                                You can only change which
                                                environment type this key is for
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                                <span className="text-xs font-bold">
                                                    2
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Key Value:
                                                </strong>{" "}
                                                The key value itself cannot be
                                                changed
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                                <span className="text-xs font-bold">
                                                    3
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    One Key Per Type:
                                                </strong>{" "}
                                                Each environment type can only
                                                have one access key
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                                <span className="text-xs font-bold">
                                                    4
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Create New:
                                                </strong>{" "}
                                                If you need a new key, consider
                                                deleting this one and creating a
                                                new one
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
                                Changing the environment type will affect what
                                environment variables this key can access. Make
                                sure to update any services that use this key.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Current Usage */}
                    <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                        <CardHeader className="px-6 pt-5 pb-2">
                            <CardTitle className="text-sm text-gray-800">
                                Current Access Key Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Environment Type
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {accessKey.env_type.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Created
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(
                                            accessKey.created_at
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

export default AccessKeysEdit;
