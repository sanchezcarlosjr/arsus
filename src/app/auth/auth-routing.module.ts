import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '@app/i18n';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      title: extract('Login'),
      authGuardPipe: () =>
        redirectLoggedInTo([new URLSearchParams(window.location.search).get('redirectTo') || 'tabs/home']),
    },
  },
  {
    path: 'oauth',
    data: {
      title: extract('OAuth'),
    },
    loadChildren: () => import('./permissions/permissions.module').then((m) => m.PermissionsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
