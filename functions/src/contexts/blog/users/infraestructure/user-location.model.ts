const request = require('request-promise');
const admin = require('firebase-admin');

export class UserLocation {
  private readonly ip: string;
  private readonly options: any;

  constructor(private rawRequest: any) {
    this.ip = this.rawRequest.header('x-forwarded-for');
    this.options = {
      uri: `https://ipapi.co/${this.ip}/json/`,
      headers: {
        'user-agent': `ipapi/ipapi-nodejs/0.3.0`,
      },
      json: true,
    };
  }

  public async store(userUID: string) {
    const location = await request(this.options);
    admin.firestore().collection(`users/${userUID}/locations`).doc(this.ip).set(location);
  }
}
