"use client";

import { useState, useRef, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Loader2,
    Users,
    Info,
    CheckCircle2,
    Save,
    Sparkles,
    Lock,
    Settings,
    FolderTree,
    AlertTriangle,
    Calendar,
    Clock,
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

interface Group {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface GroupsEditProps {
    group: Group;
}

const GroupsEdit = ({ group }: GroupsEditProps) => {
    const { data, setData, put, processing, errors } = useForm({
        name: group.name,
        description: group.description || "",
    });

    const [characterCount, setCharacterCount] = useState(
        group.description?.length || 0
    );
    const MAX_DESCRIPTION_LENGTH = 500;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formStrength, setFormStrength] = useState(100); // Start at 100% since form is pre-filled
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

        if (data.description) {
            const descriptionValue = Math.min(
                (data.description.length / 50) * 40,
                40
            );
            strength += descriptionValue;
        }

        setFormStrength(Math.min(strength, 100));
    }, [data.name, data.description]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("groups.update", group.id), {
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

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Group: ${group.name}`} />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: "Groups", href: route("groups.index") },
                    { label: group.name, href: route("groups.show", group.id) },
                    { label: "Edit" },
                ]}
            />

            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]"></div>
                <div className="relative px-6 py-8 sm:px-8 md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Edit Group: {group.name}
                        </h1>
                        <p className="mt-2 max-w-2xl text-amber-100">
                            Update group information, descriptions, and settings
                            to better organize your environments.
                        </p>
                    </div>
                    <Link href={route("groups.show", group.id)}>
                        <Button
                            variant="outline"
                            className="gap-1 bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Group
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 animate-in fade-in slide-in-from-top-5 duration-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                        Group updated successfully!
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
                                    Group Information
                                </CardTitle>
                                <CardDescription>
                                    Update the details for this group
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                                <FolderTree className="h-5 w-5" />
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
                                    className="h-1.5 bg-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Group Name{" "}
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
                                                    unique name for your group.
                                                    This will help team members
                                                    identify it easily.
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
                                        placeholder="Enter group name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={`pl-10 ${
                                            errors.name
                                                ? "border-red-300 ring-red-100"
                                                : data.name
                                                ? "border-amber-300 ring-amber-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-amber-100 focus-visible:border-amber-500`}
                                        disabled={processing}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Users className="h-4 w-4" />
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
                                        Use a clear, concise name that describes
                                        the purpose of this group.
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
                                        placeholder="Describe the purpose of this group (optional)"
                                        value={data.description}
                                        onChange={handleDescriptionChange}
                                        className={`min-h-[150px] resize-none pl-10 ${
                                            errors.description
                                                ? "border-red-300 ring-red-100"
                                                : data.description
                                                ? "border-amber-300 ring-amber-100"
                                                : "border-gray-300"
                                        } transition-all focus-visible:ring-amber-100 focus-visible:border-amber-500`}
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
                                    <p className="mt-1 text-xs text-gray-500">
                                        A clear description helps team members
                                        understand the purpose of this group.
                                    </p>
                                )}
                            </div>

                            {/* Important changes notice */}
                            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-700">
                                    <AlertTriangle className="h-4 w-4" />{" "}
                                    Important Notes About Editing
                                </h4>
                                <p className="text-xs text-amber-700/90">
                                    When updating group information:
                                </p>
                                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                                    <li className="flex items-center gap-1.5 text-xs text-amber-700/80">
                                        <div className="rounded-full bg-amber-100 p-1">
                                            <Users className="h-3 w-3 text-amber-700" />
                                        </div>
                                        Team members will see the new name
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-amber-700/80">
                                        <div className="rounded-full bg-amber-100 p-1">
                                            <Lock className="h-3 w-3 text-amber-700" />
                                        </div>
                                        Permissions stay the same
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-amber-700/80">
                                        <div className="rounded-full bg-amber-100 p-1">
                                            <Settings className="h-3 w-3 text-amber-700" />
                                        </div>
                                        Environments remain connected
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-amber-700/80">
                                        <div className="rounded-full bg-amber-100 p-1">
                                            <Clock className="h-3 w-3 text-amber-700" />
                                        </div>
                                        Change history is preserved
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/80 px-6 py-4">
                            <Link href={route("groups.show", group.id)}>
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
                                disabled={processing || !data.name}
                                className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-sm"
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
                        </CardFooter>
                    </form>
                </Card>

                {/* Sidebar with Help Information */}
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/80 px-6">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                                <Info className="h-4 w-4 text-amber-500" />
                                About This Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-5 text-sm">
                                {/* Group metadata */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                            <Users className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">
                                                Group ID
                                            </p>
                                            <p className="font-mono text-xs text-gray-900">
                                                {group.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                            <Calendar className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">
                                                Created
                                            </p>
                                            <p className="text-xs text-gray-900">
                                                {formatDate(group.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                            <Clock className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">
                                                Last modified
                                            </p>
                                            <p className="text-xs text-gray-900">
                                                {formatDate(group.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800">
                                        Editing tips:
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
                                                    Be descriptive:
                                                </strong>{" "}
                                                Keep the group name concise but
                                                informative
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
                                                    Be clear:
                                                </strong>{" "}
                                                Explain the group's purpose and
                                                scope
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
                                                    Be consistent:
                                                </strong>{" "}
                                                Use naming conventions that
                                                match other groups
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="border-amber-200 bg-amber-50 text-amber-800 shadow-sm">
                        <AlertDescription className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Changes to group information may affect how team
                                members identify and interact with this group's
                                resources.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Before/After Card */}
                    <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500"></div>
                        <CardHeader className="px-6 pt-5 pb-2">
                            <CardTitle className="text-sm text-gray-800">
                                Original vs. New
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <div className="space-y-3">
                                <div className="rounded-md border border-gray-200 bg-white p-3 text-xs">
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                                        Original
                                    </div>
                                    <div className="font-medium text-gray-900 mb-1">
                                        {group.name}
                                    </div>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                        {group.description || (
                                            <span className="italic text-gray-400">
                                                No description provided
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-md border border-amber-200 bg-amber-50/30 p-3 text-xs">
                                    <div className="text-xs uppercase tracking-wider text-amber-600 mb-1">
                                        New (Preview)
                                    </div>
                                    <div className="font-medium text-gray-900 mb-1">
                                        {data.name}
                                    </div>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                        {data.description || (
                                            <span className="italic text-gray-400">
                                                No description provided
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default GroupsEdit;
