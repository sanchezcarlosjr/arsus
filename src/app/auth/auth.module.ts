import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, I18nModule, AuthRoutingModule],
  declarations: [LoginComponent],
})
export class AuthModule {}
