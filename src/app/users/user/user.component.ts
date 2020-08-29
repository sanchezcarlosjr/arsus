import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationStateModel } from '@store/auth/auth.state';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { JsonPipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() userData: AuthenticationStateModel;
  formControl = new FormControl('');
  constructor(private modalController: ModalController, private json: JsonPipe, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.formControl.patchValue(this.json.transform(this.userData));
  }

  async update() {
    await this.modalController.dismiss();
    await this.firestore.doc(`users/${this.userData.uid}`).update({
      profile: this.formControl.value,
    });
  }
}
