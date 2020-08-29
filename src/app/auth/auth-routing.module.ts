import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { extract } from '@app/i18n';
import { LoginComponent } from './login.component';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      title: extract('Login'),
      authGuardPipe: () =>
        redirectLoggedInTo([
          localStorage.getItem('authURLAfterLogin') ? localStorage.getItem('authURLAfterLogin') : '/home',
        ]),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
