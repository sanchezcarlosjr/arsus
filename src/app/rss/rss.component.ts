import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { firestore } from 'firebase/app';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss'],
})
export class RssComponent implements OnInit {
  private userUID: string;
  sources = this.store.selectOnce(AuthStateModule.uid).pipe(
    switchMap((userUID: string) => {
      this.userUID = userUID;
      return this.firestore
        .collection('sources', (query) => query.where('subscribers', 'array-contains', userUID))
        .valueChanges();
    })
  );

  constructor(
    private firestore: AngularFirestore,
    private store: Store,
    private alertController: AlertController,
    private cloudFunctions: AngularFireFunctions
  ) {}

  ngOnInit(): void {}

  remove(uid: string) {
    this.firestore
      .collection('sources')
      .doc(uid)
      .update({
        subscribers: firestore.FieldValue.arrayRemove(this.userUID),
      });
  }

  async add() {
    const alert = await this.alertController.create({
      header: 'Add a news source',
      inputs: [
        {
          name: 'link',
          type: 'text',
          placeholder: 'URL (XML, YouTube, Twitter, Api,...)',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: async (data) => {
            await this.cloudFunctions
              .httpsCallable('AddSourceNewsController')({
                id: data.link,
              })
              .toPromise();
          },
        },
      ],
    });
    await alert.present();
  }
}
