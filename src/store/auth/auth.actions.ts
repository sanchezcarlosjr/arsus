import { AuthenticationStateModel } from './auth.state';

export class SetAuthData {
  public static readonly type = '[Auth] Set Auth data';

  constructor(public payload: AuthenticationStateModel) {}
}

export class LoginAction {
  public static readonly type = '[Auth] Login Action';

  constructor(public provider: string, public email?: string, public password?: string) {}
}

export class LogoutAction {
  public static readonly type = '[Auth] Logout Action';

  constructor() {}
}


export class LinkAction {
  public static readonly type = '[Auth] Link Action';

  constructor(public provider: string, public email?: string, public password?: string) {}
}
