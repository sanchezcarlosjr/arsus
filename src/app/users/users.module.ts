import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { UsersState } from './users/users.state';
import { UserComponent } from './user/user.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent, UserComponent],
  imports: [CommonModule, UsersRoutingModule, IonicModule, NgxsModule.forFeature([UsersState]), ReactiveFormsModule],
  providers: [JsonPipe],
})
export class UsersModule {}
