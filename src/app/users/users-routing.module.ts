import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, hasCustomClaim } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '@app/i18n';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: {
      title: extract('Users'),
      authGuardPipe: () => hasCustomClaim('admin'),
    },
    canActivate: [AngularFireAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
