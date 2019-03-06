/**
 * This component shows a breadcrumb trail for available routes the router can navigate to.
 * It subscribes to the router in order to update the breadcrumb trail as you navigate to a component.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tnm-breadcrumb-component',
    styleUrls: [ 'breadcrumb.component.scss' ],
    templateUrl: 'breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public prefix: string  = '';

    public urls: Array<string>;
    public urlsExtra: Array<string>;

    private urlsHistory: Array<string>;
    private routerSubscription: Subscription;

    public constructor(
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {}

    public ngOnInit(): void {
        this.urls = [];
        this.urlsExtra = [];
        this.urlsHistory = [];

        if (this.prefix.length > 0) {
            this.urls.unshift(this.prefix);
        }

        this.routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {

            if (navigationEnd instanceof NavigationEnd) {
                this.urls.length = 0; // Fastest way to clear out array
                this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
                this.urlsHistory = this.urls.slice();
            }
        });
    }

    public ngOnChanges(): void {
        if (!this.urls) {
            return;
        }

        this.urls.length = 0;
        this.generateBreadcrumbTrail(this.router.url);
    }

    private generateBreadcrumbTrail(url: string): void {
        this.urlsExtra.length = 0;

        if (!this.breadcrumbService.isRouteHidden(url)) {
            // Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
            this.urls.unshift(url);
        }

        if (url.lastIndexOf('/') > 0) {
            this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); // Find last '/' and add everything before it as a parent route
        } else if (this.prefix.length > 0) {
            this.urls.unshift(this.prefix);
        }

        // Create a forward breadcrumb
        if (this.urls.length && (this.urlsHistory.length > this.urls.length)) {
            let shouldCreateExtraCrumb = true;
            let i: number;
            const len = this.urls.length;
            for (i = 0; i < len; i++) {
                if (this.urls[i] !== this.urlsHistory[i]) {
                    shouldCreateExtraCrumb = false;
                    break;
                }
            }

            if (shouldCreateExtraCrumb && i < this.urlsHistory.length) {
                this.urlsExtra.length = 0;
                this.urlsExtra.push(this.urlsHistory[i]);
            } else {
                this.urlsExtra.length = 0;
            }
        }
    }

    public navigateTo(url: string): void {
        this.router.navigateByUrl(url);
    }

    public friendlyName(url: string): string {
        return  !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
    }

    public ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

}
