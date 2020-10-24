import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RssRoutingModule } from './rss-routing.module';
import { RssComponent } from './rss.component';

@NgModule({
  declarations: [RssComponent],
  imports: [CommonModule, IonicModule, RssRoutingModule],
})
export class RssModule {}
