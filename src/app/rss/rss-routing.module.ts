import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RssComponent } from './rss.component';

const routes: Routes = [{ path: '', component: RssComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RssRoutingModule {}
