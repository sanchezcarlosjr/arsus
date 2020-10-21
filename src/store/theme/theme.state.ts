import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { SetThemeAction, SetUserName } from './theme.actions';

export interface ThemeStateModel {
  isDarkTheme: boolean;
  name: string;
}

@State<ThemeStateModel[]>({
  name: 'theme',
  defaults: [],
})
@Injectable()
export class ThemeStateModule implements NgxsOnInit {
  @Selector()
  public static userName(state: ThemeStateModel) {
    return state.name;
  }

  @Selector()
  public static isAuthenticated(state: ThemeStateModel) {
    return !!state.name;
  }

  @Selector()
  public static isDarkTheme(state: ThemeStateModel) {
    return state.isDarkTheme;
  }

  ngxsOnInit(ctx: StateContext<ThemeStateModel>) {
    this.toggle(ctx.getState().isDarkTheme);
  }

  @Action(SetUserName)
  public setUserName(ctx: StateContext<ThemeStateModel>, { payload }: SetUserName) {
    ctx.patchState({
      name: payload.split(' ')[0],
    });
  }

  @Action(SetThemeAction)
  public setTheme(ctx: StateContext<ThemeStateModel>, { payload }: SetThemeAction) {
    const theme = payload || !ctx.getState().isDarkTheme;
    this.toggle(theme);
    ctx.patchState({
      isDarkTheme: theme,
    });
  }

  private toggle(theme?: boolean) {
    document.body.classList.toggle('dark', theme);
  }
}
