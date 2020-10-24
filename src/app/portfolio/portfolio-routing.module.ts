import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '../i18n';
import { PortfolioComponent } from './portfolio.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioComponent,
    data: { title: extract('News') },
  },
  {
    path: 'article/:title/:uid',
    component: ViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
