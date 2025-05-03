import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { EnvValueChange, PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

interface EnVariableChangesIndexProps extends PageProps {
    envVariableChanges: EnvValueChange[];
    canViewEnvValueChanges: boolean;
}

const EnvVariableChangesIndex = () => {
    const { envValueChanges, canViewEnvValueChanges } =
        usePage<EnVariableChangesIndexProps>().props;

    return (
        <AuthenticatedLayout>
            <div></div>
        </AuthenticatedLayout>
    );
};

export default EnvVariableChangesIndex;
