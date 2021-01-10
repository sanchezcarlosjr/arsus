import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class OAuthClientIdGuard implements CanActivate {
  constructor(private location: Location, private functions: AngularFireFunctions) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    if (sessionStorage.getItem('state')) {
      return true;
    }
    return this.functions.httpsCallable('ensureClientId')({
      redirect_uri: route.queryParams.redirect_uri,
      client_id: route.queryParams.client_id
    }).pipe(
      tap((isAValidClientId) => {
          if (!isAValidClientId) {
            this.location.back();
          }
          sessionStorage.setItem('redirect_uri', route.queryParams.redirect_uri);
          sessionStorage.setItem('state', route.queryParams.state);
          sessionStorage.setItem('authURLAfterLogin', '/oauth');
        }
      ));
  }
}
