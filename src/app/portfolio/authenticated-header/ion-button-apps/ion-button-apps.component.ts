import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { AppsComponent } from '../apps/apps.component';

@Component({
  selector: 'ion-button-apps',
  templateUrl: './ion-button-apps.component.html',
  styleUrls: ['./ion-button-apps.component.scss'],
})
export class IonButtonAppsComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  async present(ev: any) {
    const popover = await this.popoverController.create({
      component: AppsComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onClick: () => popover.dismiss(),
      },
    });
    return await popover.present();
  }

  ngOnInit() {}
}
