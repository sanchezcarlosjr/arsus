import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { SettingsModule } from './settings/settings.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxsStoreModule } from '@store/store.module';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HrefDirective } from '@shared/href.directive';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    IonicModule.forRoot(),
    CoreModule,
    AngularFireAnalyticsModule,
    SharedModule,
    ShellModule,
    HomeModule,
    SettingsModule,
    AuthModule,
    NgxsStoreModule,
    AppRoutingModule,
    ScullyLibModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent, HrefDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
