import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SetAuthData } from './auth.actions';
import { AuthenticationStateModel, AuthStateModule } from './auth.state';

describe('[TEST]: AuthStore', () => {
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([AuthStateModule])],
      })
        .compileComponents()
        .then();
      store = TestBed.inject(Store);
    })
  );

  it('Should be correct dispatch and value is empty', () => {
    const Authentication: AuthenticationStateModel = {
      admin: false,
      uid: '',
      displayName: '',
      email: '',
      phoneNumber: '',
      photoURL: '',
      emailVerified: false,
      providerId: '',
    };
    store.dispatch(new SetAuthData(Authentication));
  });
});
