import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { LoadingController, Platform, ToastController } from '@ionic/angular';

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
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit() {}

  ngOnDestroy() {}

  async login(provider?: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.store
      .dispatch(new LoginAction(provider, this.loginForm.value.username, this.loginForm.value.password))
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
