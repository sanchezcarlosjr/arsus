import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FetchInbox, GetInbox } from '@app/inbox/store/inbox.actions';
import { InboxItem, InboxState } from '@app/inbox/store/inbox.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  @Select(InboxState.items) articles$: Observable<InboxItem[]>;
  communicationForm!: FormGroup;

  constructor(
    private store: Store,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private cloudFunctions: AngularFireFunctions
  ) {
    this.createForm();
  }

  async upload() {
    try {
      await this.cloudFunctions.httpsCallable('InboxSender')(this.communicationForm.value).toPromise();
      this.communicationForm.reset();
    } catch (e) {}
  }

  ngOnInit(): void {
    this.store.dispatch(new GetInbox());
  }

  async typeChanged(event: {type: string, id: string}) {
    if (event.type === 'content') {
        await this.cloudFunctions.httpsCallable('AddSourceNewsController')({
          id: event.id,
          type: 'email'
        }).toPromise();
    }
  }

  loadData(event: any): void {
    this.store.dispatch(
      new FetchInbox({
        complete: () => event.target.complete(),
      })
    );
  }

  private createForm() {
    this.communicationForm = this.formBuilder.group({
      to: [''],
      type: ['email'],
      subject: [''],
      message: [''],
    });
  }
}
