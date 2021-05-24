import { Subject } from './UABCScrapper';
import * as functions from 'firebase-functions';
import { post } from 'request-promise';
import * as moment from 'moment';

export interface UABCCalendar {
  startDate: Date;
  endDate: Date;
}

export class GoogleCalendar {
  constructor(private tokenUID: string, private email: string, private uabcCalendar: UABCCalendar) {}

  createSubjects(days: Subject[][]) {
    const until = moment(this.uabcCalendar.endDate).add(1, 'days').format('YYYYMMDD');
    return days.map((day, index) => {
      day.forEach((subject) => {
        const dayOfWeek = moment(this.uabcCalendar.startDate).add(index, 'days').format('YYYY-MM-DD');
        return post({
          uri: `https://www.googleapis.com/calendar/v3/calendars/${this.email}/events`,
          qs: {
            key: functions.config().google.key,
          },
          body: {
            end: {
              dateTime: `${dayOfWeek}T${subject.finishedHour}:00.000-07:00`,
              timeZone: 'America/Tijuana',
            },
            start: {
              dateTime: `${dayOfWeek}T${subject.startHour}:00.000-07:00`,
              timeZone: 'America/Tijuana',
            },
            location: subject.location,
            description: subject.rest,
            summary: `${subject.group} - ${subject.name}`,
            colorId: '10',
            recurrence: [`RRULE:FREQ=WEEKLY;UNTIL=${until}T070000Z`],
          },
          headers: {
            Referer: 'https://us-central1-arsus-production.cloudfunctions.net/',
          },
          auth: {
            bearer: this.tokenUID,
          },
          json: true,
        });
      });
    });
  }
}
