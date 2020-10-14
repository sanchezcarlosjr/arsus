import { AngularFireAuthGuard, AuthPipe, loggedIn } from '@angular/fire/auth-guard';
import { Route, Routes } from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShellComponent } from './shell.component';

export const redirectUnauthorizedTo: (redirect: any[]) => AuthPipe =
  (redirect) => pipe(loggedIn, map((loggedIn: any) => {
    if (loggedIn) {
      return loggedIn;
    }
    localStorage.setItem('authURLAfterLogin', location.pathname);
    return redirect;
  }));

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: 'tabs',
      component: ShellComponent,
      children: routes,
      canActivate: [AngularFireAuthGuard],
      data: {
        authGuardPipe: () => redirectUnauthorizedTo(['login'])
      },
    };
  }
}
