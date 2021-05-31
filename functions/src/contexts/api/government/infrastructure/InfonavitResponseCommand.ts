import * as admin from 'firebase-admin';
import { Command } from '../application/CommandBatch';
import { Birthday } from '../domain/Birthday';
import { SecuritySocialNumber } from '../domain/SecuritySocialNumber';
import { InfonavitResponse } from './../domain/InfonavitResponse';

export class MexicanGeneratorCommand implements Command {
  constructor(private name: string, private birthday: Birthday, private id: SecuritySocialNumber) {}
  async execute() {
    return admin.firestore().collection('imss').doc(this.id.value).set({
      name: this.name,
      birthday: this.birthday.originalValue,
      nss: this.id.value,
    });
  }
}

export class InfonavitResponseCommand implements Command {
  constructor(private id: SecuritySocialNumber) {}
  execute(infonavitResponse: InfonavitResponse) {
    if (!infonavitResponse) {
      return null;
    }
    return admin
      .firestore()
      .collection('infonavit')
      .doc(this.id.value)
      .set({
        ...infonavitResponse,
        created_at: new Date(),
      });
  }
}
