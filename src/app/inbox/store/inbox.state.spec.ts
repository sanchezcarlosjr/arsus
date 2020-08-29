import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { InboxState, InboxStateModel } from './inbox.state';
import { InboxAction } from './inbox.actions';

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
      items: ['item-1'],
    };
    store.dispatch(new InboxAction('item-1'));
    const actual = store.selectSnapshot(InboxState.getState);
    expect(actual).toEqual(expected);
  });
});
