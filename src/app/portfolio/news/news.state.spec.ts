import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { NewsState, NewsStateModel } from './news.state';
import { NewsAction } from './news.actions';

describe('News store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([NewsState])],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: NewsStateModel = {
      items: ['item-1'],
    };
    store.dispatch(new NewsAction('item-1'));
    const actual = store.selectSnapshot(NewsState.getState);
    expect(actual).toEqual(expected);
  });
});
