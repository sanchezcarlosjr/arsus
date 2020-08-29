import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { LogoutAction } from '@store/auth/auth.actions';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
import { GoogleApiService } from '@store/auth/google-authentication.controller';
import { ThemeStateModule } from '@store/theme/theme.state';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Select(AuthStateModule.photoURL) photoURL$: Observable<string>;
  @Select(ThemeStateModule.userName) displayName$: Observable<string>;
  @Select(AuthStateModule.uid) uid$: Observable<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
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

  logout() {
    this.store.dispatch(new LogoutAction());
  }
}
