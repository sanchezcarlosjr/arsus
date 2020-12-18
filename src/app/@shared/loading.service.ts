import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable()
export class LoadingService {
    private loading: HTMLIonLoadingElement;
    constructor(private loadingController: LoadingController) { }
    async present() {
        this.loading = await this.loadingController.create();
        return this.loading.present();
    }
    dismiss() {
        return this.loading.dismiss();
    }
}