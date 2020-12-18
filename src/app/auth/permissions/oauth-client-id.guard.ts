import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class OAuthClientIdGuard implements CanActivate {
    constructor(private location: Location, private functions: AngularFireFunctions) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.functions.httpsCallable('ensureClientId')({
            redirect_uri: route.queryParams.redirect_uri,
            client_id: route.queryParams.client_id
        }).pipe(
            tap((isAValidClientId) => {
                if (isAValidClientId) {
                    this.location.back();
                }
                localStorage.setItem('redirect_uri', route.queryParams.redirect_uri);
                localStorage.setItem('state', route.queryParams.state);
            },
            ))
    }
}