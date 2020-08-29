import { ShellComponent } from './shell.component';
import { Shell } from './shell.service';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { of } from 'rxjs';
import { Route } from '@angular/router';
import arrayContaining = jasmine.arrayContaining;

describe('Shell', () => {
  let result: Route;
  beforeEach(() => {
    result = Shell.childRoutes([{ path: 'test' }]);
  });
  describe('childRoutes', () => {
    it('should create routes as children of shell', () => {
      expect(result.path).toBe('tabs');
      expect(result.component).toBe(ShellComponent);
      expect(result.canActivate).toEqual(arrayContaining([AngularFireAuthGuard]));
    });
    it('should redirect to home when user is logging', (done: DoneFn) => {
      const it = result.data.redirectToProfileOrLogin();
      const guard$ = of({ user: '' }).pipe(it);
      guard$.subscribe((value) => {
        expect(value[0]).toBe('home');
        done();
      });
    });
    it('should redirect to login when user is not logging', (done: DoneFn) => {
      const it = result.data.redirectToProfileOrLogin();
      const guard$ = of(null).pipe(it);
      guard$.subscribe((value) => {
        expect(value[0]).toBe('login');
        done();
      });
    });
  });
});
