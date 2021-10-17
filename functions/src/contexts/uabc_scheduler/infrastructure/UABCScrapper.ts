import { PageScrapper } from '../../shared/PageScrapper';

export interface Subject {
  location: string;
  startHour: string;
  finishedHour: string;
  name: string;
  group: string;
  rest: string;
}

export class UABCScrapper {
  private readonly URL: string =
    'https://alumnos.uabc.mx/web/alumnos/bienvenido?p_p_state=maximized&p_p_mode=view&refererPlid=49&saveLastPath=false&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin&p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&_com_liferay_login_web_portlet_LoginPortlet_redirect=%2Fgroup%2Falumnos%2Fhorario';

  constructor(private user: string, private password: string) {}

  async scrape(): Promise<Subject[][]> {
    const page = await PageScrapper.getInstance(this.URL);
    await page.type('//*[@id="_com_liferay_login_web_portlet_LoginPortlet_login"]', this.user);
    await page.type('//*[@id="_com_liferay_login_web_portlet_LoginPortlet_password"]', this.password);
    await page.click(
      '/html/body/div[1]/div/section/div/div/div/div/section/div/div[2]/div/div/form/fieldset/div[2]/button'
    );
    const scheduler: any[][] = [];
    for (let day = 1; day < 6; day++) {
      const total = await page.count(
        `/html/body/div[1]/div/section/div/section[4]/div/div/div/div/div/section/div/div/div/div/div[1]/div/div/div[2]/ul/li[${day}]/ul/li`
      );
      const courses: Subject[] = [];
      for (let course = 1; course < total + 1; course++) {
        const c: string = await page.read(
          `/html/body/div[1]/div/section/div/section[4]/div/div/div/div/div/section/div/div/div/div/div[1]/div/div/div[2]/ul/li[${day}]/ul/li[${course}]`
        );
        const subject = {
          name: c.match(/(?:\d|\*)([A-Z]+[A-Z ]*) -/)[1],
          startHour: c.match(/\d\d:\d\d/g)[0],
          finishedHour: c.match(/\d\d:\d\d/g)[1],
          group: c.match(/Grupo: (\d+)/)[1],
          location: `Salón: ${c.match(/Salón: (\w+)/)[1]}`,
          rest: c,
        };
        courses.push(subject);
      }
      scheduler.push(courses);
    }
    return scheduler;
  }
}
