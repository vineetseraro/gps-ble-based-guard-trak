
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
export class SideMenu {
        menuItems: MenuItem[];
}
export class MenuItem {
        title: string;
        id: string;
        link: string;
        icon: string;
        active: boolean;
        subNav: MenuItem[] = [];

        // constructor(title: string, id: string, link: string, icon: string, active: boolean) {
        //         this.title = title;
        //         this.id = id;
        //         this.link = link;
        //         this.icon = icon;
        //         this.active = active;
        // }

        // constructor(){

        // }
        constructor(obj: MenuItem = {} as MenuItem) {
                const {
                        title = '',
                        id = '',
                        link = '',
                        icon = '',
                        active = false,
                        subNav = []
         } = obj;

                /** Hint: put jsdoc comments here for inline ide auto-documentation */
                this.title = title;
                this.id = id;
                this.link = link;
                this.icon = icon;
                this.active = active;
                this.subNav = subNav;
        }
}


