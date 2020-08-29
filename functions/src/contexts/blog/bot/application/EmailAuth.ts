import { Intent } from '../../../email/domain/intent';
import { Agent } from '../../../email/infraestructure/webhook-client';
import admin from 'firebase-admin';

export class EmailAuth extends Intent {
  constructor() {
    super('email');
  }

  control(agent: Agent): void {
    const phoneNumberPattern = /[+]*[(]?[0-9]{1,4}[)]?[-\s.\/0-9]*/g;
    const phoneNumber = agent.session.match(phoneNumberPattern)[0] || '';
    console.log(phoneNumber);
    // agent.add(`You automatically signed up on https://sanchezcarlosjr.com/login too. Your password is 123 and your user name is ${agent.parameters.email}`);
    admin
      .auth()
      .createUser({
        email: agent.parameters.email,
        phoneNumber,
        emailVerified: false,
        password: '123',
        photoURL: '',
        disabled: false,
      })
      .then((a) => console.log(a))
      .catch((e) => console.log(e.message));
  }
}
