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
import { filter, tap } from 'rxjs/operators';
import { ToastService } from './../../app/@shared/toast.service';
import { LinkAction, LoginAction, LogoutAction } from './auth.actions';
import auth = firebase.auth;

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
    this.angularFireAuth.user
      .pipe(
        filter((user) => !!user),
        tap(async (user) => {
          ctx.dispatch(new SetUserName(user.displayName || user.email.split('@')[0]) || 'anonymous');
          this.angularFireAuth.getRedirectResult().then((redirectResult) => {
            if (redirectResult && redirectResult.user) {
              const lastProvider = redirectResult.additionalUserInfo.providerId.split('.')[0];
              this.firestore.firestore.doc(`users/${user.uid}/providers/CREDENTIALS`).set({
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
    return this.factory(action.provider, action.email, action.password);
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
        provider = new auth.GoogleAuthProvider();
        provider.addScope(GoogleApiService.SCOPE);
        return (await this.angularFireAuth.currentUser).linkWithRedirect(provider);
      case 'twitter':
        provider = new auth.TwitterAuthProvider();
        return (await this.angularFireAuth.currentUser).linkWithRedirect(provider);
    }
  }

  private factory(context: string, email: string, password: string) {
    let provider = null;
    switch (context) {
      case 'microsoft':
        provider = new auth.OAuthProvider('microsoft.com');
        provider.addScope('User.Read.All');
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'facebook':
        provider = new auth.FacebookAuthProvider();
        provider.addScope('email');
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'google':
        provider = new auth.GoogleAuthProvider();
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'twitter':
        provider = new auth.TwitterAuthProvider();
        return this.angularFireAuth.signInWithRedirect(provider);
      case 'yahoo':
        provider = new auth.OAuthProvider('yahoo.com');
        return this.angularFireAuth.signInWithRedirect(provider);
      default:
        if (/etochq|firemailbox/.test(email)) {
          return this.toast.showError('Invalid email domain. Check your email. ');
        }
        return this.angularFireAuth
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCredential) => {
            await userCredential.user.sendEmailVerification();
            await this.toast.showInfo('Verify your email. Check your inbox.');
          })
          .catch(async (error) => {
            if (error.code === 'auth/email-already-in-use') {
              return this.angularFireAuth
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                  if (!userCredential.user.emailVerified && userCredential.user.providerId === 'firebase') {
                    return this.toast.showError('Verify your email. Check your inbox.');
                  }
                  this.router.navigateByUrl('/tabs/home');
                })
                .catch((error2) => this.toast.showError(error2.message));
            }
            return this.toast.showError(error.message);
          });
    }
  }
}
