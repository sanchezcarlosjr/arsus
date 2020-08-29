import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsComponent } from './terms.component';
import { extract } from '../i18n';

const routes: Routes = [{ path: '', component: TermsComponent, data: { title: extract('Terms and Conditions') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsRoutingModule {}
