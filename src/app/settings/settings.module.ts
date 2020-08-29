import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { I18nModule } from '@app/i18n';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { GoogleApiService } from '@store/auth/google-authentication.controller';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule, I18nModule, SettingsRoutingModule],
  declarations: [SettingsComponent],
  providers: [GoogleApiService],
})
export class SettingsModule {}
