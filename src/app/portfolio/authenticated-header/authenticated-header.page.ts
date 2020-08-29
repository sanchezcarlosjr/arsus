import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { AvatarComponent } from './avatar/avatar.component';
import { Select } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
import { ThemeStateModule } from '@store/theme/theme.state';

@Component({
  selector: 'app-authenticated-header',
  templateUrl: './authenticated-header.page.html',
  styleUrls: ['./authenticated-header.page.scss'],
})
export class AuthenticatedHeaderComponent {
  @Select(ThemeStateModule.isAuthenticated) isAuthenticated$: Observable<boolean>;
  @Select(AuthStateModule.photoURL) photoURL$: Observable<string>;

  constructor(public popoverController: PopoverController) {}

  async present(ev: any) {
    const popover = await this.popoverController.create({
      component: AvatarComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onClick: () => {
          popover.dismiss();
        },
      },
    });
    return await popover.present();
  }
}
