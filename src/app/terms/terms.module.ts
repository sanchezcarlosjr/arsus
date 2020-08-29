import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';
import { IframeModule } from '../@shared/iframe/iframe.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TermsComponent],
  imports: [IframeModule, IonicModule, TermsRoutingModule],
})
export class TermsModule {}
