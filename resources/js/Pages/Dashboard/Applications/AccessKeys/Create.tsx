"use client";

import { useState, useRef, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Loader2,
    Key,
    Info,
    CheckCircle2,
    Sparkles,
    Lock,
    Server,
    Copy,
    RefreshCw,
    AppWindow,
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
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
import { Application, EnvType, PageProps } from "@/types";

interface CreateAccessKeysProps extends PageProps {
    application: Application;
    envTypes: EnvType[];
}

const AccessKeysCreate = () => {
    const { application, envTypes } = usePage<CreateAccessKeysProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        application_id: application.id.toString(),
        key: "",
        env_type_id: "",
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(0);
    const keyInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus key input on component mount
    useEffect(() => {
        if (keyInputRef.current) {
            keyInputRef.current.focus();
        }
    }, []);

    // Calculate form completion strength
    useEffect(() => {
        let strength = 0;

        if (data.key) {
            strength += 50; // Key has more weight
        }

        if (data.env_type_id) {
            strength += 50; // Environment type selection has weight
        }

        setFormStrength(Math.min(strength, 100));
    }, [data.key, data.env_type_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route("applications.accessKeys.store", {
                application: application,
                envType: data.env_type_id,
            }),
            {
                onSuccess: () => {
                    reset("key", "env_type_id");
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                },
            }
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Create Access Key for ${application.name}`} />

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
                    { label: "New Access Key" },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                                <Key className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Create Access Key
                            </h1>
                        </div>
                        <p className="mt-2 max-w-2xl text-emerald-100">
                            Create a new access key for{" "}
                            <span className="font-semibold">
                                {application.name}
                            </span>{" "}
                            to allow secure API access.
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
                        Access key created successfully!
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
                                    Configure the access key for this
                                    application
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
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
                                    <span className="text-xs font-medium text-emerald-600">
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
                                        <AppWindow className="h-5 w-5" />
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
                                                    Store it securely as it
                                                    cannot be retrieved after
                                                    creation.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="key"
                                        type="text"
                                        ref={keyInputRef}
                                        placeholder="Enter or generate an access key"
                                        value={data.key}
                                        onChange={(e) =>
                                            setData("key", e.target.value)
                                        }
                                        className={`font-mono pl-10 ${
                                            errors.key
                                                ? "border-red-300 ring-red-100"
                                                : data.key
                                                ? "border-green-300 ring-green-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-emerald-100 focus-visible:border-emerald-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Key className="h-4 w-4" />
                                    </div>
                                </div>
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
                                        disabled={processing}
                                    >
                                        <SelectTrigger
                                            className={`pl-10 ${
                                                errors.env_type_id
                                                    ? "border-red-300 ring-red-100"
                                                    : data.env_type_id
                                                    ? "border-green-300 ring-green-100"
                                                    : "border-gray-300"
                                            } transition-all focus-visible:ring-emerald-100 focus-visible:border-emerald-500 text-slate-600`}
                                        >
                                            <SelectValue placeholder="Select environment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {envTypes.map((envType) => (
                                                <SelectItem
                                                    key={envType.id}
                                                    value={envType.id.toString()}
                                                >
                                                    {envType.name}
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
                                    <p className="mt-1 text-xs text-gray-500">
                                        This determines which environment the
                                        access key can be used in.
                                    </p>
                                )}
                            </div>

                            {/* Security warning */}
                            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-700">
                                    <ShieldAlert className="h-4 w-4" /> Security
                                    Notice
                                </h4>
                                <p className="text-xs text-amber-700/90">
                                    Access keys grant API access to your
                                    application's environment variables. Please
                                    note:
                                </p>
                                <ul className="mt-2 space-y-2 text-xs text-amber-700/80">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        <span>
                                            Keys cannot be viewed after creation
                                            - store them securely
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        <span>
                                            If a key is compromised, delete it
                                            immediately and create a new one
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        <span>
                                            Do not share access keys in public
                                            repositories or insecure channels
                                        </span>
                                    </li>
                                </ul>
                            </div>
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
                                    processing || !data.key || !data.env_type_id
                                }
                                className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Key className="h-4 w-4" />
                                        Create Access Key
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
                                <Info className="h-4 w-4 text-emerald-500" />
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
                                        Key benefits:
                                    </h4>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <span className="text-xs font-bold">
                                                    1
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Secure Access:
                                                </strong>{" "}
                                                Authenticate API requests to
                                                retrieve environment variables
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <span className="text-xs font-bold">
                                                    2
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Environment Specific:
                                                </strong>{" "}
                                                Limit access to specific
                                                environment types
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <span className="text-xs font-bold">
                                                    3
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Deployment Ready:
                                                </strong>{" "}
                                                Use in CI/CD pipelines and
                                                deployment workflows
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <span className="text-xs font-bold">
                                                    4
                                                </span>
                                            </div>
                                            <span>
                                                <strong className="font-medium text-gray-800">
                                                    Revocable:
                                                </strong>{" "}
                                                Easily revoke access by deleting
                                                keys if compromised
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
                                After creating an access key, you'll need to
                                store it securely. The key value will not be
                                displayed again.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Usage Example */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                                <Sparkles className="h-4 w-4 text-emerald-500" />
                                API Usage Example
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3 text-sm">
                                <p className="text-gray-600">
                                    Access environment variables using the API
                                    with your key:
                                </p>
                                <div className="font-mono text-xs bg-gray-900 text-gray-100 p-3 rounded-md">
                                    <div className="text-green-400">
                                        # Retrieve all variables
                                    </div>
                                    <div className="mt-1 text-blue-300">
                                        curl -X GET \
                                    </div>
                                    <div className="pl-4 text-gray-300">
                                        -H "Authorization: Bearer
                                        YOUR_ACCESS_KEY" \
                                    </div>
                                    <div className="pl-4 text-gray-300">
                                        https://your-api.com/api/variables
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    Or fetch a specific variable by name:
                                </p>
                                <div className="font-mono text-xs bg-gray-900 text-gray-100 p-3 rounded-md">
                                    <div className="text-green-400">
                                        # Retrieve a specific variable
                                    </div>
                                    <div className="mt-1 text-blue-300">
                                        curl -X GET \
                                    </div>
                                    <div className="pl-4 text-gray-300">
                                        -H "Authorization: Bearer
                                        YOUR_ACCESS_KEY" \
                                    </div>
                                    <div className="pl-4 text-gray-300">
                                        https://your-api.com/api/variables/DATABASE_URL
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AccessKeysCreate;
