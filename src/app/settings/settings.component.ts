import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform, ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { LinkAction, LogoutAction } from '@store/auth/auth.actions';
import { AuthStateModule } from '@store/auth/auth.state';
import { GoogleApiService } from '@store/auth/google-authentication.controller';
import { Observable } from 'rxjs';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Select(AuthStateModule.uid) uid$: Observable<string>;

  constructor(
    private platform: Platform,
    private googleApiService: GoogleApiService,
    private store: Store,
    private toast: ToastController
  ) {}

  ngOnInit() {}

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  writeInClipboardUserUID() {
    const toast = this.toast.create({
      message: 'Copy to Clipboard',
      duration: 10000,
    });
    Clipboard.write({
      string: this.store.selectSnapshot(AuthStateModule.uid),
    }).then(() => toast.then((res) => res.present()));
  }

  grantOfflineAccess() {
    this.googleApiService.signInWithRedirect();
  }

  link(provider: string) {
    this.store.dispatch(new LinkAction(provider));
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }
}
