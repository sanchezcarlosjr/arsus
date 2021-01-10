import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  @Select(AuthStateModule.uid) uid$: Observable<string>;
  constructor(private toast: ToastController, private store: Store) {}

  ngOnInit(): void {}

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
