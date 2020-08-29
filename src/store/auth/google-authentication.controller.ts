import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class GoogleApiService {
  private window: any;
  private googleAuth: any;
  public static readonly SCOPE = [
    'https://www.googleapis.com/auth/user.addresses.read',
    'https://www.googleapis.com/auth/user.birthday.read',
    'https://www.googleapis.com/auth/user.emails.read',
    'https://www.googleapis.com/auth/user.phonenumbers.read',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/youtube.readonly',
  ].join(' ');
  private config = {
    client_id: '',
    redirect_uri: environment.googleAuthDomain,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
  };

  constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {
    this.window = this.document.defaultView;
    this.init().then();
  }

  signInWithRedirect() {
    this.googleAuth
      .grantOfflineAccess({
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
      })
      .then((a: any) => console.log(a));
  }

  getRedirectResult(code: string) {}

  private init() {
    return new Promise((resolve) => {
      const node = document.createElement('script');
      node.src = 'https://apis.google.com/js/platform.js';
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = () => resolve(true);
    }).then(() =>
      this.window['gapi'].load('auth', () =>
        this.window['gapi'].auth2.init(this.config).then((auth: any) => (this.googleAuth = auth))
      )
    );
  }
}
