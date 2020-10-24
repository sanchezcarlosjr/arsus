import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, hasCustomClaim } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '../i18n';
import { InboxComponent } from './inbox.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    data: {
      title: extract('Inbox'),
      authGuardPipe: () => hasCustomClaim('admin'),
    },
    canActivate: [AngularFireAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxRoutingModule {}
