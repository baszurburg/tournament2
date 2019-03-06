import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbService {

    private routesFriendlyNames: Map<string, string> = new Map<string, string>();
    private routesFriendlyNamesRegex: Map<string, string> = new Map<string, string>();
    private routesWithCallback: Map<string, (routeWithCb: string) => string> = new Map<string, (routeWithCb: string) => string>();
    private routesWithCallbackRegex: Map<string, (routeWithCbRgx: string) => string> = new Map<string, (routeWithCbRgx: string) => string>();
    private hideRoutes: any = new Array<string>();
    private hideRoutesRegex: any = new Array<string>();

    public constructor() {
        console.count(`BreadcrumbService.constructor()`);

        // To Do: Move this to a config file.

        this.addFriendlyNameForRoute('/account/settings', 'shared.breadcrumb.accountSettings');
        this.addFriendlyNameForRoute('/assignments', 'shared.breadcrumb.assignments');
        this.addFriendlyNameForRoute('/assignments/search', 'shared.breadcrumb.assignmentsSearch');

    }

    /**
     * Specify a friendly name for the corresponding route.
     *
     * @param route
     * @param name
     */
    public addFriendlyNameForRoute(route: string, name: string): void {
        this.routesFriendlyNames.set(route, name);
    }

    /**
     * Specify a friendly name for the corresponding route matching a regular expression.
     *
     * @param route
     * @param name
     */
    public addFriendlyNameForRouteRegex(routeRegex: string, name: string): void {
        this.routesFriendlyNamesRegex.set(routeRegex, name);
    }

    /**
     * Specify a callback for the corresponding route.
     * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
     */
    public addCallbackForRoute(route: string, callback: (id: string) => string): void {
        this.routesWithCallback.set(route, callback);
    }

    /**
     * Specify a callback for the corresponding route matching a regular expression.
     * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
     */
    public addCallbackForRouteRegex(routeRegex: string, callback: (id: string) => string): void {
        this.routesWithCallbackRegex.set(routeRegex, callback);
    }

    /**
     * Show the friendly name for a given route (url). If no match is found the url (without the leading '/') is shown.
     *
     * @param route
     * @returns {*}
     */
    public getFriendlyNameForRoute(route: string): string {
        let routeEnd = route.substr(route.lastIndexOf('/') + 1, route.length);
        let name: string = routeEnd;

        this.routesFriendlyNames.forEach((value, key) => {
            if (key === route) {
                name = value;
            }
        });

        this.routesFriendlyNamesRegex.forEach((value, key) => {
            if (new RegExp(key).exec(route)) {
                name = value;
            }
        });

        this.routesWithCallback.forEach((value, key) => {
            if (key === route) {
                name = value(routeEnd);
            }
        });

        this.routesWithCallbackRegex.forEach((value, key) => {
            if (new RegExp(key).exec(route)) {
                name = value(routeEnd);
            }
        });

        return name;
    }

    /**
     * Specify a route (url) that should not be shown in the breadcrumb.
     */
    public hideRoute(route: string): void {
        if (this.hideRoutes.indexOf(route) === -1) {
            this.hideRoutes.push(route);
        }
    }

    /**
     * Specify a route (url) regular expression that should not be shown in the breadcrumb.
     */
    public hideRouteRegex(routeRegex: string): void {
        if (this.hideRoutesRegex.indexOf(routeRegex) === -1) {
            this.hideRoutesRegex.push(routeRegex);
        }
    }

    /**
     * Returns true if a route should be hidden.
     */
    public isRouteHidden(route: string): boolean {
        let hide = this.hideRoutes.indexOf(route) > -1;

        this.hideRoutesRegex.forEach((value: any) => {
            if (new RegExp(value).exec(route)) {
                hide = true;
            }
        });

        return hide;
    }
}
