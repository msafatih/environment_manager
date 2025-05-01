export interface User {
    id: number;
    full_name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    group: GroupMember[];
    env_variable_changes: EnvVariableChange[];
    roles?: ModelHasRole[];
    permissions?: ModelHasPermission[];
    all_permissions?: Permission[];
}

export interface Group {
    id: string;
    name: string;
    description: string;
    group_members: GroupMember[];
    applications: Application[];
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    users?: User[];
}

export interface Role {
    id: string;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
    users?: User[];
}

export interface ModelHasPermission {
    permission_id: number;
    user: User;
    permission?: Permission;
}

export interface ModelHasRole {
    role_id: number;
    model_type: string;
    user: User;
    role?: Role;
}

export interface RoleHasPermission {
    permission_id: number;
    role_id: number;
    permission?: Permission;
    role?: Role;
}

export interface GroupMember {
    id: string;
    group: Group;
    user: User;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface EnvVariable {
    id: string;
    name: string;
    sequence: string;
    created_at: string;
    updated_at: string;
    application: Application;
    env_values: EnvValue[];
    env_variable_changes: EnvVariableChange[];
}

export interface Application {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    group: Group;
    env_variables: EnvVariable[];
    access_keys: AccesKey[];
}

export interface AccessKey {
    id: string;
    key: string;
    created_at: string;
    updated_at: string;
    application: Application;
    env_type: EnvType;
    env_values: EnvValue[];
}

export interface EnvValue {
    id: string;
    value: string;
    created_at: string;
    updated_at: string;
    env_variable: EnvVariable;
    access_key: AccesKey;
}

export interface EnvType {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    access_keys: AccesKey[];
}

export interface EnvVariableChange {
    id: string;
    old_value: string;
    new_value: string;
    type: string;
    created_at: string;
    updated_at: string;
    env_variable: EnvVariable;
    user: User;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
