import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { InboxState, InboxStateModel } from './inbox.state';

describe('Inbox store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([InboxState])],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: InboxStateModel = {
      items: [],
    };
    const actual = store.selectSnapshot(InboxState.items);
    expect(actual).toEqual(expected.items);
  });
});
