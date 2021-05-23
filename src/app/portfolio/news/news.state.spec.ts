import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { NewsState, NewsStateModel } from './news.state';

describe('News store', () => {
  let store: Store;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([NewsState])],
      }).compileComponents();
      store = TestBed.get(Store);
    })
  );

  it('should create an action and add an item', () => {
    const expected: NewsStateModel = {
      items: [],
    };
    const actual = store.selectSnapshot(NewsState.articles);
    expect(actual).toEqual(expected.items);
  });
});
