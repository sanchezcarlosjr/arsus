import { NgModule } from '@angular/core';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy.component';
import { IframeModule } from '../@shared/iframe/iframe.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [IonicModule, IframeModule, PrivacyRoutingModule],
})
export class PrivacyModule {}
