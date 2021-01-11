import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '../i18n';

import { ApiComponent } from './api.component';
const routes: Routes = [
  {
    path: '',
    component: ApiComponent,
    data: {
      title: extract('API'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiRoutingModule {}
