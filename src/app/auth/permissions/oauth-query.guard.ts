import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export function equals<T>(a: Set<T>, b: Set<T>) {
    if (a.size !== b.size) return false;
    for (const value of a) if (!b.has(value)) return false;
    return true;
}


@Injectable()
export class OAuthQueryGuard implements CanActivate {
    constructor(private location: Location) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (sessionStorage.getItem('state')) {
            return true;
        }
        const allowedQueryParams = new Set(['response_type', 'client_id', 'redirect_uri', 'scope', 'state', 'code_challenge', 'code_challenge_method']);
        const keysQueryParams: Set<string> = new Set(Object.keys(route.queryParams));
        const valuesQueryParams: Set<string> = new Set(Object.values(route.queryParams));
        const forbiddenKeysQueryParams = !equals<string>(allowedQueryParams, keysQueryParams);
        const allValuesQueryParamsAreNull: boolean = valuesQueryParams.has('') ||
          valuesQueryParams.has(null) ||
          valuesQueryParams.has(undefined);
        const allowedQuery = !forbiddenKeysQueryParams && !allValuesQueryParamsAreNull;
        if (!allowedQuery) {
            this.location.back();
        }
        return allowedQuery;
    }
}
