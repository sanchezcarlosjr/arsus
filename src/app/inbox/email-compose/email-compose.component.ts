import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-email-compose',
  templateUrl: './email-compose.component.html',
  styleUrls: ['./email-compose.component.scss'],
})
export class EmailComposeComponent implements OnInit {
  communicationForm!: FormGroup;

  constructor(
    private cloudFunctions: AngularFireFunctions,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  async upload() {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      await this.cloudFunctions.httpsCallable('InboxSender')(this.communicationForm.value).toPromise();
      this.communicationForm.reset({
        to: [''],
        type: ['email'],
        subject: [''],
        message: [''],
      });
    } catch (e) {
      console.warn(e);
    } finally {
      await loading.dismiss();
    }
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
