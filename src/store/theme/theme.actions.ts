export class SetThemeAction {
  public static readonly type = '[Theme] Set item';

  constructor(public payload?: boolean) {}
}

export class SetUserName {
  public static readonly type = '[Theme] Set user name';
  constructor(public payload: string) {}
}
