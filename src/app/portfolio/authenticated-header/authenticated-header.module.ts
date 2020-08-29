import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { I18nModule } from './../../i18n/i18n.module';
import { AppsComponent } from './apps/apps.component';
import { AuthenticatedHeaderComponent } from './authenticated-header.page';
import { AvatarComponent } from './avatar/avatar.component';
import { IonButtonAppsComponent } from './ion-button-apps/ion-button-apps.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule, I18nModule],
  exports: [AuthenticatedHeaderComponent],
  declarations: [AuthenticatedHeaderComponent, IonButtonAppsComponent, AppsComponent, AvatarComponent],
})
export class AuthenticatedHeaderModule {}
