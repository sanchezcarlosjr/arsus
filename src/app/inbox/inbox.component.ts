import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FetchInbox, GetInbox } from '@app/inbox/store/inbox.actions';
import { InboxItem, InboxState } from '@app/inbox/store/inbox.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { EmailComposeComponent } from '@app/inbox/email-compose/email-compose.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  @Select(InboxState.items) articles$: Observable<InboxItem[]>;

  constructor(
    private store: Store,
    private firestore: AngularFirestore,
    private modal: ModalController,
    private cloudFunctions: AngularFireFunctions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetInbox());
  }

  async typeChanged(event: { type: string; id: string }) {
    if (event.type === 'content') {
      await this.cloudFunctions
        .httpsCallable('AddSourceNewsController')({
          id: event.id,
          type: 'email',
        })
        .toPromise();
    }
  }

  loadData(event: any): void {
    this.store.dispatch(
      new FetchInbox({
        complete: () => event.target.complete(),
      })
    );
  }

  async composeEmail(email: string = '') {
    const modal = await this.modal.create({
      component: EmailComposeComponent,
      componentProps: {
        email,
      },
    });
    return await modal.present();
  }
}
