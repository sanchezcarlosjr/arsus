import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { ResearchComponent } from './research.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ResearchComponent],
  imports: [CommonModule, IonicModule, TranslateModule, ResearchRoutingModule],
})
export class ResearchModule {}
