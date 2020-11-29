import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { filter, map, switchMap } from 'rxjs/operators';
import { ToastService } from './../../@shared/toast.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  loginForm!: FormGroup;
  @ViewChild('slides') slides: IonSlides;
  private responseAcc: any = null;
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private toast: ToastService,
    private loadingController: LoadingController,
    private store: Store
  ) {
    this.createForm();
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.store.select(AuthStateModule.uid).pipe(
      filter((uid) => !!uid),
      switchMap((uid) =>
        this.firestore.collection('users').doc(uid).get().pipe(
          map((doc) => doc.data().CURP),
          switchMap((curp: string) => {
            if (curp) {
              return this.http.get('https://us-west4-arsus-production.cloudfunctions.net/curp', {
                params: {
                  apiKey: uid,
                  curp: curp
                }
              })
            }
            return null;
          })
        )
      )
    ).subscribe((response) => {
      if (response) {
        this.responseAcc = response;
        this.slides.slideNext();
      }
      loading.dismiss();
    });
  }

  async saveCURP() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.store.select(AuthStateModule.uid).pipe(
      switchMap((uid) => this.http.get('https://us-west4-arsus-production.cloudfunctions.net/curp', {
        params: {
          apiKey: uid,
          curp: this.loginForm.value.curp
        }
      }).pipe(
        switchMap((response: { curp: string }) => {
          return this.firestore.collection('users').doc(uid).get().pipe(map((doc) => {
            if (doc.data().CURP === response.curp) {
              throw new Error('CURP linked to another user.');
            }
            return {
              curp: response.curp,
              uid
            }
          }))
        })
      )
      )
    ).subscribe((response: any) => {
      loading.dismiss();
      this.responseAcc = response;
      this.firestore.collection('users').doc(response.uid).update({
        CURP: response.curp
      });
      this.slides.slideNext();
    }, (error) => {
      loading.dismiss();
      this.toast.showError(error?.error?.error || error.message);
    });
  }

  login() {
    this.http.post(localStorage.getItem('webhook'), {
      body: this.responseAcc
    }).toPromise().then(() => document.location.href = localStorage.getItem('redirect_uri'));
  }

  ngOnDestroy() { }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      permissions: this.formBuilder.group({
        identifyByCURP: [true],
        shareDataOfCURP: [true],
      }),
      curp: ['', [Validators.required, Validators.pattern(/^[A-Z]{1}[AEIXOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/)]],
    });
  }

}
