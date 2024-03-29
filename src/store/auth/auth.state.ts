import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { GoogleApiService } from '@store/auth/google-authentication.controller';
import { UserRequest } from '@store/auth/user-request';
import { SetUserName } from '@store/theme/theme.actions';
import firebase from 'firebase/app';
import 'firebase/auth';
import { filter, tap } from 'rxjs/operators';
import { ToastService } from '@shared/toast.service';
import { LinkAction, LoginAction, LogoutAction } from './auth.actions';
import { TranslateService } from '@ngx-translate/core';

export interface AuthenticationStateModel extends firebase.UserInfo {
  phoneNumber: string;
  uid: string;
  admin: boolean;
  displayName: string;
  photoURL: string;
  email: string;
  emailVerified: boolean;
  created_at?: any;
}

const defaults: AuthenticationStateModel = {
  uid: '',
  displayName: '',
  email: '',
  admin: false,
  phoneNumber: '',
  emailVerified: false,
  photoURL: '',
  providerId: '',
};

@State<AuthenticationStateModel>({
  name: 'authStateModule',
  defaults,
})
@Injectable()
export class AuthStateModule implements NgxsOnInit {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private firestore: AngularFirestore,
    private translate: TranslateService,
    private toast: ToastService,
    private router: Router
  ) {}

  @Selector()
  static photoURL(state: AuthenticationStateModel) {
    return state.photoURL;
  }

  @Selector()
  static uid(state: AuthenticationStateModel) {
    return state.uid;
  }

  @Selector()
  static admin(state: AuthenticationStateModel) {
    return state.admin;
  }

  ngxsOnInit(ctx: StateContext<AuthenticationStateModel>) {
    this.angularFireAuth.getRedirectResult().then((redirectResult) => {
      if (redirectResult && redirectResult.user) {
        const lastProvider = redirectResult.additionalUserInfo.providerId.split('.')[0];
        return this.firestore.collection(`users/${redirectResult.user.uid}/credentials`).add({
          updated_at: new Date(),
          lastProvider,
          [`${lastProvider}`]: {
            ...redirectResult.credential,
            oid: redirectResult.user.providerData[0].uid,
            ...redirectResult.additionalUserInfo.profile,
          },
        });
      }
    });
    this.angularFireAuth.user
      .pipe(
        filter((user) => !!user),
        tap(async (user) => {
          ctx.dispatch(new SetUserName(user.displayName || user.email.split('@')[0]) || 'anonymous');
          const device = await UserRequest.device();
          await this.functions.httpsCallable('LocateUser')({}).toPromise();
          return this.firestore.collection(`users/${user.uid}/devices`).add({
            created_at: new Date(),
            ...device,
          });
        })
      )
      .subscribe(async (user) =>
        ctx.patchState({
          admin: (await user.getIdTokenResult()).claims.hasOwnProperty('admin'),
          photoURL: user.photoURL || 'https://image.flaticon.com/icons/svg/2494/2494552.svg',
          uid: user.uid,
          emailVerified: user.emailVerified,
        })
      );
  }

  @Action(LoginAction)
  login(ctx: StateContext<AuthenticationStateModel>, action: LoginAction) {
    return this.factory(action.provider, action.email, action.password, action.scopes);
  }

  @Action(LinkAction)
  link(ctx: StateContext<AuthenticationStateModel>, action: LoginAction) {
    return this.factoryLink(action.provider);
  }

  @Action(LogoutAction)
  logout(ctx: StateContext<AuthenticationStateModel>) {
    ctx.dispatch(new SetUserName(''));
    this.angularFireAuth.signOut().then(() => this.router.navigateByUrl('/'));
    ctx.setState(defaults);
  }

  private async factoryLink(context: string) {
    let provider = null;
    switch (context) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope(GoogleApiService.SCOPE);
        return (await this.angularFireAuth.currentUser).linkWithRedirect(provider);
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        return (await this.angularFireAuth.currentUser).linkWithRedirect(provider);
    }
  }

  private factory(context: string, email: string, password: string, scopes?: string[]) {
    let provider = null;
    switch (context) {
      case 'microsoft':
        provider = new firebase.auth.OAuthProvider('microsoft.com');
        provider.addScope('User.Read.All');
        addScopes(provider, scopes);
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');
        addScopes(provider, scopes);
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        addScopes(provider, scopes);
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'yahoo':
        provider = new firebase.auth.OAuthProvider('yahoo.com');
        addScopes(provider, scopes);
        return this.angularFireAuth.signInWithRedirect(provider);
      default:
        if (/etochq|firemailbox|temp|frnla|logicstreak|privacy-mail|vintomaper|thichanthit/.test(email)) {
          return this.toast.showError('Invalid email domain. Check your email. ');
        }
        return this.angularFireAuth
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCredential) => {
            userCredential.user.sendEmailVerification();
            this.translate
              .get('Verify your email. Check your inbox.')
              .toPromise()
              .then((message) => this.toast.showInfo(message));
          })
          .catch(async (error) => {
            if (error.code === 'auth/email-already-in-use') {
              return this.angularFireAuth
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                  if (!userCredential.user.emailVerified && userCredential.user.providerId === 'firebase') {
                    userCredential.user.sendEmailVerification();
                    return this.translate
                      .get('Verify your email. Check your inbox.')
                      .toPromise()
                      .then((message) => this.toast.showInfo(message));
                  }
                  window.location.reload();
                })
                .catch((error2) => this.toast.showError(error2.message));
            }
            return this.toast.showError(error.message);
          });
    }
  }
}

function addScopes(provider: { addScope: (scope: string) => void }, scopes: string[] | null) {
  if (scopes == null) {
    return;
  }
  for (const scope of scopes) {
    provider.addScope(scope);
  }
}
