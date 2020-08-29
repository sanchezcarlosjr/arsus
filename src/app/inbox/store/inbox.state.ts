import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Emitted, NgxsFirestoreConnect, StreamEmitted } from '@ngxs-labs/firestore-plugin';
import { append, patch } from '@ngxs/store/operators';
import { InboxFirestore } from '@app/inbox/store/InboxFirestore';
import { Injectable } from '@angular/core';
import { FetchInbox, GetInbox } from '@app/inbox/store/inbox.actions';

export interface InboxItem {
  from: string;
  to: string;
  body: string;
  created_at: any;
  extra?: any;
}

export interface InboxStateModel {
  items: InboxItem[];
}

@State<InboxStateModel>({
  name: 'inbox',
  defaults: {
    items: [],
  },
})
@Injectable()
export class InboxState implements NgxsOnInit {
  constructor(private firestore: InboxFirestore, private ngxsFirestoreConnect: NgxsFirestoreConnect) {}

  @Selector()
  static items(state: InboxStateModel) {
    return state.items;
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.ngxsFirestoreConnect.connect(GetInbox, {
      to: () => this.firestore.collection$(),
    });
  }

  @Action(StreamEmitted(GetInbox))
  getEmitted(ctx: StateContext<InboxStateModel>, emitted: Emitted<GetInbox, InboxItem[]>) {
    ctx.setState(
      patch({
        items: append([...emitted.payload]),
      })
    );
  }

  @Action(FetchInbox)
  fetch(ctx: StateContext<InboxStateModel>, { payload }: FetchInbox) {
    this.firestore.fetch(payload);
  }
}
