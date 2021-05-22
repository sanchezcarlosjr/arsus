import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { OAuthClientIdGuard } from './oauth-client-id.guard';
import { OAuthQueryGuard } from './oauth-query.guard';
import { PermissionsComponent } from './permissions.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [OAuthQueryGuard, OAuthClientIdGuard, AngularFireAuthGuard],
    component: PermissionsComponent,
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['login']),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionsRoutingModule {}
