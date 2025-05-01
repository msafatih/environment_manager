"use client";

import { useState, useRef, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Loader2,
    AppWindow,
    Info,
    CheckCircle2,
    Save,
    FolderClosed,
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
import { Textarea } from "@/Components/ui/textarea";
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
import { Application, Group, PageProps } from "@/types";

interface ApplicationEditProps extends PageProps {
    application: Application;
    groups: Group[];
}

const ApplicationsEdit = () => {
    const { application, groups } = usePage<ApplicationEditProps>().props;

    const { data, setData, put, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        group_id: string;
    }>({
        name: application.name || "",
        description: application.description || "",
        group_id: application.group.id || "",
    });

    const [characterCount, setCharacterCount] = useState(
        application.description ? application.description.length : 0
    );
    const MAX_DESCRIPTION_LENGTH = 500;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(100); // Start with 100% since it's an edit
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Calculate form completion strength for any changes
    useEffect(() => {
        let strength = 0;

        if (data.name) {
            strength += 40; // Name has weight
        }

        if (data.description) {
            const descriptionValue = Math.min(
                (data.description.length / 50) * 30,
                30
            );
            strength += descriptionValue;
        }

        if (data.group_id) {
            strength += 30; // Group selection has weight
        }

        setFormStrength(Math.min(strength, 100));
    }, [data.name, data.description, data.group_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("applications.update", application.id), {
            onSuccess: () => {
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            },
        });
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value;
        if (value.length <= MAX_DESCRIPTION_LENGTH) {
            setData("description", value);
            setCharacterCount(value.length);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Application: ${application.name}`} />

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
                    { label: "Edit" },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Edit Application
                        </h1>
                        <p className="mt-2 max-w-2xl text-blue-100">
                            Update the details for{" "}
                            <span className="font-semibold">
                                {application.name}
                            </span>
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
                        Application updated successfully!
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
                                    Application Information
                                </CardTitle>
                                <CardDescription>
                                    Update the details of this application
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                                <AppWindow className="h-5 w-5" />
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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Application Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    Choose a descriptive and
                                                    unique name for your
                                                    application. This will be
                                                    used to identify it across
                                                    environments.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        type="text"
                                        ref={nameInputRef}
                                        placeholder="Enter application name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={`pl-10 ${
                                            errors.name
                                                ? "border-red-300 ring-red-100"
                                                : data.name
                                                ? "border-green-300 ring-green-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-blue-100 focus-visible:border-blue-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <AppWindow className="h-4 w-4" />
                                    </div>
                                    {data.name && !errors.name && (
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
                                    <p className="mt-1 text-xs text-gray-500">
                                        Use a clear, concise name that
                                        identifies this application.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="group_id"
                                        className="text-sm font-medium"
                                    >
                                        Group{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                                <p className="w-60 text-xs">
                                                    Select which group this
                                                    application belongs to. This
                                                    determines access
                                                    permissions and
                                                    organizational structure.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Select
                                        value={data.group_id.toString()}
                                        onValueChange={(value) =>
                                            setData("group_id", value)
                                        }
                                        disabled={processing}
                                    >
                                        <SelectTrigger
                                            className={`pl-10 ${
                                                errors.group_id
                                                    ? "border-red-300 ring-red-100"
                                                    : data.group_id
                                                    ? "border-green-300 ring-green-100"
                                                    : "border-gray-300"
                                            } transition-all focus-visible:ring-blue-100 focus-visible:border-blue-500 text-slate-600`}
                                        >
                                            <SelectValue placeholder="Select a group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={group.id.toString()}
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FolderClosed className="h-4 w-4" />
                                    </div>
                                    {data.group_id && !errors.group_id && (
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                {errors.group_id ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.group_id}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Applications must belong to a specific
                                        group.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="description"
                                        className="text-sm font-medium"
                                    >
                                        Description
                                    </Label>
                                    <span
                                        className={`text-xs ${
                                            characterCount >
                                            MAX_DESCRIPTION_LENGTH * 0.8
                                                ? characterCount >
                                                  MAX_DESCRIPTION_LENGTH * 0.95
                                                    ? "text-red-500"
                                                    : "text-amber-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {characterCount}/
                                        {MAX_DESCRIPTION_LENGTH}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the purpose of this application (optional)"
                                        value={data.description}
                                        onChange={handleDescriptionChange}
                                        className={`min-h-[150px] resize-none pl-10 ${
                                            errors.description
                                                ? "border-red-300 ring-red-100"
                                                : data.description
                                                ? "border-green-300 ring-green-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-blue-100 focus-visible:border-blue-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <Info className="h-4 w-4" />
                                    </div>
                                </div>
                                {errors.description ? (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-500"></span>
                                        {errors.description}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        A clear description helps team members
                                        understand what this application does.
                                    </p>
                                )}
                            </div>

                            {/* Edit tips section */}
                            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-700">
                                    <Info className="h-4 w-4" /> Editing Tips
                                </h4>
                                <p className="text-xs text-amber-700/90">
                                    When updating application information:
                                </p>
                                <ul className="mt-2 space-y-1.5">
                                    <li className="flex items-start gap-1.5 text-xs text-amber-700/80">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        Changing the group may affect access
                                        permissions and associated environments
                                    </li>
                                    <li className="flex items-start gap-1.5 text-xs text-amber-700/80">
                                        <div className="mt-0.5 h-1 w-1 rounded-full bg-amber-500"></div>
                                        All changes will be reflected across all
                                        environments where this application is
                                        used
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between gap-3 border-t bg-gray-50/80 px-6 py-4">
                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.name ||
                                        !data.group_id
                                    }
                                    className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                                >
                                    {processing ? (
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
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Sidebar with Info */}
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                                <Info className="h-4 w-4 text-blue-500" />
                                Application Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4 text-sm">
                                <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">
                                        Current Group
                                    </div>
                                    <div className="font-medium text-gray-800 flex items-center gap-2">
                                        <FolderClosed className="h-3.5 w-3.5 text-blue-500" />
                                        {application.group.name}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-800">
                                        What happens when you update:
                                    </h4>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    1
                                                </span>
                                            </div>
                                            <span>
                                                All environments using this
                                                application will see the updated
                                                information
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    2
                                                </span>
                                            </div>
                                            <span>
                                                Changing the group may affect
                                                who can access this application
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <span className="text-xs font-bold">
                                                    3
                                                </span>
                                            </div>
                                            <span>
                                                Description changes will help
                                                team members better understand
                                                the application's purpose
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="border-amber-200 bg-amber-50 text-amber-800 shadow-sm">
                        <AlertDescription className="flex items-start gap-2 text-sm">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Deleting this application will remove all its
                                configurations and variables across all
                                environments.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Usage Stats */}
                    <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <CardHeader className="px-6 pt-5 pb-2">
                            <CardTitle className="text-sm text-gray-800">
                                Application Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Environments
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        5
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Variables
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        24
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Last updated
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        3 days ago
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href={route(
                                            "applications.show",
                                            application.id
                                        )}
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        View usage details →
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ApplicationsEdit;
