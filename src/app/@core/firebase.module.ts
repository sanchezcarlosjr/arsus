import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from '@env/environment';
import { APP_NAME, APP_VERSION, DEBUG_MODE, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

@NgModule({
  imports: [AngularFireModule.initializeApp(environment.firebaseConfig)],
  exports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    AngularFireFunctionsModule,
  ],
  providers: [
    { provide: REGION, useValue: 'us-central1' },
    ScreenTrackingService,
    UserTrackingService,
    { provide: APP_NAME, useValue: 'SanchezCarlosJr' },
    { provide: DEBUG_MODE, useValue: !environment.production },
    { provide: APP_VERSION, useValue: environment.version },
  ],
})
export class FirebaseModule {}
