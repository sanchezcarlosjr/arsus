import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { LoadingController, Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { LoginAction } from '@store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private loadingController: LoadingController,
    private store: Store
  ) {
    this.createForm();
  }

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('provider')) {
      const scopes = params.has('scopes') ? params.get('scopes').split(',') : null;
      await this.login(params.get('provider'), scopes);
    }
  }

  ngOnDestroy() {}

  async login(provider?: string, scopes?: string[] | null) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.store
      .dispatch(new LoginAction(provider, this.loginForm.value.username, this.loginForm.value.password, scopes))
      .toPromise()
      .then(() => loading.dismiss());
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }
}
