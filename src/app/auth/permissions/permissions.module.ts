import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthClientIdGuard } from './oauth-client-id.guard';
import { OAuthQueryGuard } from './oauth-query.guard';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';

@NgModule({
  declarations: [PermissionsComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, I18nModule, PermissionsRoutingModule],
  providers: [OAuthQueryGuard, OAuthClientIdGuard],
})
export class PermissionsModule {}
