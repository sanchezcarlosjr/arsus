import { NgxsModule, Store } from '@ngxs/store';
import { async, TestBed } from '@angular/core/testing';
import { AuthenticationStateModel, AuthStateModule } from './auth.state';
import { SetAuthData } from './auth.actions';

fdescribe('[TEST]: AuthStore', () => {
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthStateModule])],
    })
      .compileComponents()
      .then();
    store = TestBed.inject(Store);
  }));

  it('Should be correct dispatch and value is empty', () => {
    const Authentication: AuthenticationStateModel = {
      uid: '',
      displayName: '',
      email: '',
      phoneNumber: '',
      lastProvider: '',
      photoURL: '',
      isNewUser: false,
      emailVerified: false,
      creationTime: undefined,
      lastSignInTime: undefined,
      isOlder: false,
      providerId: '',
      isAnonymous: true,
    };
    store.dispatch(new SetAuthData(Authentication));
  });
});
