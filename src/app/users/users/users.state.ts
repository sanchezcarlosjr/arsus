import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AuthenticationStateModel } from '@store/auth/auth.state';
import { Emitted, NgxsFirestoreConnect, StreamEmitted } from '@ngxs-labs/firestore-plugin';
import { FetchInbox, GetInbox } from '@app/inbox/store/inbox.actions';
import { append, patch } from '@ngxs/store/operators';
import { InboxItem, InboxStateModel } from '@app/inbox/store/inbox.state';
import { UsersFirestore } from '@app/users/users/UsersFirestore';
import { Injectable } from '@angular/core';
import { FetchUsers, GetUsers } from '@app/users/users/users.actions';

export interface UsersStateModel {
  items: AuthenticationStateModel[];
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    items: [],
  },
})
@Injectable()
export class UsersState {
  constructor(private firestore: UsersFirestore, private ngxsFirestoreConnect: NgxsFirestoreConnect) {}

  @Selector()
  static items(state: UsersStateModel) {
    return state.items;
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.ngxsFirestoreConnect.connect(GetUsers, {
      to: () => this.firestore.collection$(),
    });
  }

  @Action(StreamEmitted(GetUsers))
  getEmitted(ctx: StateContext<UsersStateModel>, emitted: Emitted<GetUsers, AuthenticationStateModel[]>) {
    ctx.setState(
      patch({
        items: append([...emitted.payload]),
      })
    );
  }

  @Action(FetchUsers)
  fetch(ctx: StateContext<UsersStateModel>, { payload }: FetchUsers) {
    this.firestore.fetch(payload);
  }
}
