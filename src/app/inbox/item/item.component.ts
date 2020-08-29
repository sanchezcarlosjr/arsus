import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlobIframeComponent } from '@shared/iframe/blob-iframe/blob-iframe.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inbox-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() from = '';
  @Input() created_at = '';
  @Input() body = '';
  @Output() typeChanged = new EventEmitter();

  constructor(public modalController: ModalController) {}

  segmentChanged(event: any) {
    this.typeChanged.emit({
      id: this.from,
      type: event.detail.value,
    });
  }

  async seeMore() {
    const modal = await this.modalController.create({
      component: BlobIframeComponent,
      componentProps: {
        description: this.body,
      },
    });
    return await modal.present();
  }
}
