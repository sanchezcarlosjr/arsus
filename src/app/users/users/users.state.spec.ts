import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';
import { UsersAction } from './users.actions';

describe('Users store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UsersState])],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: UsersStateModel = {
      items: ['item-1'],
    };
    store.dispatch(new UsersAction('item-1'));
    const actual = store.selectSnapshot(UsersState.getState);
    expect(actual).toEqual(expected);
  });
});
