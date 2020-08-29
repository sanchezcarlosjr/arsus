import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyComponent } from './privacy.component';
import { extract } from '../i18n';

const routes: Routes = [{ path: '', component: PrivacyComponent, data: { title: extract('Privacy') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyRoutingModule {}
