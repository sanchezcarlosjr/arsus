import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '@app/i18n';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      title: extract('Login'),
      authGuardPipe: () => redirectLoggedInTo([localStorage.getItem('authURLAfterLogin') || 'tabs/home']),
    },
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'oauth',
        loadChildren: () => import('./oauth/oauth.module').then((m) => m.OauthModule),
      }
    ]
  },
  { path: 'permissions', loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule { }
