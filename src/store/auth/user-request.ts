import { AngularFireFunctions } from '@angular/fire/functions';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { take } from 'rxjs/operators';

export class UserRequest {
  static async device() {
    const info = await Device.getInfo();
    const language = await Device.getLanguageCode();
    return {
      ...info,
      language: language.value,
    };
  }

  static async locate() {
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  }
  constructor(private cloudFunctions: AngularFireFunctions) {}

  public getRequest(userCredential: any) {
    const providerId = userCredential.additionalUserInfo.providerId.split('.')[0];
    return {
      app: 'sanchezcarlosjr',
      user: {
        emailVerified: userCredential.user.emailVerified,
        creationTime: userCredential.user.metadata.creationTime,
        lastSignInTime: userCredential.user.metadata.lastSignInTime,
        isAnonymous: userCredential.user.isAnonymous,
        lastProvider: providerId,
        phoneNumber: userCredential.user.phoneNumber,
        isNewUser: userCredential.additionalUserInfo.isNewUser,
        ...userCredential.user.providerData[0],
        uid: userCredential.user.uid,
        [`${providerId}`]: {
          ...userCredential.credential,
          oid: userCredential.user.providerData[0].uid,
          ...userCredential.additionalUserInfo.profile,
        },
      },
      device: {},
    };
  }

  execute(userCredential: any) {
    if (userCredential.redirect.user) {
      const request = this.getRequest(userCredential.redirect);
      return this.cloudFunctions.httpsCallable('storeUser')(request).pipe(take(1)).toPromise();
    }
  }
}
