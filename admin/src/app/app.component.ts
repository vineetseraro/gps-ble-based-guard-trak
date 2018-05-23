import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';

import { CognitoUtil, UserLoginService } from '../app/core/aws/cognito.service';
import { SearchService } from './core/search.service';
import { DashboardService } from './themes/stryker/services/dashboard.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [SearchService],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    title = 'app works!';
    loading: boolean;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private DashboardService: DashboardService,
        private userService: UserLoginService,
        private cognitoUtil: CognitoUtil,
        private confirmationService: ConfirmationService,
    ) {

    }

 

    ngOnInit() {
        this.userService.isAuthenticated(this);
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => this.titleService.setTitle(event['title']));
    }

    interceptRouterEvent(routerEvent) {
        debugger;
        if (routerEvent instanceof NavigationStart) {

            debugger;
        }

        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.loading = false;
            //this.DashboardService.isMask = false;
            debugger;
            if (routerEvent.url === "/products") {
                this.DashboardService.showProductSearch = true;
            } else {
                this.DashboardService.showProductSearch = false;
            }

        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            const self = this;
            const intervalSource = Observable.interval(60 * 1000)
            .subscribe(x => {
                x;
                self.checkSession(intervalSource);
            });
            this.DashboardService.getNotificationList();
            this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    
                }
              });
        }
    }

    checkSession(intervalSource) {
        const intervalSourceObj = intervalSource;
        intervalSourceObj;
        this.cognitoUtil.getSessionState().subscribe(state => {
            if (state === 2) { // token is about to expire
                this.confirmationService.confirm({
                    message: 'You will be logged out.<br/>Do you want to stay signed in?',
                    header: 'Your session is about to expire !',
                    icon: '',
                    accept: () => {
                        if ( !window.localStorage.getItem('userData') ) { // session expired
                            this.userService.redirectToLogin(true);
                        }
                        // refresh tokens here
                        this.cognitoUtil.refreshToken();
                    },
                    reject: () => {
                        // log out user : manually
                        this.userService.logout();
                        this.userService.redirectToLogin();
                    }
                });
            } else if (state === 0) { // token is expired
                // log out user : auto
                // intervalSourceObj.unsubscribe();
                this.userService.logout();
                this.userService.redirectToLogin(true);
            }
        });
    }
}
