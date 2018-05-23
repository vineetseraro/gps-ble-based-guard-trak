import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {Observable} from 'rxjs/Rx';
// import { AuthorizationService } from  './Authorization.service';

@Directive({
    selector: '[akRole]'
})
export class AkRoleDirective {
    private hasView = false;
    constructor(private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
    ) {
    }

    @Input("akRole")
    set akRole(roles: string | string[]) {
        // let hasRight = this.authorizationService.hasRight(roles);
        let hasRight = this.hasRight(roles);
        console.log("is role: " + hasRight);
        if (hasRight && !this.hasView) {
            this.hasView = true;
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else if (!hasRight && this.hasView) {
            this.hasView = false;
            this.viewContainer.clear();
        }
    }

    hasRight(roles: any | any[]): Observable<boolean> | boolean {
        var roleArray = ['admin', 'test'];
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return roles.some((role:any) => roleArray.indexOf(role) !== -1);
    }
}
