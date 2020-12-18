import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';

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
      items: [],
    };
    const actual = store.selectSnapshot(UsersState.items);
    expect(actual).toEqual(expected.items);
  });
});
