import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Copy, CheckCircle2, Globe, Settings, Server } from "lucide-react";
import { EnvType } from "@/types";

interface DownloadEnvModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string;
    applicationName: string;
    envTypes: EnvType[];
    canViewDevelopment: boolean;
    canViewStaging: boolean;
    canViewProduction: boolean;
}

export default function DownloadEnvModal({
    isOpen,
    onClose,
    applicationId,
    applicationName,
    envTypes,
    canViewDevelopment,
    canViewStaging,
    canViewProduction,
}: DownloadEnvModalProps) {
    const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

    const getEnvTypeUrl = (envTypeName: string) => {
        const baseUrl = window.location.origin;
        const apiToken = document
            .querySelector('meta[name="api-token"]')
            ?.getAttribute("content");
        return `${baseUrl}/api/applications/${applicationId}/download/${envTypeName.toLowerCase()}?token=${apiToken}`;
    };
    const copyToClipboard = (text: string, envType: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLinks({ ...copiedLinks, [envType]: true });
        setTimeout(() => {
            setCopiedLinks((prev) => ({ ...prev, [envType]: false }));
        }, 2000);
    };

    // Helper to get env type icon
    const getEnvTypeIcon = (envType: string) => {
        switch (envType.toLowerCase()) {
            case "development":
                return <Settings className="h-5 w-5 text-blue-500" />;
            case "staging":
                return <Globe className="h-5 w-5 text-yellow-500" />;
            case "production":
                return <Server className="h-5 w-5 text-red-500" />;
            default:
                return <Globe className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Download .env File
                    </DialogTitle>
                    <DialogDescription>
                        Copy the link for the environment you want to download.
                        Opening the link will generate a .env file for{" "}
                        <span className="font-semibold">{applicationName}</span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-md border">
                        <div className="divide-y">
                            {canViewDevelopment && (
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {getEnvTypeIcon("development")}
                                        <div>
                                            <div className="font-medium">
                                                Development Environment
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500 font-mono truncate max-w-md">
                                                {getEnvTypeUrl("development")}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                getEnvTypeUrl("development"),
                                                "development"
                                            )
                                        }
                                        className="gap-1.5"
                                    >
                                        {copiedLinks["development"] ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {canViewStaging && (
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {getEnvTypeIcon("staging")}
                                        <div>
                                            <div className="font-medium">
                                                Staging Environment
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500 font-mono truncate max-w-md">
                                                {getEnvTypeUrl("staging")}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                getEnvTypeUrl("staging"),
                                                "staging"
                                            )
                                        }
                                        className="gap-1.5"
                                    >
                                        {copiedLinks["staging"] ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {canViewProduction && (
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {getEnvTypeIcon("production")}
                                        <div>
                                            <div className="font-medium">
                                                Production Environment
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500 font-mono truncate max-w-md">
                                                {getEnvTypeUrl("production")}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                getEnvTypeUrl("production"),
                                                "production"
                                            )
                                        }
                                        className="gap-1.5"
                                    >
                                        {copiedLinks["production"] ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                        Note: These links provide temporary access to your
                        environment variables. The links are secured by your
                        application-specific access tokens.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
