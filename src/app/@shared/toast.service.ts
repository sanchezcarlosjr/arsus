import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: ToastController, private translateService: TranslateService) {}
  async showInfo(message: string) {
    const toast = await this.toast.create({
      message: this.translateService.instant(message),
      duration: 5000,
      color: 'info',
    });
    await toast.present();
  }
  async showError(message: string) {
    const toast = await this.toast.create({
      message: this.translateService.instant(message),
      duration: 5000,
      color: 'danger',
    });
    await toast.present();
  }
}
