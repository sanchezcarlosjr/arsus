import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthenticationStateModel } from '@store/auth/auth.state';
import { UsersState } from '@app/users/users/users.state';
import { FetchUsers, GetUsers } from '@app/users/users/users.actions';
import { ModalController } from '@ionic/angular';
import { UserComponent } from '@app/users/user/user.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Select(UsersState.items) articles$: Observable<AuthenticationStateModel[]>;
  size$: Observable<number> = this.firestore
    .collection('users')
    .get()
    .pipe(map((response) => response.size));

  constructor(private store: Store, public modalController: ModalController, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.store.dispatch(new GetUsers());
  }

  async show(userData: AuthenticationStateModel) {
    const modal = await this.modalController.create({
      component: UserComponent,
      componentProps: {
        userData,
      },
    });
    return await modal.present();
  }

  loadData(event: any): void {
    this.store.dispatch(
      new FetchUsers({
        complete: () => event.target.complete(),
      })
    );
  }
}
