import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { InboxState } from './store/inbox.state';
import { ItemComponent } from './item/item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IframeModule } from '@shared/iframe/iframe.module';
import { EmailComposeComponent } from './email-compose/email-compose.component';

@NgModule({
  declarations: [InboxComponent, ItemComponent, EmailComposeComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([InboxState]),
    InboxRoutingModule,
    IframeModule,
  ],
})
export class InboxModule {}
