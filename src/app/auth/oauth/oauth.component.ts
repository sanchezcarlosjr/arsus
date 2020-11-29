import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { LoginAction } from '@store/auth/auth.actions';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {
  constructor(private store: Store, private loadingController: LoadingController,
    @Inject(DOCUMENT) private document: Document) { }

  async ngOnInit() {
    localStorage.setItem('authURLAfterLogin', '/permissions');
    let params = (new URL(this.document.location.href)).searchParams;
    localStorage.setItem('oauth', params.toString());
    const loading = await this.loadingController.create();
    await loading.present();
    this.store
      .dispatch(new LoginAction('google'))
      .toPromise()
      .then(() => loading.dismiss());
  }

}
