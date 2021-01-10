import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SetThemeAction } from '@store/theme/theme.actions';
import { ThemeStateModel, ThemeStateModule } from './theme.state';

describe('Theme store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ThemeStateModule])],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: ThemeStateModel = {
      isDarkTheme: true,
      name: ''
    };
    store.dispatch(new SetThemeAction(expected.isDarkTheme));
    const actual = store.selectSnapshot(ThemeStateModule.isDarkTheme);
    expect(actual).toEqual(expected.isDarkTheme);
  });
});
