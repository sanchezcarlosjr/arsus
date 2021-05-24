import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';
import { UABCScrapper } from '../../../src/contexts/uabc_scheduler/infraestructure/UABCScrapper';
import { GoogleCalendar } from '../../../src/contexts/uabc_scheduler/infraestructure/GoogleCalendar';

mocha.describe('UABCScheduler', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it.only('should scrape UABC Site', async () => {
    const uabc = new UABCScrapper('', '');
    const subjects = await uabc.scrape();
    console.log(subjects);
  });
  it('should request Google Calendar', async () => {
    const googleCalendar = new GoogleCalendar('', '', {
      startDate: new Date('2021-08-9'),
      endDate: new Date('2021-12-4'),
    });
    await googleCalendar.createSubjects([
      [
        {
          name: 'PROGRAMACION ORIENTADA A OBJETOS',
          startHour: '11:00',
          finishedHour: '13:00',
          group: '1197455',
          location: '',
          rest: '',
        },
      ],
    ]);
  });
});
