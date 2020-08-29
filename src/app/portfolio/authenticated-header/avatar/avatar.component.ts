import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
import { LogoutAction } from '@store/auth/auth.actions';
import { SetThemeAction } from '@store/theme/theme.actions';
import { ThemeStateModule } from '@store/theme/theme.state';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Select(AuthStateModule.photoURL) photoURL$: Observable<string>;
  @Select(ThemeStateModule.userName) displayName$: Observable<string>;
  @Select(ThemeStateModule.isDarkTheme) theme$: Observable<boolean>;
  @Input() onClick: () => void;

  constructor(private store: Store) {}
  ngOnInit() {}

  change() {
    this.store.dispatch(new SetThemeAction());
  }

  signOut() {
    this.onClick();
    this.store.dispatch(new LogoutAction());
  }
}
