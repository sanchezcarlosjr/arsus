import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
  authorizedForm: FormGroup;
  @Select(AuthStateModule.uid) uid$: Observable<string>;
  constructor(private toast: ToastController, private store: Store, private formBuilder: FormBuilder, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.authorizedForm = this.formBuilder.group({
      authorizedJavaScriptOrigins: new FormArray([this.createAFormControl()]),
      authorizedRedirectURIs: new FormArray([this.createAFormControl()]),
      authorizedWebhooks: new FormArray([this.createAFormControl()])
    });
  }

  createAFormControl() {
    const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    return new FormControl('', [Validators.required, Validators.pattern(pattern)]);
  }

  add(formArrayName: string) {
    (this.authorizedForm.get(formArrayName) as FormArray).push(this.createAFormControl())
  }

  remove(formArrayName: string, index: number) {
    (this.authorizedForm.get(formArrayName) as FormArray).removeAt(index);
  }

  save() {
    const value = this.authorizedForm.value;
    console.log(value.authorizedJavaScriptOrigins);
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
