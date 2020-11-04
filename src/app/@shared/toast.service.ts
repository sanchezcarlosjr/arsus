import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: ToastController) { }
  async showInfo(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'info',
    });
    await toast.present();
  }
  async showError(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }
}
