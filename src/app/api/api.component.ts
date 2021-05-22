import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  authorizedForm: FormGroup = this.formBuilder.group({
    authorizedRedirectURIs: new FormArray([this.createAFormControl()]),
  });
  @Select(AuthStateModule.uid) uid$: Observable<string>;

  constructor(
    private toast: ToastController,
    private store: Store,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .doc(this.store.selectSnapshot(AuthStateModule.uid))
      .valueChanges()
      .pipe(take(1))
      .subscribe((user: any) => this.load(user.authorizedRedirectURIs, 'authorizedRedirectURIs'));
  }

  load(field: string, name: string) {
    const input = field ? field.split(',') : [''];
    (this.authorizedForm.get(name) as FormArray).at(0).setValue(input[0]);
    input.slice(1).forEach((value) => this.add(name, value));
  }

  createAFormControl(value = '') {
    const pattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return new FormControl(value, [Validators.required, Validators.pattern(pattern)]);
  }

  add(formArrayName: string, value = '') {
    (this.authorizedForm.get(formArrayName) as FormArray).push(this.createAFormControl(value));
  }

  remove(formArrayName: string, index: number) {
    (this.authorizedForm.get(formArrayName) as FormArray).removeAt(index);
  }

  save() {
    this.firestore
      .collection('users')
      .doc(this.store.selectSnapshot(AuthStateModule.uid))
      .update({
        authorizedRedirectURIs: this.authorizedForm.value.authorizedRedirectURIs.join(','),
      });
  }

  async writeInClipboardUserUID() {
    const toast = this.toast.create({
      message: 'Copy to Clipboard',
      duration: 10000,
    });
    Clipboard.write({
      string: this.store.selectSnapshot(AuthStateModule.uid),
    }).then(() => toast.then((res) => res.present()));
  }
}
