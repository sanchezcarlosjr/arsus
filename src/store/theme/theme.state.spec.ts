import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ThemeStateModel, ThemeStateModule } from './theme.state';
import { ThemeAction } from './theme.actions';

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
      items: ['item-1'],
    };
    store.dispatch(new ThemeAction('item-1'));
    const actual = store.selectSnapshot(ThemeStateModule.getState);
    expect(actual).toEqual(expected);
  });
});
