import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortfolioComponent } from './portfolio.component';
import { extract } from '../i18n';

const routes: Routes = [
  {
    path: '',
    component: PortfolioComponent,
    data: { title: extract('News') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
