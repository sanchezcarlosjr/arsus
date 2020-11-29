import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
    @Inject(DOCUMENT) private document: Document, private firestore: AngularFirestore) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    localStorage.setItem('authURLAfterLogin', '/permissions');
    let params = (new URL(this.document.location.href)).searchParams;
    if (!params.get('apiKey')) {
      history.go(-1);
    }
    this.firestore.collection('users').doc(params.get('apiKey')).get()
      .subscribe((doc) => {
        const user = doc.data();
        if (!doc.exists &&
          !user.authorizedJavaScriptOrigins.match(params.get('origin')) &&
          !user.authorizedRedirectURIs.match(params.get('redirect_uri')) &&
          !user.authorizedWebhooks.match(params.get('webhook'))
        ) {
          history.go(-1);
        }
      });
    localStorage.setItem('redirect_uri', params.get('redirect_uri'));
    localStorage.setItem('webhook', params.get('webhook'));
    this.store
      .dispatch(new LoginAction('google'))
      .toPromise()
      .then(() => loading.dismiss());
  }

}
