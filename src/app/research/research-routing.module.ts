import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearchComponent } from './research.component';
import { extract } from '../i18n';

const routes: Routes = [
  {
    path: '',
    component: ResearchComponent,
    data: { title: extract('Research') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearchRoutingModule {}
