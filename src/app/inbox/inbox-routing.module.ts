import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InboxComponent } from './inbox.component';
import { extract } from '../i18n';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    data: { title: extract('Inbox') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxRoutingModule {}
