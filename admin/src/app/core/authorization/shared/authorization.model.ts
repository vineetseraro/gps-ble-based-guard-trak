
export class PermissionResponse {
        code: number;
        message: string;
        description: string;
        data: PermissionModel;
}

export class PermissionModel {
        modules: ModuleModel[];
        roleName: string;
}

export class ModuleModel {
        resources: ResourceModel[];
        name: string;

}
export class ResourceModel {

        componentName: string;
        get: boolean;
        post: boolean;
        put: boolean;
        delete: boolean;

}

export class UserGroupRole {
        group: string;
        role: string;
}
